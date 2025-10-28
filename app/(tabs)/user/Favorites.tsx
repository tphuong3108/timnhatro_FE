// Favorites.tsx
import React from "react";
import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PostCard from "@/components/ui/PostCard";

interface FavoritesProps {
  favorites?: any[];
}

export default function Favorites({ favorites = [] }: FavoritesProps) {
  if (favorites.length === 0)
    return (
      <View className="py-10 items-center">
        <Ionicons name="heart-outline" size={60} color="#3F72AF" />
        <Text className="text-gray-500 mt-3">Bạn chưa lưu phòng nào</Text>
      </View>
    );

  return (
    <View className="px-4 mt-2">
      <FlatList
        data={favorites}
        numColumns={2}
        keyExtractor={(item) => item._id || item.id}
        renderItem={({ item }) => (
          <PostCard
            item={{
              _id: item._id,
              title: item.name,
              address: item.address,
              images: item.images,
            }}
            isFavorite
          />
        )}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
}
