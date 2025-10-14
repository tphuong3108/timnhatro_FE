import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useFilter } from "./FilterContext";

export default function RoomOptions() {
  const { filters, setFilters } = useFilter();

  const changeCount = (key: "bedrooms" | "beds" | "baths", delta: number) => {
    setFilters({
      ...filters,
      [key]: Math.max(0, filters[key] + delta),
    });
  };

  const renderItem = (label: string, key: "bedrooms" | "beds" | "baths") => (
    <View className="flex-row justify-between items-center py-2">
      <Text className="text-gray-800">{label}</Text>
      <View className="flex-row items-center space-x-3">
        <TouchableOpacity
          className="w-7 h-7 bg-gray-200 rounded-full items-center justify-center"
          onPress={() => changeCount(key, -1)}
        >
          <Text>-</Text>
        </TouchableOpacity>
        <Text>{filters[key]}</Text>
        <TouchableOpacity
          className="w-7 h-7 bg-gray-200 rounded-full items-center justify-center"
          onPress={() => changeCount(key, 1)}
        >
          <Text>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="mb-5">
      <Text className="font-semibold text-base mb-2">Phòng và phòng ngủ</Text>
      {renderItem("Phòng ngủ", "bedrooms")}
      {renderItem("Giường", "beds")}
      {renderItem("Phòng tắm", "baths")}
    </View>
  );
}
