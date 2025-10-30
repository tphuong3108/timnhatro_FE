import React from "react";
import { View } from "react-native";
import PostList from "./PostList";

export default function AdminPosts() {
  return (
    <View className="flex-1 bg-[#F9FAFB] p-4">
      <PostList />
    </View>
  );
}
