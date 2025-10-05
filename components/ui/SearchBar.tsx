import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

export default function SearchBar() {
  return (
    <View className="bg-[#3F72AF] p-4 rounded-b-3xl">
      <View className="flex-row items-center bg-white rounded-full px-4 py-2">
        <Ionicons name="search-outline" size={RFValue(18)} color="#3F72AF" />
        <Text className="text-gray-500 ml-2">Tìm phòng giá tốt tại đây</Text>
      </View>
    </View>
  );
}
