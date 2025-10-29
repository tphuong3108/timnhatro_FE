import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import PostCard from "@/components/ui/PostCard";
import { roomApi } from "@/services/roomApi";

export default function TopRatedRooms() {
  const [topRooms, setTopRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTopRooms = useCallback(async () => {
    try {
      if (!refreshing) setLoading(true);
      const res = await roomApi.getAllRooms();

      const rooms =
        res?.rooms ||
        res?.data?.rooms ||
        res?.data?.data?.rooms ||
        res?.data?.data ||
        res?.data ||
        [];

      if (!Array.isArray(rooms)) {
        console.warn("⚠️ Dữ liệu không phải mảng:", rooms);
        setTopRooms([]);
        return;
      }

      const top = rooms
        .filter((r: any) => r.avgRating >= 4 || r.totalLikes > 3)
        .sort((a: any, b: any) => b.avgRating - a.avgRating)
        .slice(0, 6);

      setTopRooms(top);
    } catch (error) {
      console.error("❌ Lỗi khi lấy phòng nổi bật:", error);
      setTopRooms([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  // ✅ Gọi lần đầu và tự động refresh định kỳ
  useEffect(() => {
    fetchTopRooms();

    // Refresh lại mỗi 15 giây
    const interval = setInterval(() => {
      console.log("🔄 Tự động refresh phòng nổi bật...");
      fetchTopRooms();
    }, 15000);

    // Clear interval khi unmount
    return () => clearInterval(interval);
  }, [fetchTopRooms]);

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center py-10">
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text className="text-gray-500 mt-2">Đang tải phòng nổi bật...</Text>
      </View>
    );
  }

  if (!topRooms || topRooms.length === 0) {
    return (
      <View className="px-5 items-center">
        <Text className="text-gray-500 text-sm italic mb-3">
          Hiện chưa có phòng nổi bật nào.
        </Text>
      </View>
    );
  }

  return (
    <View className="px-5">
      <FlatList
        data={topRooms}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostCard item={item} />}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
            tintColor="#3F72AF"
            colors={["#3F72AF"]}
          />
        }
      />
    </View>
  );
}
