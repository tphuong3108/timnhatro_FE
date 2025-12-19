import { useAuth } from "@/contexts/AuthContext";
import { reviewApi } from "@/services/reviewApi";
import { roomApi } from "@/services/roomApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface RatingSectionProps {
  room: any;
  refreshRoomStatus?: () => Promise<void>;
  onDeleteReview?: (reviewId: string) => void;
  onUpdateReview?: (updatedReview: any) => void;
}

export default function RatingSection({ room, refreshRoomStatus, onDeleteReview, onUpdateReview }: RatingSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  
  // State cho edit modal
  const [editModal, setEditModal] = useState(false);
  const [editReviewId, setEditReviewId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [editLoading, setEditLoading] = useState(false);

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

      // Gọi callback để cập nhật realtime
      if (onDeleteReview) {
        onDeleteReview(reviewId);
      } else if (refreshRoomStatus) {
        await refreshRoomStatus();
      }

    } catch (error) {
      Alert.alert("Lỗi", "Không thể xóa đánh giá.");
    }
  };

  // ✏️✏️ SỬA REVIEW ✏️✏️
  const openEditModal = (review: any) => {
    setEditReviewId(review._id);
    setEditComment(review.comment || "");
    setEditRating(review.rating || 0);
    setEditModal(true);
  };

  const handleUpdateReview = async () => {
    if (!editComment.trim() || editRating === 0) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ nội dung và số sao.");
      return;
    }
    
    try {
      setEditLoading(true);
      await reviewApi.updateReview(editReviewId!, {
        comment: editComment,
        rating: editRating,
      });
      
      setEditModal(false);
      Alert.alert("Thành công", "Đánh giá đã được cập nhật.");
      
      // Chỉ truyền các field đã thay đổi, giữ nguyên userId object
      if (onUpdateReview) {
        onUpdateReview({ 
          _id: editReviewId, 
          comment: editComment, 
          rating: editRating 
        });
      } else if (refreshRoomStatus) {
        await refreshRoomStatus();
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật đánh giá.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(600)}
      className="px-5 py-5 bg-white mx-4 mt-3 mb-5 rounded-2xl p-4 shadow shadow-black/10"
    >
      {/* Header - Đánh giá & Xếp hạng style CH Play */}
      <View className="flex-row items-center mb-4">
        <Ionicons name="star" size={20} color="#3F72AF" />
        <Text className="text-lg font-semibold text-[#112D4E] ml-2">
          Đánh giá & Xếp hạng
        </Text>
      </View>

      {/* Layout CH Play: Số sao lớn bên trái + Biểu đồ bên phải */}
      <Animated.View entering={FadeInUp.delay(150).duration(500)} className="flex-row mb-4">
        {/* Bên trái: Số sao lớn */}
        <View className="items-center justify-center pr-4" style={{ width: 100 }}>
          <Text className="text-5xl font-bold text-[#112D4E]">
            {(room.avgRating || 0).toFixed(1)}
          </Text>
          <View className="flex-row mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={room.avgRating >= star ? "star" : room.avgRating >= star - 0.5 ? "star-half" : "star-outline"}
                size={14}
                color="#FFD700"
              />
            ))}
          </View>
          <Text className="text-gray-500 text-xs mt-1">
            {ratingStats.total} đánh giá
          </Text>
        </View>

        {/* Bên phải: Biểu đồ thanh */}
        <View className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const percent = ratingStats.percentages[star - 1];
            const count = ratingStats.counts[star - 1];
            return (
              <View key={star} className="flex-row items-center mb-1">
                <Text className="w-3 text-[11px] text-gray-600">{star}</Text>
                <Ionicons name="star" size={10} color="#FFD700" style={{ marginHorizontal: 2 }} />
                <View className="flex-1 h-[8px] bg-gray-200 rounded-full mx-1">
                  <View
                    style={{
                      width: `${percent}%`,
                      backgroundColor: "#3F72AF",
                      height: 8,
                      borderRadius: 4,
                    }}
                  />
                </View>
                <Text className="w-6 text-[11px] text-gray-500 text-right">{count}</Text>
              </View>
            );
          })}
        </View>
      </Animated.View>

      {/* Danh sách đánh giá */}
      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
        {displayedReviews.map((r: any, i: number) => {
          // Xử lý trường hợp userId là object hoặc string
          const isUserIdObject = typeof r.userId === 'object' && r.userId !== null;
          const userInfo = isUserIdObject ? r.userId : {};
          const reviewOwnerId = isUserIdObject ? r.userId._id : r.userId; // ID của người viết đánh giá
          
          const avatar =
            userInfo.avatar || "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
          const name =
            `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim() ||
            "Người dùng ẩn danh";

          const date = r.createdAt
            ? new Date(r.createdAt).toLocaleDateString("vi-VN")
            : "Không xác định";
          
          // Kiểm tra xem user hiện tại có phải chủ đánh giá không
          const isReviewOwner = String(user?._id) === String(reviewOwnerId);

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

                  {/* Báo cáo — chỉ người KHÁC mới báo cáo được */}
                  {!isReviewOwner && (
                    <TouchableOpacity
                      onPress={() => openReportModal(r._id)}
                      className="flex-row items-center mr-4"
                    >
                      <Ionicons name="flag-outline" size={15} color="#9ca3af" />
                      <Text className="text-gray-500 text-[12px] ml-1">Báo cáo</Text>
                    </TouchableOpacity>
                  )}

                  {/* Sửa — chỉ chủ đánh giá được sửa */}
                  {isReviewOwner && (
                    <TouchableOpacity
                      onPress={() => openEditModal(r)}
                      className="flex-row items-center mr-4"
                    >
                      <Ionicons name="create-outline" size={15} color="#3F72AF" />
                      <Text className="text-[#3F72AF] text-[12px] ml-1">Sửa</Text>
                    </TouchableOpacity>
                  )}

                  {/* Xóa — chỉ chủ đánh giá được xóa */}
                  {isReviewOwner && (
                    <TouchableOpacity
                      onPress={() => confirmDeleteReview(r._id)}
                      className="flex-row items-center"
                    >
                      <Ionicons name="trash-outline" size={15} color="#EF4444" />
                      <Text className="text-red-500 text-[12px] ml-1">Xóa</Text>
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

      {/* MODAL SỬA ĐÁNH GIÁ */}
      <Modal transparent visible={editModal} animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center p-6">
          <View className="bg-white w-full rounded-2xl p-5">
            <Text className="text-lg font-semibold text-[#112D4E] mb-3">
              Sửa đánh giá
            </Text>

            {/* Rating Stars */}
            <View className="flex-row mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setEditRating(star)}>
                  <Ionicons
                    name={editRating >= star ? "star" : "star-outline"}
                    size={28}
                    color={editRating >= star ? "#FFD700" : "#ccc"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Comment Input */}
            <TextInput
              value={editComment}
              onChangeText={setEditComment}
              placeholder="Nhập nội dung đánh giá..."
              multiline
              editable={!editLoading}
              className="border border-gray-300 p-3 rounded-lg min-h-[100px] text-gray-700"
            />

            <View className="flex-row justify-end mt-4">
              <TouchableOpacity 
                onPress={() => setEditModal(false)} 
                className="mr-4"
                disabled={editLoading}
              >
                <Text className="text-gray-500 font-medium">Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleUpdateReview} disabled={editLoading}>
                <Text className="text-[#3F72AF] font-semibold">
                  {editLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}
