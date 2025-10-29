import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PostCardProps {
  post: {
    id: string;
    name: string;
    address: string;
    image?: string;
    createdAt: string;
    host?: { name: string; avatar?: string };
    status?: string;
  };
  onApprove?: () => void;
  onDelete?: () => void;
}

export default function PostCard({ post, onApprove, onDelete }: PostCardProps) {
  return (
    <View className="bg-white rounded-2xl shadow-md mb-4 overflow-hidden">
      {/* Ảnh phòng */}
      <Image
        source={{
          uri:
            post.image ||
            "https://via.placeholder.com/300x200.png?text=No+Image",
        }}
        className="w-full h-[160px]"
      />

      {/* Thông tin chi tiết */}
      <View className="p-4">
        <Text
          className="text-[15px] font-semibold text-[#112D4E]"
          numberOfLines={1}
        >
          {post.name}
        </Text>
        <Text className="text-gray-500 text-[13px]" numberOfLines={1}>
          {post.address}
        </Text>

        {/* Thông tin chủ phòng */}
        <View className="flex-row items-center mt-2">
          <Image
            source={{
              uri:
                post.host?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            className="w-7 h-7 rounded-full mr-2"
          />
          <Text className="text-[13px] text-gray-600">
            {post.host?.name || "Chủ phòng"}
          </Text>
        </View>

        {/* Trạng thái */}
        <View className="flex-row items-center mt-2">
          <Ionicons name="time-outline" size={14} color="#3F72AF" />
          <Text className="text-[12px] text-gray-400 ml-1">
            Ngày đăng: {post.createdAt}
          </Text>
        </View>

        {/* Hành động */}
        <View className="flex-row justify-between mt-4">
          {/* Nút duyệt */}
          {post.status !== "approved" ? (
            <TouchableOpacity
              onPress={onApprove}
              className="bg-[#3F72AF] px-3 py-1 rounded-lg"
            >
              <Text className="text-white text-[13px] font-medium">
                Duyệt
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
              <Text className="text-[13px] text-green-600 ml-1">Đã duyệt</Text>
            </View>
          )}

          {/* Icon xóa mềm */}
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
