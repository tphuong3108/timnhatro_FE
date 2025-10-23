import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useFilter } from "./FilterContext";

export default function FilterFooter() {
  const { resetFilters, applyFilters } = useFilter();

  return (
    <View className="flex-row justify-between items-center mt-4 pb-3">
      <TouchableOpacity
        onPress={resetFilters}
        activeOpacity={0.8}
        className="border border-gray-400 px-5 py-2 rounded-xl"
      >
        <Text className="text-gray-600 font-medium">Xóa tất cả</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={applyFilters}
        activeOpacity={0.8}
        className="bg-[#3F72AF] px-6 py-2 rounded-xl"
      >
        <Text className="text-white font-semibold">Hiện kết quả</Text>
      </TouchableOpacity>
    </View>
  );
}
