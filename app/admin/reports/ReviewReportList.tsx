import { useReviewReportData } from "@/constants/data/useReviewReportData";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ReviewReportCard from "./ReviewReportCard";

export default function ReviewReportList() {
  const { reviews, loading, handleApprove, handleReject } = useReviewReportData();
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-20">
        <Text className="text-gray-500">Đang tải báo cáo review...</Text>
      </View>
    );
  }

  const filtered =
    filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  return (
    <View className="flex-1">
      {/* Bộ lọc */}
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
              className={`px-5 py-2 mr-2 rounded-full ${
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

      {/* Danh sách */}
      {filtered.length > 0 ? (
        filtered
          .filter((r) => !!r)
          .map((review) => (
            <ReviewReportCard
              key={review.id}
              review={review}
              roomSlug={review.roomSlug}
              onApprove={() => handleApprove(review.id)}
              onReject={() => handleReject(review.id)}
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
