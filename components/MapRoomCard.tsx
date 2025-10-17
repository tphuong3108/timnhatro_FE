import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Room } from "@/constants/data/rooms";

export default function MapRoomCard({ room }: { room: Room }) {
  return (
    <View className="bg-white rounded-3xl mb-4 shadow border border-gray-100 overflow-hidden">
      {/* Carousel ảnh */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        className="w-full h-[200px]"
      >
        {room.images.map((img, idx) => (
          <Image
            key={idx}
            source={{ uri: img }}
            className="w-full h-[200px]"
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* ❤️ */}
      <TouchableOpacity className="absolute top-3 right-3 bg-black/40 p-2 rounded-full">
        <Ionicons name="heart-outline" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Badge “Được yêu thích” */}
      {room.avgRating > 4.7 && (
        <View className="absolute top-3 left-3 bg-white/90 px-2 py-[2px] rounded-md">
          <Text className="text-[12px] font-semibold text-gray-800">
            Được khách yêu thích
          </Text>
        </View>
      )}

      {/* Nội dung */}
      <View className="p-3">
        <Text className="font-semibold text-gray-800 text-base" numberOfLines={1}>
          {room.name}
        </Text>
        <Text className="text-gray-500 text-sm mt-1" numberOfLines={2}>
          {room.address}
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text className="ml-1 text-gray-700 text-sm">
            {room.avgRating} ({room.totalRatings})
          </Text>
        </View>
        <Text className="text-[#3F72AF] font-bold text-base mt-2">
          {room.price.toLocaleString("vi-VN")}đ / tháng
        </Text>
      </View>
    </View>
  );
}
