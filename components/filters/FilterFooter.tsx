import { useFilter } from "@/components/filters/FilterContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
        <View className="flex-row items-center justify-center">
          <Ionicons name="search-outline" size={18} color="white" />
          <Text className="text-white font-semibold ml-2">Hiện kết quả</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
