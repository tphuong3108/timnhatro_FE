import React from "react";
import { View, Text } from "react-native";

export default function NearbyRooms() {
  const data = [
    { name: "Phòng gần trung tâm", distance: "2km từ vị trí của bạn" },
    { name: "Phòng có ban công", distance: "5km từ bạn" },
  ];

  return (
    <View className="flex-row space-x-3">
      {data.map((item, i) => (
        <View
          key={i}
          className="flex-1 bg-[#F8FAFC] rounded-2xl p-3 shadow-sm"
        >
          <Text className="text-[#3F72AF] font-semibold text-[15px]">
            {item.name}
          </Text>
          <Text className="text-gray-500 text-[12px] mt-1">
            {item.distance}
          </Text>
        </View>
      ))}
    </View>
  );
}
