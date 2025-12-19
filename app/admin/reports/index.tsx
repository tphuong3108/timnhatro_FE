import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import RoomReportList from "./RoomReportList";
import ReviewReportList from "./ReviewReportList";

export default function AdminRoomReports() {
  const [reportType, setReportType] = useState<"room" | "review">("room");

  return (
    <View className="flex-1 bg-[#F9FAFB] px-5 pt-6">
      {/* Header */}
      <View className="mb-5">
        <Text className="text-4xl font-bold text-[#112D4E]">Quản lý Báo cáo</Text>
        <Text className="text-gray-500 mt-1 text-[13px]">
          Duyệt, xử lý các báo cáo phòng & đánh giá
        </Text>
      </View>

      {/* Tab chọn loại báo cáo */}
      <View className="flex-row mb-5 ">
        {[
          { key: "room", label: "Báo cáo Phòng" },
          { key: "review", label: "Báo cáo Đánh giá" },
        ].map((tab) => {
          const isActive = reportType === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setReportType(tab.key as any)}
              className={`flex-1 py-2.5 mx-1 rounded-full ${
                isActive ? "bg-[#3F72AF]" : "bg-gray-200"
              }`}
            >
              <Text
                className={`text-center text-[16px] font-semibold ${
                  isActive ? "text-white" : "text-[#112D4E]"
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 5 }}
      >
        {reportType === "room" ? <RoomReportList /> : <ReviewReportList />}
      </ScrollView>
    </View>
  );
}
