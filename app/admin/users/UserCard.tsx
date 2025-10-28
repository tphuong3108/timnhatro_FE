import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface User {
  id: string;
  fullName: string;
  email: string;
  avatar: string;
  role: string;
  isActive: boolean;
}

interface Props {
  user: User;
  onToggleActive: () => void;
}

export default function UserCard({ user, onToggleActive }: Props) {
  const router = useRouter();

  const handleToggle = () => {
    Alert.alert(
      "Xác nhận",
      user.isActive ? "Khóa tài khoản người dùng này?" : "Mở khóa tài khoản người dùng này?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xác nhận", onPress: onToggleActive },
      ]
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/user/${user.id}`)} // 🔹 điều hướng đến chi tiết user
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-4"
    >
      <View className="flex-row items-center">
        {/* Avatar */}
        <Image
          source={{ uri: user.avatar || "https://i.pravatar.cc/150" }}
          className="w-[64px] h-[64px] rounded-full mr-4"
        />

        {/* Info */}
        <View className="flex-1">
          <Text className="text-[#112D4E] font-semibold text-[15px]" numberOfLines={1}>
            {user.fullName}
          </Text>
          <Text className="text-gray-500 text-[13px]" numberOfLines={1}>
            {user.email}
          </Text>

          <View className="flex-row items-center mt-1">
            <Ionicons
              name="person-circle-outline"
              size={14}
              color="#3F72AF"
            />
            <Text className="text-xs text-[#3F72AF] font-semibold ml-1 capitalize">
              {user.role}
            </Text>

            <Text className="mx-2 text-gray-400">•</Text>

            <Ionicons
              name={user.isActive ? "checkmark-circle" : "close-circle"}
              size={14}
              color={user.isActive ? "#10B981" : "#EF4444"}
            />
            <Text
              className={`ml-1 text-xs font-semibold ${
                user.isActive ? "text-green-600" : "text-red-500"
              }`}
            >
              {user.isActive ? "Hoạt động" : "Bị khóa"}
            </Text>
          </View>
        </View>

        {/* Nút khóa / mở */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation(); // 🔹 không kích hoạt điều hướng khi bấm nút
            handleToggle();
          }}
          activeOpacity={0.7}
          className={`px-3 py-2 rounded-full ${
            user.isActive ? "bg-red-50" : "bg-green-50"
          }`}
        >
          <Ionicons
            name={user.isActive ? "lock-closed-outline" : "lock-open-outline"}
            size={20}
            color={user.isActive ? "#EF4444" : "#10B981"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
