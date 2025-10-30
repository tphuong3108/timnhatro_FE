import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PostCard from "./PostCard";
import { adminApi } from "@/services/adminApi";

export default function PostList() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");

  /** ✅ Load danh sách phòng có phân trang */
  const fetchRooms = useCallback(async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await adminApi.getAllRooms({ page: pageNum });
      const data = res?.rooms || res?.data?.rooms || [];
      const pagination = res?.pagination || res?.data?.pagination || {};

      if (append) setRooms((prev) => [...prev, ...data]);
      else setRooms(data);

      setTotalPages(pagination?.totalPages || 1);
      setPage(pageNum);
    } catch (error: any) {
      console.error("❌ Lỗi khi tải phòng:", error?.response?.data || error.message);
      Alert.alert("Lỗi", "Không thể tải danh sách phòng!");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms(1);
  }, []);

  /** ✅ Kéo xuống để tải thêm */
  const handleScroll = async (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isNearBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;

    if (isNearBottom && !loadingMore && page < totalPages) {
      await fetchRooms(page + 1, true);
    }
  };

  /** ✅ Làm mới danh sách */
  const onRefresh = async () => {
    await fetchRooms(1);
  };

  /** ✅ Duyệt / Từ chối phòng */
  const handleApprove = async (id: string, status: "approved" | "rejected") => {
    try {
      const confirmText = status === "approved" ? "duyệt" : "từ chối";
      Alert.alert("Xác nhận", `Bạn có chắc muốn ${confirmText} phòng này?`, [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          style: "destructive",
          onPress: async () => {
            await adminApi.approveRoom(id, status);
            Alert.alert("Thành công", `Phòng đã được ${confirmText}.`);
            fetchRooms(1);
          },
        },
      ]);
    } catch (error: any) {
      console.error(`❌ Lỗi khi ${status} phòng:`, error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái phòng!");
    }
  };

  /** ✅ Xóa mềm phòng */
  const handleDelete = async (id: string) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa phòng này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await adminApi.deleteRoom(id);
            Alert.alert("Thành công", "Phòng đã bị xóa.");
            fetchRooms(1);
          } catch (error: any) {
            console.error("❌ Lỗi khi xóa phòng:", error);
            Alert.alert("Lỗi", "Không thể xóa phòng!");
          }
        },
      },
    ]);
  };

  const filteredRooms =
    filter === "all" ? rooms : rooms.filter((r) => r.status === filter);

  return (
    <View className="flex-1 bg-[#F9FAFB] px-3 pt-3">
      {/* 🔹 Bộ lọc trạng thái */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mb-4"
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 4,
          width: "103%",
        }}
      >
        {[
          { key: "all", label: "Tất cả" },
          { key: "approved", label: "Đã duyệt" },
          { key: "pending", label: "Chờ duyệt" },
          { key: "rejected", label: "Từ chối" },
        ].map((tab) => {
          const isActive = filter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setFilter(tab.key as any)}
              activeOpacity={0.8}
              className={`px-5 py-2 mx-1 rounded-full ${
                isActive ? "bg-[#3F72AF]" : "bg-gray-200"
              }`}
            >
              <Text
                className={`text-[14px] font-semibold ${
                  isActive ? "text-white" : "text-[#112D4E]"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 🔹 Danh sách phòng */}
      {loading ? (
        <View className="flex-1 justify-center items-center mt-10">
          <ActivityIndicator size="large" color="#3F72AF" />
          <Text className="text-gray-500 mt-2">Đang tải danh sách phòng...</Text>
        </View>
      ) : filteredRooms.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={200}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        >
          {filteredRooms.map((room) => (
            <PostCard
              key={room._id}
              room={room}
              onApprove={() => handleApprove(room._id, "approved")}
              onReject={() => handleApprove(room._id, "rejected")}
              onDelete={() => handleDelete(room._id)}
            />
          ))}
          {loadingMore && (
            <View className="py-4 flex-row justify-center items-center">
              <ActivityIndicator size="small" color="#3F72AF" />
              <Text className="text-gray-500 ml-2">Đang tải thêm...</Text>
            </View>
          )}
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center items-center mt-10">
          <Ionicons name="home-outline" size={32} color="#94A3B8" />
          <Text className="text-gray-400 mt-2">
            Không có phòng nào phù hợp với bộ lọc
          </Text>
        </View>
      )}
    </View>
  );
}
