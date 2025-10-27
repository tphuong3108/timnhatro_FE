import React from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RoomReportCard from "./RoomReportCard";
import { useRoomReportData } from "@/constants/data/useRoomReportData";

export default function RoomReportList() {
  const { rooms, loading } = useRoomReportData();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-20">
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text className="text-gray-500 mt-3">Đang tải báo cáo phòng...</Text>
      </View>
    );
  }

  const total = rooms.length;
  const approved = rooms.filter((r) => r.status === "approved").length;
  const pending = rooms.filter((r) => r.status === "pending").length;
  const rejected = rooms.filter((r) => r.status === "rejected").length;

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      {/* Tiêu đề */}
      <Text className="text-[18px] font-semibold text-[#112D4E] mb-4">
        Báo cáo phòng ({total})
      </Text>

      {/* Tổng quan trạng thái */}
      <View className="bg-white rounded-3xl p-4 mb-5 border border-gray-100 shadow-sm">
        <View className="flex-row justify-between">
          {/* Đã duyệt */}
          <View className="flex-row items-center space-x-2">
            <Ionicons name="checkmark-circle" size={18} color="#34D399" />
            <View>
              <Text className="text-green-600 font-semibold text-[14px]">
                Đã duyệt
              </Text>
              <Text className="text-gray-700 text-[13px]">{approved}</Text>
            </View>
          </View>

          {/* Chờ duyệt */}
          <View className="flex-row items-center space-x-2">
            <Ionicons name="time-outline" size={18} color="#FBBF24" />
            <View>
              <Text className="text-amber-500 font-semibold text-[14px]">
                Chờ duyệt
              </Text>
              <Text className="text-gray-700 text-[13px]">{pending}</Text>
            </View>
          </View>

          {/* Từ chối */}
          <View className="flex-row items-center space-x-2">
            <Ionicons name="close-circle" size={18} color="#EF4444" />
            <View>
              <Text className="text-rose-500 font-semibold text-[14px]">
                Từ chối
              </Text>
              <Text className="text-gray-700 text-[13px]">{rejected}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Danh sách báo cáo */}
      {rooms.map((room) => (
        <RoomReportCard key={room.id} room={room} />
      ))}
    </ScrollView>
  );
}
