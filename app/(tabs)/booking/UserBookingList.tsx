// src/screens/Booking/UserBookingList.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { bookingApi, Booking } from "../../../services/bookingApi";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const STATUS_COLORS: Record<string, string> = {
  pending: "#FFA500",
  approved: "#4CAF50",
  declined: "#F44336",
  canceled: "#9E9E9E",
  completed: "#21e821ff",
};

const UserBookingList = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.getUserBookings();
      setBookings(res.data);
    } catch (err) {
      console.log("Lỗi tải lịch đặt:", err);
      Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể tải danh sách booking.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancel = async (id: string) => {
    try {
      await bookingApi.cancelBooking(id);
      Toast.show({ type: 'success', text1: 'Thành công', text2: 'Booking đã được hủy.' });
      loadData();
    } catch (err: any) {
      console.log(err);
      Toast.show({ type: 'error', text1: 'Lỗi', text2: err?.response?.data?.error || 'Có lỗi xảy ra' });
    }
  };

  const renderItem = ({ item }: { item: Booking }) => {
    const firstImage = item.roomId?.images?.[0];

    return (
      <View className="bg-white p-4 rounded-xl border border-gray-300 mb-3 shadow flex-row">
        {/* Thông tin */}
        <View className="flex-1 pr-2 justify-between">
          <Text className="text-lg font-bold mb-1">{item.roomId?.name || "Chưa có tên"}</Text>
          {item.roomId?.address && <Text className="text-gray-600 mb-1">Địa chỉ: {item.roomId.address}</Text>}
          {item.roomId?.price && <Text className="text-gray-600 mb-1">Giá: {item.roomId.price} VND</Text>}
          <Text className="text-gray-600 mb-1">Ngày: {item.date}</Text>
          <Text className="text-gray-600 mb-1">Giờ: {item.time}</Text>
          {item.note && <Text className="text-gray-600 mb-1">Ghi chú: {item.note}</Text>}
          <Text className="italic text-sm mt-1">
            Trạng thái:{" "}
            <Text style={{ color: STATUS_COLORS[item.status] || "#000" }}>{item.status}</Text>
          </Text>

          {/* Nút Hủy */}
          {item.status === "pending" && (
            <TouchableOpacity
              className="mt-2 flex-row items-center bg-red-500 p-2 rounded-lg justify-center"
              onPress={() => handleCancel(item._id)}
            >
              <Ionicons name="trash-outline" size={16} color="#fff" className="mr-1" />
              <Text className="text-white font-semibold">Hủy</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Hình ảnh phòng */}
        {firstImage && (
          <Image
            source={{ uri: firstImage }}
            className="w-32 h-32 rounded-xl"
            resizeMode="cover"
          />
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">Lịch xem phòng của bạn</Text>

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
            <View className="flex-1 justify-center items-center mt-10">
              <Text className="text-gray-500 text-center">Bạn chưa có lịch xem phòng nào.</Text>
            </View>
          }
          contentContainerStyle={bookings.length === 0 ? { flexGrow: 1, justifyContent: "center" } : undefined}
        />
      )}

      <Toast position="top" />
    </View>
  );
};

export default UserBookingList;
