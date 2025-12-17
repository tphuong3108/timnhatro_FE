import { useFilter } from "@/components/filters/FilterContext";
import PostCard from "@/components/ui/PostCard";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

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

  // Chia thành các hàng 2 cột
  const rows = [];
  for (let i = 0; i < filteredRooms.length; i += 2) {
    rows.push(filteredRooms.slice(i, i + 2));
  }

  return (
    <View className="mt-2">
      <View className="flex-row items-center mb-6">
        <Ionicons name="home-outline" size={20} color="#3F72AF" />
        <Text className="ml-2 text-lg font-semibold text-[#112D4E]">
          Kết quả tìm kiếm ({filteredRooms.length})
        </Text>
      </View>
      
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          className="flex-row justify-between mb-2"
        >
          {row.map((item) => (
            <PostCard key={item._id} item={item} showActions={false} />
          ))}
          {row.length === 1 && <View style={{ width: '48%' }} />}
        </View>
      ))}
    </View>
  );
}

