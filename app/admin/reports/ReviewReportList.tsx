import { useReviewReportData } from "@/constants/data/useReviewReportData";
import React from "react";
import { Text, View } from "react-native";
import ReviewReportCard from "./ReviewReportCard";

export default function ReviewReportList() {
  const { reviews, loading, handleApprove, handleReject } = useReviewReportData();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-20">
        <Text className="text-gray-500">Đang tải báo cáo đánh giá ...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {reviews.length > 0 ? (
        reviews
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
          <Text className="text-gray-400">Không có báo cáo nào</Text>
        </View>
      )}
    </View>
  );
}
