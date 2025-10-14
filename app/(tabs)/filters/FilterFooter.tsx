import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useFilter } from "./FilterContext";

export default function FilterFooter() {
  const { resetFilters, filters } = useFilter();

  return (
    <View className="border-t border-gray-200 flex-row justify-between items-center px-4 py-3 bg-white">
      <TouchableOpacity onPress={resetFilters}>
        <Text className="text-red-500 font-medium">Xóa tất cả</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-black px-5 py-3 rounded-full"
        onPress={() => console.log("FILTER VALUES:", filters)}
      >
        <Text className="text-white font-semibold">Hiển thị kết quả</Text>
      </TouchableOpacity>
    </View>
  );
}
