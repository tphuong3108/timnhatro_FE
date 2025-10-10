import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { SvgProps } from "react-native-svg";

export interface Room {
  id: string;
  title: string;
  views: string;
  img: React.FC<SvgProps>;
}

export default function RoomCard({
  room,
  onPress,
}: {
  room: Room;
  onPress?: () => void;
}) {
  const Icon = room.img;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-white w-44 h-52 mr-3 rounded-2xl shadow-sm"
    >
      <View className="h-[120px] bg-[#F4F6FA] rounded-t-2xl items-center justify-center">
        <Icon width={70} height={70} />
      </View>

      <View className="px-3 py-2">
        <Text
          numberOfLines={2}
          className="text-[#3F72AF] font-bold text-[13px] leading-4"
        >
          {room.title}
        </Text>
        <Text className="text-gray-500 text-[11px] mt-0.5">
          {room.views}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
