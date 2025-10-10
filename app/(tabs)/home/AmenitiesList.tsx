import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const amenities = [
  { icon: "wifi-outline", name: "Wifi miễn phí" },
  { icon: "car-outline", name: "Chỗ đậu xe" },
  { icon: "snow-outline", name: "Máy lạnh" },
  { icon: "restaurant-outline", name: "Khu bếp" },
  { icon: "tv-outline", name: "TV màn hình phẳng" },
  { icon: "sparkles-outline", name: "Phòng sạch mới" },
];

export default function AmenitiesList() {
  return (
    <View className="flex-row flex-wrap justify-between mt-2">
      {amenities.map((item, i) => (
        <View
          key={i}
          className="w-[30%] bg-[#F9FAFB] rounded-xl p-3 mb-3 items-center justify-center shadow-sm"
        >
          <Ionicons name={item.icon as any} size={20} color="#3F72AF" />
          <Text className="text-gray-700 text-center text-[12px] mt-1">
            {item.name}
          </Text>
        </View>
      ))}
    </View>
  );
}
