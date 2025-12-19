import { useRoomReportData } from "@/constants/data/useRoomReportData";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import RoomReportCard from "./RoomReportCard";

export default function RoomReportList() {
  const { rooms, loading, handleApprove, handleReject } = useRoomReportData();
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-20">
        <Text className="text-gray-500">Đang tải báo cáo...</Text>
      </View>
    );
  }

  const filteredRooms =
    filter === "all" ? rooms : rooms.filter((r) => r.status === filter);

  return (
    <View className="flex-1">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mb-5"
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

      {filteredRooms.length > 0 ? (
        filteredRooms.map((room) => (
          <RoomReportCard
            key={room.id}
            room={room}
            onApprove={() => handleApprove(room.id)}
            onReject={() => handleReject(room.id)}
          />
        ))
      ) : (
        <View className="items-center justify-center mt-10">
          <Text className="text-gray-400">Không có báo cáo nào phù hợp</Text>
        </View>
      )}
    </View>
  );
}
