import React from "react";
import { View, Text } from "react-native";
import UserList from "./UserList";

export default function AdminUsers() {
  return (
    <View className="flex-1 bg-[#F9FAFB] px-5 pt-6">
      <View className="mb-5">
        <Text className="text-3xl font-bold text-[#112D4E]">Quản lý Người dùng</Text>
        <Text className="text-gray-500 mt-1 text-[13px]">
          Xem, lọc và quản lý tài khoản người dùng
        </Text>
      </View>
      <UserList />
    </View>
  );
}
