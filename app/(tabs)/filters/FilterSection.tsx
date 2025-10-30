import React from "react";
import { View, Text } from "react-native";
import AreaSelector from "./AreaSelector";
import RoomTypeSelector from "./RoomTypeSelector";
import PriceRange from "./PriceRange";
import FilterFooter from "./FilterFooter";

export default function FilterSection() {
  return (
    <View className="px-5">
      <Text className="text-lg font-semibold text-[#112D4E]">
        Bộ lọc tìm phòng
      </Text>
      <AreaSelector />
      <RoomTypeSelector />
      <PriceRange />
    </View>
  );
}
