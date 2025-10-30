import React from "react";
import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PostCard from "@/components/ui/PostCard";

interface MyPostsProps {
  rooms?: any[];
}

export default function MyPosts({ rooms = [] }: MyPostsProps) {
  if (rooms.length === 0)
    return (
      <View className="py-10 items-center">
        <Ionicons name="document-text-outline" size={60} color="#3F72AF" />
        <Text className="text-gray-500 mt-3">Bạn chưa đăng bài nào</Text>
      </View>
    );

  return (
    <View className="px-4 mt-2">
      <FlatList
        data={rooms}
        numColumns={2}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <PostCard
            item={{
              _id: item._id,
              id: item.id,
              slug: item.slug || item.id || item._id,
              name: item.name,
              address: item.address,
              images: item.images,
            }}
          />
        )}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
}
