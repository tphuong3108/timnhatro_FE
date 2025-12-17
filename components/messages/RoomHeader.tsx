import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  room: {
    _id?: string;
    slug?: string;
    name?: string;
    images?: string[];
    address?: string;
    price?: number;
  };
}

export default function RoomHeader({ room }: Props) {
  const handlePress = () => {
    const identifier = room?.slug || room?._id;
    if (identifier) {
      router.push(`/(tabs)/room/${identifier}` as any);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      className="bg-white p-3 border-b border-gray-200"
    >
      <View className="flex-row">
        <Image
          source={{ uri: room?.images?.[0] }}
          className="w-20 h-20 rounded-lg mr-3"
        />

        <View className="flex-1 justify-center">
          <Text className="font-semibold text-[15px] text-gray-900" numberOfLines={2}>
            {room?.name}
          </Text>

          {room?.address && (
            <Text className="text-gray-600 mt-1" numberOfLines={1}>
              📍 {room.address}
            </Text>
          )}

          {room?.price && (
            <Text className="text-[#3F72AF] font-bold mt-1">
              {room.price.toLocaleString()} VNĐ / tháng
            </Text>
          )}
        </View>

        <View className="justify-center">
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

