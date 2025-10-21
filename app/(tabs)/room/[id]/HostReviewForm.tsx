import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HostReviewForm({ onSubmit }: any) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn số sao đánh giá.");
      return;
    }
    if (!comment.trim()) {
      Alert.alert("Thiếu nội dung", "Vui lòng nhập cảm nhận của bạn.");
      return;
    }
    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
    Alert.alert("Thành công", "Cảm ơn bạn đã chia sẻ đánh giá!");
  };

  return (
    <Animated.View
      entering={FadeInUp.duration(600)}
      className="px-5 py-8 bg-[#F9F7F7] rounded-2xl p-4 mt-4 border border-gray-200"
    >
    <View className="flex-row items-center mb-2">
      <MaterialCommunityIcons name="pencil-outline" size={20} color="#2d69adff" />
      <Text className="text-lg font-semibold text-[#112D4E] ml-2">
        Gửi cảm nhận về chủ trọ
      </Text>
    </View>

      {/* --- rating stars --- */}
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

      {/* --- comment input --- */}
      <TextInput
        placeholder="Chia sẻ trải nghiệm của bạn sau khi tới xem phòng..."
        multiline
        value={comment}
        onChangeText={setComment}
        className="border border-gray-300 rounded-xl p-3 text-gray-700 min-h-[90px]"
      />

      {/* --- submit --- */}
      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-[#3F72AF] mt-3 py-3 rounded-xl items-center"
      >
        <Text className="text-white font-semibold text-base">
          Gửi đánh giá
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
