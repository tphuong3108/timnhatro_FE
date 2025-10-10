import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

export default function SearchBar() {
  return (
    <View className="px-4 mt-3">
      <View className="flex-row items-center bg-[#F1F4F9] rounded-full px-4 py-2 shadow-sm">
        <Ionicons name="search-outline" size={RFValue(18)} color="#3F72AF" />
        <TextInput
          placeholder="Tìm phòng giá tốt tại đây"
          placeholderTextColor="#777"
          className="flex-1 ml-2 text-gray-800 text-[13px]"
        />
        <TouchableOpacity activeOpacity={0.8}>
          <Ionicons name="notifications-outline" size={RFValue(20)} color="#3F72AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
