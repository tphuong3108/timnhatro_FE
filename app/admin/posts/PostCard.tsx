import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PostRoom } from "@/constants/data/PostRoom";

interface Props {
  post: PostRoom;
  onApprove: () => void;
  onReject: () => void;
}

export default function PostCard({ post, onApprove, onReject }: Props) {
  return (
    <View className="bg-white rounded-3xl shadow-sm mb-5 p-4 border border-gray-100">
      {/* Header */}
      <View className="flex-row">
        <Image
          source={{ uri: post.image }}
          className="w-[110px] h-[110px] rounded-2xl"
        />

        <View className="flex-1 ml-3 justify-between">
          <View>
            <Text className="text-[16px] font-semibold text-[#112D4E]" numberOfLines={1}>
              {post.name}
            </Text>
            <Text className="text-gray-500 text-[13px]" numberOfLines={1}>
              {post.address}
            </Text>
            <Text className="text-gray-400 text-[12px] mt-1">
              Ngày đăng: {post.createdAt}
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-gray-100">
        {/* Host info */}
        <View className="flex-row items-center">
          <Image
            source={{ uri: post.host.avatar }}
            className="w-[28px] h-[28px] rounded-full mr-2"
          />
          <Text className="text-gray-700 text-[13px] font-medium" numberOfLines={1}>
            {post.host.name}
          </Text>
        </View>

        {/* Status / Actions */}
        {post.status === "pending" ? (
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={onReject}
              className="flex-row items-center bg-red-50 px-3 py-1.5 rounded-xl"
            >
              <Ionicons name="close-circle-outline" size={14} color="#EF4444" />
              <Text className="text-red-600 ml-1 text-[13px] font-medium">Từ chối</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onApprove}
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
                post.status === "approved"
                  ? "checkmark-circle"
                  : "close-circle"
              }
              size={16}
              color={post.status === "approved" ? "#10B981" : "#EF4444"}
            />
            <Text
              className={`ml-1 text-[13px] font-semibold ${
                post.status === "approved" ? "text-green-600" : "text-red-500"
              }`}
            >
              {post.status === "approved" ? "Đã duyệt" : "Đã từ chối"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
