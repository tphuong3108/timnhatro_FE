import React from "react";
import { View, Text, FlatList } from "react-native";
import { useFilter } from "./FilterContext";
import PostCard from "@/components/ui/PostCard";
import { Ionicons } from "@expo/vector-icons";

export default function RoomList() {
  const { filteredRooms } = useFilter();

  if (!filteredRooms.length) {
    return (
      <View className="items-center justify-center py-10">
        <Text className="text-gray-500 text-[14px]">
          Không tìm thấy phòng phù hợp.
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-2">
        <View className="flex-row items-center mb-6">
          <Ionicons name="home-outline" size={20} color="#3F72AF" />
          <Text className="ml-2 text-lg font-semibold text-[#112D4E]">
              Kết quả tìm kiếm ({filteredRooms.length})
          </Text>
        </View>
      <FlatList
        data={filteredRooms}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostCard item={item} />}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        scrollEnabled={false}
      />
    </View>
  );
}
