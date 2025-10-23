import React from "react";
import { View, Text, FlatList } from "react-native";
import PostCard from "@/components/ui/PostCard"; // component bạn đã có
import rooms from "@/constants/data/rooms";

export default function TopRatedRooms() {
  // Lấy các phòng có rating cao nhất
  const topRooms = rooms
    .filter((room) => room.avgRating >= 4.5)
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 6); // chỉ lấy top 6 phòng

  if (topRooms.length === 0)
    return (
      <Text className="text-gray-500 text-sm italic">
        Hiện chưa có phòng nổi bật nào.
      </Text>
    );

  return (
    <View>
      <FlatList
        data={topRooms}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostCard item={item} />}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  );
}
