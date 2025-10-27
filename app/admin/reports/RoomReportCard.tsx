import { RoomReport } from "@/constants/data/RoomReport";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

interface Props {
  room: RoomReport;
}

export default function RoomReportCard({ room }: Props) {
  return (
    <View className="bg-white rounded-3xl p-4 mb-5 border border-gray-100 shadow-sm">
      {/* Header */}
      <View className="flex-row">
        {/* Ảnh phòng */}
        <Image
          source={{ uri: room.image }}
          className="w-[110px] h-[110px] rounded-2xl"
        />

        {/* Nội dung */}
        <View className="flex-1 ml-3 justify-between">
          <View>
            <Text
              className="font-semibold text-[#112D4E] text-[16px]"
              numberOfLines={1}
            >
              {room.name}
            </Text>
            <Text className="text-gray-500 text-[13px]" numberOfLines={1}>
              {room.address}
            </Text>
          </View>

          {/* Thống kê */}
          <View className="flex-row items-center mt-2 space-x-4">
            <View className="flex-row items-center">
              <Ionicons name="eye-outline" size={14} color="#3F72AF" />
              <Text className="text-gray-600 text-[12px] ml-1">
                {room.views}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="heart-outline" size={14} color="#E57373" />
              <Text className="text-gray-600 text-[12px] ml-1">
                {room.likes}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="star-outline" size={14} color="#F4B400" />
              <Text className="text-gray-600 text-[12px] ml-1">
                {room.rating.toFixed(1)} ({room.totalReviews})
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-gray-100">
        {/* Host */}
        <View className="flex-row items-center">
          <Image
            source={{ uri: room.host.avatar }}
            className="w-[28px] h-[28px] rounded-full mr-2"
          />
          <Text
            className="text-gray-700 text-[13px] font-medium"
            numberOfLines={1}
          >
            {room.host.name}
          </Text>
        </View>

        {/* Trạng thái */}
        <View
          className={`px-3 py-1.5 rounded-full flex-row items-center ${
            room.status === "approved"
              ? "bg-[#E6F6ED]"
              : room.status === "pending"
              ? "bg-[#FFF7E6]"
              : "bg-[#FDE8E8]"
          }`}
        >
          <Ionicons
            name={
              room.status === "approved"
                ? "checkmark-circle"
                : room.status === "pending"
                ? "time-outline"
                : "close-circle"
            }
            size={14}
            color={
              room.status === "approved"
                ? "#34D399"
                : room.status === "pending"
                ? "#FBBF24"
                : "#F87171"
            }
          />
          <Text
            className={`ml-1 text-[12px] font-semibold ${
              room.status === "approved"
                ? "text-[#15803D]"
                : room.status === "pending"
                ? "text-[#92400E]"
                : "text-[#B91C1C]"
            }`}
          >
            {room.status === "approved"
              ? "Đã duyệt"
              : room.status === "pending"
              ? "Chờ duyệt"
              : "Từ chối"}
          </Text>
        </View>
      </View>
    </View>
  );
}
