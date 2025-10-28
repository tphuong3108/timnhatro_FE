// MyPosts.tsx
import PostCard from "@/components/ui/PostCard";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, View } from "react-native";

export default function MyPosts({ rooms = [] }: { rooms: any[] }) {
  if (!rooms.length)
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
              title: item.name,
              address: item.address,
              images: item.images,
              content: item.description,
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
