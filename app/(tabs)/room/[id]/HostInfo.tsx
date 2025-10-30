import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HostInfo({ room, contactHost }: any) {
  const router = useRouter();

  if (!room.host) return null;

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        stars.push(<Ionicons key={i} name="star" size={18} color="#FFD700" />);
      else if (rating >= i - 0.5)
        stars.push(
          <Ionicons key={i} name="star-half" size={18} color="#FFD700" />
        );
      else
        stars.push(
          <Ionicons key={i} name="star-outline" size={18} color="#FFD700" />
        );
    }
    return stars;
  };

  const handleChatNow = () => {
    const chatId = room.host._id;
    router.push(`/messages/${chatId}`);
  };

  return (
    <View className="px-5 py-5 border-t border-gray-200">
      <Text className="text-lg font-semibold text-[#112D4E] mb-3">Chủ trọ</Text>

      {/* Thông tin chủ trọ */}
      <View className="flex-row items-center mb-3">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/user/[id]",
              params: { id: room.host._id },
            })
          }
        >
          <Image
            source={{ uri: room.host.avatar }}
            className="w-16 h-16 rounded-full mr-3 border border-gray-200"
          />
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="text-base font-semibold text-[#112D4E]">
            {room.host.fullName}
          </Text>
          {room.host.bio && (
            <Text className="text-gray-600 text-[13px] mt-1">
              {room.host.bio}
            </Text>
          )}
          <View className="flex-row items-center mt-1">
            {renderStars(room.avgRating)}
            <Text className="ml-2 text-gray-700 text-[13px]">
              {room.avgRating.toFixed(2)} ({room.totalRatings} đánh giá)
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center mt-2">
        {room.host.email && (
          <TouchableOpacity
            onPress={() => contactHost("email")}
            className="flex-row bg-[#3F72AF] px-4 py-2 rounded-full items-center"
            style={{ marginRight: 8 }}
          >
            <MaterialIcons name="email" size={18} color="#fff" />
            <Text className="text-white ml-2 font-medium text-[13px]">
              Gửi Email
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => contactHost("call")}
          className="flex-row bg-[#3F72AF] px-4 py-2 rounded-full items-center"
          style={{ marginRight: 8 }}
        >
          <Feather name="phone-call" size={18} color="#fff" />
          <Text className="text-white ml-2 font-medium text-[13px]">Gọi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleChatNow}
          className="flex-row bg-[#3F72AF] px-4 py-2 rounded-full items-center"
        >
          <Ionicons name="chatbubbles-outline" size={18} color="#fff" />
          <Text className="text-white ml-2 font-medium text-[13px]">
            Chat ngay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
