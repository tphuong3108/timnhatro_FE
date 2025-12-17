import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { roomApi } from "@/services/roomApi";
import { useAuth } from "@/constants/auth/AuthContext";

interface RatingSectionProps {
  room: any;
  refreshRoomStatus?: () => Promise<void>;
}

export default function RatingSection({ room, refreshRoomStatus }: RatingSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useAuth();

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

  // ⭐⭐⭐ BÁO CÁO REVIEW ⭐⭐⭐
  const openReportModal = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setReportReason("");
    setReportModal(true);
  };

  const sendReport = async () => {
    if (!reportReason.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập lý do báo cáo.");
      return;
    }

    try {
      await roomApi.reportReview(selectedReviewId!, reportReason);
      setReportModal(false);
      Alert.alert("Thành công", "Báo cáo của bạn đã được gửi.");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể gửi báo cáo.");
    }
  };

  // ❌❌ XÓA REVIEW ❌❌
  const confirmDeleteReview = (reviewId: string) => {
    Alert.alert(
      "Xóa đánh giá?",
      "Bạn chắc chắn muốn xóa đánh giá này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => handleDeleteReview(reviewId)
        }
      ]
    );
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await roomApi.deleteReview(reviewId);
      Alert.alert("Đã xóa", "Đánh giá đã được xóa.");

      if (refreshRoomStatus) await refreshRoomStatus();
      else router.reload();

    } catch (error) {
      Alert.alert("Lỗi", "Không thể xóa đánh giá.");
    }
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
          {ratingStats.total} lượt đánh giá
        </Text>
      </View>

      {/* Biểu đồ đánh giá */}
      <Animated.View entering={FadeInUp.delay(150).duration(500)} className="mb-4">
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
          const userInfo = r.userId || {};
          const avatar =
            userInfo.avatar || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
          const name =
            `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim() ||
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
              <Image source={{ uri: avatar }} className="w-10 h-10 rounded-full mr-3" />

              {/* Nội dung */}
              <View className="flex-1">
                <Text className="font-semibold text-[#112D4E] text-[15px]">{name}</Text>
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

                {/* —— Nút hành động —— */}
                <View className="flex-row mt-1">

                  {/* Báo cáo */}
                  <TouchableOpacity
                    onPress={() => openReportModal(r._id)}
                    className="flex-row items-center mr-5"
                  >
                    <Ionicons name="flag-outline" size={15} color="#EF4444" />
                    <Text className="text-red-500 text-[12px] ml-1">Báo cáo</Text>
                  </TouchableOpacity>

                  {/* Xóa — chỉ chủ review được xóa */}
                  {user?._id === userInfo._id && (
                    <TouchableOpacity
                      onPress={() => confirmDeleteReview(r._id)}
                      className="flex-row items-center"
                    >
                      <Ionicons name="trash-outline" size={15} color="#3F72AF" />
                      <Text className="text-[#3F72AF] text-[12px] ml-1">Xóa</Text>
                    </TouchableOpacity>
                  )}

                </View>
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

      {/* MODAL BÁO CÁO REVIEW */}
      <Modal transparent visible={reportModal} animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center p-6">
          <View className="bg-white w-full rounded-2xl p-5">
            <Text className="text-lg font-semibold text-[#112D4E] mb-3">
              Báo cáo đánh giá
            </Text>

            <TextInput
              value={reportReason}
              onChangeText={setReportReason}
              placeholder="Nhập lý do..."
              multiline
              className="border border-gray-300 p-3 rounded-lg min-h-[100px] text-gray-700"
            />

            <View className="flex-row justify-end mt-4">
              <TouchableOpacity onPress={() => setReportModal(false)} className="mr-4">
                <Text className="text-gray-500 font-medium">Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={sendReport}>
                <Text className="text-red-500 font-semibold">Gửi báo cáo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}
