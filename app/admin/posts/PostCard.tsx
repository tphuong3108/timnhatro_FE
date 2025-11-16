import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface PostCardProps {
  room: any;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
}

export default function PostCard({ room, onApprove, onReject, onDelete }: PostCardProps) {
  const router = useRouter();

  const handleDelete = () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa phòng này?", [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: onDelete },
    ]);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/room/${room.slug || room._id}`)} 
      className="bg-white rounded-3xl shadow-sm mb-4 p-4 border border-gray-100"
    >
      {/* Header */}
      <View className="flex-row items-center">
        <Image
          source={{ uri: room.images?.[0] }}
          className="w-[100px] h-[100px] rounded-2xl"
        />
        <View className="flex-1 ml-3">
          <Text
            className="text-[16px] font-semibold text-[#112D4E]"
            numberOfLines={1}
          >
            {room.name}
          </Text>
          <Text className="text-gray-500 text-[13px]" numberOfLines={1}>
            {room.address}
          </Text>
          <Text className="text-[#3F72AF] font-semibold text-[14px] mt-1">
            {room.price?.toLocaleString("vi-VN")}đ / tháng
          </Text>
          <Text
            className={`mt-1 text-[13px] font-semibold ${
              room.status === "approved"
                ? "text-green-600"
                : room.status === "pending"
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {room.status === "approved"
              ? "Đã duyệt"
              : room.status === "pending"
              ? "Chờ duyệt"
              : "Từ chối"}
          </Text>
        </View>
      </View>

      {/* Footer Actions */}
      <View className="flex-row justify-end items-center mt-4 pt-3 border-t border-gray-100 space-x-2">
        {room.status === "pending" ? (
          <>
            <TouchableOpacity
              onPress={onReject}
              className="flex-row items-center bg-red-50 px-3 py-1.5 rounded-xl"
            >
              <Ionicons name="close-circle-outline" size={14} color="#EF4444" />
              <Text className="text-red-600 ml-1 text-[13px] font-medium">
                Từ chối
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onApprove}
              className="flex-row items-center bg-green-50 px-3 py-1.5 rounded-xl"
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={14}
                color="#10B981"
              />
              <Text className="text-green-700 ml-1 text-[13px] font-medium">
                Duyệt
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={handleDelete}
            className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-xl"
          >
            <Ionicons name="trash-outline" size={14} color="#6B7280" />
            <Text className="text-gray-700 ml-1 text-[13px] font-medium">
              Xóa
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}
