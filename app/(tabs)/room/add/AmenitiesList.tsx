import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const amenities = [
  { id: "wifi", icon: "wifi-outline", name: "Wi-Fi miễn phí", type: "Ionicons" },
  { id: "tv", icon: "tv-outline", name: "TV", type: "Ionicons" },
  { id: "aircon", icon: "snowflake", name: "Điều hòa", type: "Material" },
  { id: "washing", icon: "washing-machine", name: "Máy giặt", type: "Material" },
  { id: "kitchen", icon: "stove", name: "Khu bếp", type: "Material" },
  { id: "fridge", icon: "fridge-outline", name: "Tủ lạnh", type: "Material" },
  { id: "parking", icon: "car-outline", name: "Chỗ để xe", type: "Ionicons" },
  { id: "smoke", icon: "smoke-detector", name: "Máy báo khói", type: "Material" },
  { id: "security", icon: "shield-account", name: "An ninh", type: "Material" },
];

export default function AmenitiesList({
  selectedAmenities,
  setSelectedAmenities,
}: {
  selectedAmenities: string[];
  setSelectedAmenities: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [pressedId, setPressedId] = useState<string | null>(null);

  const toggleAmenity = (id: string) => {
    if (selectedAmenities.includes(id)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== id));
    } else {
      setSelectedAmenities([...selectedAmenities, id]);
    }
  };

  return (
    <View className="mt-3">
      <View className="flex-row flex-wrap justify-between px-2">
        {amenities.map((item) => {
          const isSelected = selectedAmenities.includes(item.id);
          const isPressed = pressedId === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() => toggleAmenity(item.id)}
              onPressIn={() => setPressedId(item.id)}
              onPressOut={() => setPressedId(null)}
              className={`w-[31%] h-[80px] rounded-2xl mb-3 items-center justify-center border ${
                isSelected ? "border-[#3F72AF]" : "border-gray-300"
              } ${isPressed ? "bg-gray-100" : "bg-white"}`}
            >
              <View className="w-8 h-8 items-center justify-center">
                {item.type === "Ionicons" ? (
                  <Ionicons
                    name={item.icon as any}
                    size={26}
                    color={isSelected ? "#1E4F91" : "#3F72AF"}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={26}
                    color={isSelected ? "#1E4F91" : "#3F72AF"}
                  />
                )}
              </View>

              <Text
                numberOfLines={1}
                className={`text-center text-[12px] mt-1 font-medium w-[80px] ${
                  isSelected ? "text-[#1E4F91]" : "text-gray-700"
                }`}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
