import { useRoomReportData } from "@/constants/data/useRoomReportData";
import React from "react";
import { Text, View } from "react-native";
import RoomReportCard from "./RoomReportCard";

export default function RoomReportList() {
  const { rooms, loading, handleApprove, handleReject } = useRoomReportData();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-20">
        <Text className="text-gray-500">Đang tải báo cáo phòng...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <RoomReportCard
            key={room.id}
            room={room}
            onApprove={() => handleApprove(room.id)}
            onReject={() => handleReject(room.id)}
          />
        ))
      ) : (
        <View className="items-center justify-center mt-10">
          <Text className="text-gray-400">Không có báo cáo nào</Text>
        </View>
      )}
    </View>
  );
}
