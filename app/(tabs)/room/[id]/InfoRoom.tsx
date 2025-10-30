import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function InfoRoom({ room }: any) {
  return (
    <View className="px-5 py-5 bg-white mx-4 -mt-8 rounded-2xl p-4 shadow shadow-black/10 ">
      {/* Tên phòng */}
      <Text className="text-2xl font-bold text-[#3F72AF] mb-1">
        {room.name}
      </Text>

      {/* Địa chỉ */}
      <View className="flex-row items-center mb-2">
        <Ionicons name="location-outline" size={14} color="#3F72AF" />
        <Text className="text-gray-600 text-[13px] ml-1">{room.address}</Text>
      </View>

      {/* Giá */}
      <Text className="text-[#3F72AF] font-bold text-lg mb-1">
        {room.price.toLocaleString("vi-VN")}đ / tháng
      </Text>
    </View>
  );
}
