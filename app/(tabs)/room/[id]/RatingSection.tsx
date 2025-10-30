import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { roomApi } from "@/services/roomApi"; // 🔹 Dùng chung apiClient hoặc tạo reviewApi riêng

interface RatingSectionProps {
  room: any;
}

export default function RatingSection({ room }: RatingSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  const ratingStats = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    const reviews = room.reviews || [];
    reviews.forEach((r: any) => {
      const idx = Math.max(0, Math.min(4, Math.round(r.rating) - 1));
      counts[idx] += 1;
    });
    const total = reviews.length;
    const percentages = counts.map((c) => (total > 0 ? (c / total) * 100 : 0));
    return { counts, percentages, total };
  }, [room.reviews]);

  if (!room.reviews || room.reviews.length === 0) return null;

  const displayedReviews = showAll ? room.reviews : room.reviews.slice(0, 3);

  // 🧩 Gửi báo cáo review
  const handleReportReview = (reviewId: string) => {
    Alert.prompt(
      "Báo cáo đánh giá",
      "Nhập lý do bạn muốn báo cáo đánh giá này:",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Gửi",
          onPress: async (reason) => {
            if (!reason || reason.trim().length === 0) return;
            try {
              await roomApi.reportReview(reviewId, reason);
              Alert.alert(" Thành công", "Báo cáo đã được gửi.");
            } catch (error: any) {
              console.error(" Lỗi gửi báo cáo:", error);
              Alert.alert("Lỗi", "Không thể gửi báo cáo. Vui lòng thử lại.");
            }
          },
        },
      ],
      "plain-text"
    );
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(600)}
      className="px-5 py-5 bg-white mx-4 mt-3 mb-5 rounded-2xl p-4 shadow shadow-black/10"
    >
      {/* Tổng lượt đánh giá */}
      <View className="flex-row items-center mb-3">
        <Ionicons name="chatbubbles-outline" size={20} color="#3F72AF" />
        <Text className="text-lg font-semibold text-[#112D4E] ml-2">
          {room.totalRatings || ratingStats.total} lượt đánh giá
        </Text>
      </View>

      {/* Xếp hạng tổng thể */}
      <Animated.View
        entering={FadeInUp.delay(150).duration(500)}
        className="mb-4"
      >
        <View className="flex-row items-center mb-2">
          <Ionicons name="stats-chart-outline" size={20} color="#3F72AF" />
          <Text className="text-base font-medium text-[#112D4E] ml-2">
            Xếp hạng tổng thể
          </Text>
        </View>

        {[5, 4, 3, 2, 1].map((star, i) => {
          const percent = ratingStats.percentages[star - 1];
          return (
            <View key={i} className="flex-row items-center mb-1">
              <Text className="w-4 text-[12px] text-gray-700">{star}</Text>
              <View className="flex-1 h-[6px] bg-gray-200 rounded-full mx-1">
                <View
                  style={{
                    width: `${percent}%`,
                    backgroundColor: "#3F72AF",
                    height: 6,
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>
          );
        })}
      </Animated.View>

      {/* Danh sách đánh giá */}
      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
        {displayedReviews.map((r: any, i: number) => {
          const user = r.userId || {};
          const avatar =
            user.avatar ||
            "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
          const name =
            user.name ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            "Người dùng ẩn danh";
          const date = r.createdAt
            ? new Date(r.createdAt).toLocaleDateString("vi-VN")
            : "Không xác định";

          return (
            <Animated.View
              key={i}
              entering={FadeInUp.delay(300 + i * 150).duration(400)}
              className="flex-row mb-4 border-b border-gray-100 pb-3"
            >
              {/* Avatar */}
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/user/[id]",
                    params: { id: user._id || "unknown" },
                  })
                }
              >
                <Image
                  source={{ uri: avatar }}
                  className="w-10 h-10 rounded-full mr-3"
                />
              </TouchableOpacity>

              {/* Nội dung review */}
              <View className="flex-1">
                <Text className="font-semibold text-[#112D4E] text-[15px]">
                  {name}
                </Text>
                <Text className="text-gray-500 text-[12px] mb-1">{date}</Text>

                {/* Rating sao */}
                <View className="flex-row items-center mb-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Ionicons
                      key={idx}
                      name={idx < r.rating ? "star" : "star-outline"}
                      size={14}
                      color="#FFD700"
                    />
                  ))}
                </View>

                {/* Comment */}
                <Text className="text-gray-700 text-[13px] mb-2">
                  {r.comment || "Không có nội dung đánh giá."}
                </Text>

                {/* 🔹 Nút báo cáo */}
                <TouchableOpacity
                  onPress={() => handleReportReview(r._id)}
                  className="flex-row items-center"
                >
                  <Ionicons
                    name="flag-outline"
                    size={15}
                    color="#EF4444"
                    style={{ marginRight: 4 }}
                  />
                  <Text className="text-red-500 text-[12px]">
                    Báo cáo đánh giá
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>

      {/* Nút xem thêm */}
      {room.reviews.length > 3 && (
        <TouchableOpacity
          onPress={() => setShowAll(!showAll)}
          className="mt-1 items-center"
        >
          <Text className="text-[#3F72AF] text-sm font-medium">
            {showAll ? "Ẩn bớt đánh giá" : "Xem thêm đánh giá →"}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}
