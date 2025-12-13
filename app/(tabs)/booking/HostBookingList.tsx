import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { Booking, bookingApi } from "../../../services/bookingApi";

const STATUS_COLORS: Record<string, string> = {
  pending: "#8FAFD6",
  approved: "#3F72AF",
  declined: "#B9D7EA",
  completed: "#3F72AF",
};

const HostBookingList = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getHostBookings();
      setBookings(res.data);
    } catch (err) {
      console.log("Load host bookings error:", err);
      Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể tải danh sách booking.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = async (id: string, action: "approve" | "decline" | "complete") => {
    try {
      switch (action) {
        case "approve":
          await bookingApi.approveBooking(id);
          Toast.show({ type: 'success', text1: 'Thành công', text2: 'Booking đã được duyệt.' });
          break;
        case "decline":
          await bookingApi.declineBooking(id);
          Toast.show({ type: 'success', text1: 'Thành công', text2: 'Booking đã bị từ chối.' });
          break;
        case "complete":
          await bookingApi.completeBooking(id);
          Toast.show({ type: 'success', text1: 'Thành công', text2: 'Booking đã hoàn thành.' });
          break;
      }
      loadData();
    } catch (err: any) {
      console.log(err);
      Toast.show({ type: 'error', text1: 'Lỗi', text2: err?.response?.data?.error || 'Có lỗi xảy ra' });
    }
  };

  const renderItem = ({ item }: { item: Booking }) => (
    <View className="mb-4 bg-white rounded-xl p-4 shadow-md">
      {/* Header: Tên phòng + trạng thái */}
      <View className="flex-row items-center mb-2">
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text numberOfLines={1} ellipsizeMode="tail" className="font-bold text-lg">
            {item.roomId?.name || "N/A"}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: STATUS_COLORS[item.status] || "#ccc",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            minWidth: 70,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text className="text-white font-semibold text-xs">{item.status.toUpperCase()}</Text>
        </View>
      </View>

      {/* Thông tin người đặt + avatar */}
      <View className="flex-row items-center mb-1">
        {typeof item.userId === "object" && item.userId.avatar ? (
          <Image
            source={{ uri: item.userId.avatar }}
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 8 }}
          />
        ) : (
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#ccc",
              marginRight: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="person" size={20} color="#fff" />
          </View>
        )}
        <Text className="font-medium">
          {typeof item.userId === "object"
            ? item.userId.displayName ||
            `${item.userId.firstName ?? ""} ${item.userId.lastName ?? ""}`.trim()
            : "N/A"}
        </Text>
      </View>

      {/* Thông tin booking */}
      <Text>Ngày: {item.date}</Text>
      <Text>Giờ: {item.time}</Text>
      <Text className="italic mt-1 text-gray-500">Ghi chú: {item.note || "-"}</Text>

      {/* Nút hành động */}
      <View className="flex-row mt-3 space-x-2">
        {item.status === "pending" && (
          <>
            {/* Duyệt */}
            <TouchableOpacity
              className="flex-1 p-2 rounded-lg flex-row justify-center items-center"
              style={{ backgroundColor: "#3F72AF" }}
              onPress={() => handleAction(item._id, "approve")}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#fff"
                style={{ marginRight: 4 }}
              />
              <Text className="text-white text-center font-semibold">Duyệt</Text>
            </TouchableOpacity>

            {/* Từ chối */}
            <TouchableOpacity
              className="flex-1 p-2 rounded-lg flex-row justify-center items-center"
              style={{ backgroundColor: "#B9D7EA" }}
              onPress={() => handleAction(item._id, "decline")}
            >
              <Ionicons
                name="close-circle-outline"
                size={16}
                color="#3F72AF"
                style={{ marginRight: 4 }}
              />
              <Text className="text-[#3F72AF] text-center font-semibold">
                Từ chối
              </Text>
            </TouchableOpacity>
          </>
        )}

        {item.status === "approved" && (
          <TouchableOpacity
            className="flex-1 p-2 rounded-lg flex-row justify-center items-center"
            style={{ backgroundColor: "#3F72AF" }}
            onPress={() => handleAction(item._id, "complete")}
          >
            <Ionicons
              name="checkmark-done-outline"
              size={16}
              color="#fff"
              style={{ marginRight: 4 }}
            />
            <Text className="text-white text-center font-semibold">
              Hoàn thành
            </Text>
          </TouchableOpacity>
        )}
      </View>

    </View>
  );

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">Lịch Xem Phòng</Text>

      {loading && bookings.length === 0 ? (
        <ActivityIndicator size="large" color="#0000ff" className="mt-6" />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={loadData}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-6">
              <Text className="text-gray-500 text-center">Chưa có booking nào.</Text>
            </View>
          }
          contentContainerStyle={
            bookings.length === 0 ? { flexGrow: 1, justifyContent: "center" } : undefined
          }
        />
      )}

      <Toast position="top" />
    </View>
  );
};

export default HostBookingList;
