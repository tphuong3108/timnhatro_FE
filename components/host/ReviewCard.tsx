import React from "react";
import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ReviewCard({ review }: { review: any }) {
  const user = review.userId || {};
  const avatar =
    user.avatar || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
  const name = user.fullName || "Người dùng ẩn danh";
  const date = new Date(review.createdAt).toLocaleDateString("vi-VN");

  return (
    <View className="flex-row border-b border-gray-100 pb-3 mb-3">
      <Image source={{ uri: avatar }} className="w-10 h-10 rounded-full mr-3" />
      <View className="flex-1">
        <Text className="font-semibold text-[#112D4E] text-[14px]">{name}</Text>
        <Text className="text-gray-400 text-[11px] mb-1">{date}</Text>

        <View className="flex-row items-center mb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < review.rating ? "star" : "star-outline"}
              size={13}
              color="#FFD700"
            />
          ))}
        </View>

        <Text className="text-gray-600 text-[13px]">{review.comment}</Text>
      </View>
    </View>
  );
}
