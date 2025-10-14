import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const amenities = [
  { icon: "wifi-outline", name: "Wi-Fi miễn phí", color: "#3F72AF", type: "Ionicons" },
  { icon: "tv-outline", name: "TV", color: "#3F72AF", type: "Ionicons" },
  { icon: "snowflake", name: "Điều hòa", color: "#3F72AF", type: "Material" },
  { icon: "washing-machine", name: "Máy giặt", color: "#3F72AF", type: "Material" },
  { icon: "stove", name: "Khu bếp", color: "#3F72AF", type: "Material" },
  { icon: "fridge-outline", name: "Tủ lạnh", color: "#3F72AF", type: "Material" },
  { icon: "car-outline", name: "Chỗ để xe", color: "#3F72AF", type: "Ionicons" },
  { icon: "smoke-detector", name: "Máy báo khói", color: "#3F72AF", type: "Material" },
];

export default function AmenitiesList() {
  return (
    <View className="mt-3">
      <View className="flex-row flex-wrap justify-start gap-x-3">
        {amenities.map((item, index) => (
          <View
            key={index}
            className="w-[30%] h-[75px] bg-white rounded-2xl mb-3 items-center justify-center border border-gray-300"
          >
            <View className="w-8 h-8 items-center justify-center">
              {item.type === "Ionicons" ? (
                <Ionicons name={item.icon as any} size={26} color={item.color} />
              ) : (
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={26}
                  color={item.color}
                />
              )}
            </View>

            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-gray-700 text-center text-[12px] mt-1 font-medium w-[70px]"
            >
              {item.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
