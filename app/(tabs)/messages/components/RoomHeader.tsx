import React from "react";
import { View, Text, Image } from "react-native";

interface Props {
  room: {
    name?: string;
    images?: string[];
    address?: string;
    price?: number;
  };
}

export default function RoomHeader({ room }: Props) {
  return (
    <View className="bg-white p-3 border-b border-gray-200">
      <View className="flex-row">
        <Image
          source={{ uri: room?.images?.[0] }}
          className="w-20 h-20 rounded-lg mr-3"
        />

        <View className="flex-1">
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
      </View>
    </View>
  );
}
