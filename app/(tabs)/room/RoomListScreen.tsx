import React from "react";
import { ScrollView, View, TouchableOpacity, Text, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import RoomCard, { Room } from "@/app/(tabs)/home/RoomCard";
import rooms from "@/constants/data/rooms";

const { width } = Dimensions.get("window");

export default function RoomListScreen() {
  const router = useRouter();

  const handlePress = (roomId: string) => {
    router.push(`/room/${roomId}` as any);
  };

  return (
    <ScrollView
      className="flex-1 bg-[#f9fafb]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View className="px-4 pt-5 pb-2 border-b border-gray-200 bg-white shadow-sm">
        <Text
          className="text-[#3F72AF] font-bold"
          style={{ fontSize: width > 400 ? 20 : 17 }}
        >
          Danh sách phòng trọ
        </Text>
      </View>

      {/* Danh sách */}
      <View className="flex-row flex-wrap justify-between px-4 mt-4">
        {rooms.map((room: Room) => (
          <TouchableOpacity
            key={room.id}
            activeOpacity={0.9}
            onPress={() => handlePress(room.id)}
            className="w-[48%] mb-5"
          >
            <RoomCard room={room} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
