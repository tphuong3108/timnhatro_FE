import React from "react";
import { ScrollView, View, TouchableOpacity, Text, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import RoomCard, { Room } from "@/app/(tabs)/home/RoomCard";
import rooms from "@/constants/data/rooms";

const { width } = Dimensions.get("window");

export default function RoomList() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View className="px-4 pt-4 pb-2 border-b border-gray-100">
        <Text
          className="text-[#3F72AF] font-bold"
          style={{ fontSize: width > 400 ? 20 : 17 }}
        >
          Danh sách phòng trọ
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-between px-4 mt-3">
        {rooms.map((room: Room) => (
          <TouchableOpacity
            key={room.id}
            activeOpacity={0.8}
            onPress={() => router.push(`/room/${room.id}` as any)} // ép kiểu
            className="w-[48%] mb-4"
          >
            <RoomCard room={room} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
