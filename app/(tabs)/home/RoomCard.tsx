import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";

export default function RoomCard({ room }: any) {
  return (
    <TouchableOpacity
      className="w-[48%] bg-white border border-gray-200 rounded-xl mb-4 shadow-sm"
      activeOpacity={0.9}
    >
      <Image
        source={room.img}
        className="w-full h-[100px] rounded-t-xl"
        resizeMode="cover"
      />
      <View className="p-2">
        <Text
          className="font-semibold text-gray-800"
          style={{ fontSize: RFPercentage(1.8) }}
          numberOfLines={1}
        >
          {room.title}
        </Text>
        <Text
          className="text-gray-500 mt-1"
          style={{ fontSize: RFPercentage(1.6) }}
        >
          {room.views}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
