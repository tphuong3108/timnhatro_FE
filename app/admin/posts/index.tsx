import React from "react";
import { Text, View } from "react-native";
import PostList from "./PostList";

export default function AdminPosts() {
  return (
    <View className="flex-1 bg-[#F9FAFB] px-4 pt-4">
      {/* Header */}
      <View className="mb-4">
        <Text className="text-4xl font-bold text-[#112D4E]">Quản lý bài đăng</Text>
        <Text className="text-gray-500 text-sm">Duyệt và quản lý phòng đăng</Text>
      </View>
      
      <PostList />
    </View>
  );
}
