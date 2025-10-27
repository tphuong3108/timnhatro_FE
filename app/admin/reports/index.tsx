import React from "react";
import { View } from "react-native";
import RoomReportList from "./RoomReportList";

export default function AdminRoomReports() {
  return (
    <View className="flex-1 bg-[#F9FAFB] p-4">
      <RoomReportList />
    </View>
  );
}
