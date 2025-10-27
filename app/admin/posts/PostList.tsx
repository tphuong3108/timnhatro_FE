import React from "react";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import PostCard from "./PostCard";
import { usePostsData } from "@/constants/data/PostsData";

export default function PostList() {
  const { posts, loading, approvePost, rejectPost } = usePostsData();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-20">
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text className="text-gray-500 mt-3">Đang tải bài đăng...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text className="text-[18px] font-semibold text-[#112D4E] mb-4">
        Bài đăng chờ duyệt ({posts.filter((p) => p.status === "pending").length})
      </Text>

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onApprove={() => approvePost(post.id)}
          onReject={() => rejectPost(post.id)}
        />
      ))}
    </ScrollView>
  );
}
