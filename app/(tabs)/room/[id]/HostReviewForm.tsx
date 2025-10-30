import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { reviewApi } from "@/services/reviewApi";
import { useRouter } from "expo-router";

type HostReviewFormProps = {
  room: { _id: string };
  onSubmit?: (review: { comment: string; rating: number }) => void;
};

export default function HostReviewForm({ room, onSubmit }: HostReviewFormProps) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!comment || rating === 0) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    try {
      const newReview = await reviewApi.createReview(room._id, { comment, rating });
      onSubmit?.(newReview);
      Alert.alert("Thành công", "Đánh giá của bạn đã được gửi!");
      setComment("");
      setRating(0);
    } catch (err: any) {
      Alert.alert("Lỗi", err.response?.data?.message || "Không thể gửi đánh giá.");
    }
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(600)}
      className="px-5 py-8 bg-[#F9F7F7] rounded-2xl p-4 mt-4 border border-gray-200"
    >
      <View className="flex-row items-center mb-2">
        <MaterialCommunityIcons name="pencil-outline" size={20} color="#2d69adff" />
        <Text className="text-xl font-semibold text-[#3F72AF] ml-2">
          Gửi cảm nhận về chủ trọ
        </Text>
      </View>

      {/* Rating */}
      <View className="flex-row mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={rating >= star ? "star" : "star-outline"}
              size={28}
              color={rating >= star ? "#FFD700" : "#ccc"}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Comment */}
      <TextInput
        placeholder="Chia sẻ trải nghiệm của bạn sau khi tới xem phòng..."
        multiline
        value={comment}
        onChangeText={setComment}
        editable={!loading}
        className="border border-gray-300 rounded-xl p-3 text-gray-700 min-h-[90px]"
      />

      {/* Submit */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className={`mt-3 py-3 rounded-xl items-center ${
          loading ? "bg-gray-400" : "bg-[#3F72AF]"
        }`}
      >
        <Text className="text-white font-semibold text-base">
          {loading ? "Đang gửi..." : "Gửi đánh giá"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
