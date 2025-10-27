import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { User } from "@/constants/data/User";

interface Props {
  user: User;
  onToggleActive: () => void;
}

export default function UserCard({ user, onToggleActive }: Props) {
  return (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-gray-100 shadow-sm">
      <View className="flex-row items-center">
        <Image
          source={{ uri: user.avatar }}
          className="w-[55px] h-[55px] rounded-full mr-3"
        />

        <View className="flex-1">
          <Text className="font-semibold text-[#112D4E] text-[15px]">
            {user.name}
          </Text>
          <Text className="text-gray-500 text-[13px]">{user.email}</Text>

          <View className="flex-row items-center mt-1 space-x-1">
            <Ionicons name="log-in-outline" size={13} color="#6B7280" />
            <Text className="text-gray-500 text-[12px]">
              {user.loginCount} lần đăng nhập
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text
            className={`text-[12px] font-semibold mb-1 ${
              user.role === "admin"
                ? "text-indigo-600"
                : user.role === "host"
                ? "text-green-600"
                : "text-gray-600"
            }`}
          >
            {user.role.toUpperCase()}
          </Text>

          <TouchableOpacity
            onPress={onToggleActive}
            className={`px-3 py-1 rounded-full ${
              user.isActive ? "bg-red-100" : "bg-green-100"
            }`}
          >
            <Text
              className={`text-[12px] font-semibold ${
                user.isActive ? "text-red-600" : "text-green-600"
              }`}
            >
              {user.isActive ? "Khóa" : "Mở khóa"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
