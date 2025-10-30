import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function RoomItem({ room }: { room: any }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/room/${room._id || room.slug}`)}
      activeOpacity={0.9}
      className="bg-white rounded-2xl shadow p-3 mb-3 flex-row items-center"
    >
      <Image
        source={{
          uri:
            room.images?.[0] ||
            "https://via.placeholder.com/100x100.png?text=No+Image",
        }}
        className="w-[90px] h-[90px] rounded-xl"
      />
      <View className="flex-1 ml-3">
        <Text
          className="text-[#112D4E] font-semibold text-[15px]"
          numberOfLines={1}
        >
          {room.name}
        </Text>
        <Text className="text-gray-500 text-[12px]" numberOfLines={1}>
          {room.address || "Đang cập nhật"}
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="eye-outline" size={14} color="#3F72AF" />
          <Text className="ml-1 text-gray-500 text-[12px]">
            {room.viewCount || 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
