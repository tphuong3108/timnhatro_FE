import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";

export default function EditButton({ room }: { room: any }) {
  if (!room?.id) return null;

  return (
    <TouchableOpacity
      className="bg-[#3F72AF] py-2 px-4 rounded-2xl mt-3"
      onPress={() => router.push(`/room/edit/${room.id}`)}
    >
      <Text className="text-white text-center font-semibold">
        Sửa phòng
      </Text>
    </TouchableOpacity>
  );
}
