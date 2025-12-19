import { useReviewReportData } from "@/constants/data/useReviewReportData";
import { adminApi } from "@/services/adminApi";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ReviewReportCard from "./ReviewReportCard";

export default function ReviewReportList() {
  const { reviews, loading, removeReview } = useReviewReportData();
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all");

  const handleProcessReport = async (reviewId: string, decision: "approve" | "confirm") => {
    try {
      await adminApi.processReviewReport(reviewId, decision);
      removeReview(reviewId);
      Alert.alert("Thành công", `Đã ${decision === "approve" ? "duyệt" : "từ chối"} báo cáo review.`);
    } catch (error) {
      console.error("Error processing review report:", error);
      Alert.alert("Lỗi", "Không thể xử lý báo cáo review. Vui lòng thử lại sau.");
    }
  };

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
              onApprove={() => handleProcessReport(review.id, "approve")}
              onReject={() => handleProcessReport(review.id, "confirm")}
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
