import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface ReviewReport {
  id: string;
  roomId: string; // 🔹 thêm roomId để điều hướng
  reviewText: string;
  reportedBy: string;
  reviewer: string;
  rating: number;
  status: "approved" | "pending" | "rejected";
}

interface Props {
  review: ReviewReport;
  onApprove?: () => void;
  onReject?: () => void;
}

export default function ReviewReportCard({ review, onApprove, onReject }: Props) {
  const router = useRouter();

  const handleApprove = () => {
    Alert.alert("Xác nhận", "Duyệt báo cáo review này?", [
      { text: "Hủy", style: "cancel" },
      { text: "Duyệt", onPress: onApprove || (() => {}) },
    ]);
  };

  const handleReject = () => {
    Alert.alert("Xác nhận", "Từ chối báo cáo review này?", [
      { text: "Hủy", style: "cancel" },
      { text: "Từ chối", onPress: onReject || (() => {}) },
    ]);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/room/${review.roomId}`)} // 🔹 điều hướng đến chi tiết phòng
      className="bg-white rounded-3xl shadow-sm mb-5 p-4 border border-gray-100"
    >
      {/* Header */}
      <View>
        <Text className="text-[16px] font-semibold text-[#112D4E]" numberOfLines={2}>
          Người đánh giá: {review.reviewer}
        </Text>
        <Text className="text-gray-500 text-[13px] mt-1">
          Báo cáo bởi: {review.reportedBy}
        </Text>
        <Text className="text-gray-700 text-[13px] leading-5 mt-2">
          “{review.reviewText}”
        </Text>
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-gray-100">
        {/* Rating */}
        <Text className="text-[#3F72AF] font-semibold text-sm">★ {review.rating.toFixed(1)}</Text>

        {/* Status / Actions */}
        {review.status === "pending" ? (
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation(); // 🔹 chặn click card khi bấm nút
                handleReject();
              }}
              className="flex-row items-center bg-red-50 px-3 py-1.5 rounded-xl"
            >
              <Ionicons name="close-circle-outline" size={14} color="#EF4444" />
              <Text className="text-red-600 ml-1 text-[13px] font-medium">Từ chối</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleApprove();
              }}
              className="flex-row items-center bg-green-50 px-3 py-1.5 rounded-xl"
            >
              <Ionicons name="checkmark-circle-outline" size={14} color="#10B981" />
              <Text className="text-green-700 ml-1 text-[13px] font-medium">Duyệt</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center">
            <Ionicons
              name={
                review.status === "approved"
                  ? "checkmark-circle"
                  : "close-circle"
              }
              size={16}
              color={review.status === "approved" ? "#10B981" : "#EF4444"}
            />
            <Text
              className={`ml-1 text-[13px] font-semibold ${
                review.status === "approved" ? "text-green-600" : "text-red-500"
              }`}
            >
              {review.status === "approved" ? "Đã duyệt" : "Đã từ chối"}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
