import React from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

export default function Header() {
  return (
    <View className="absolute top-0 left-0 w-full z-10 bg-white/80 backdrop-blur-md px-4 pt-12 pb-3">
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Image
            source={require("../assets/images/logo.svg")}
            className="w-7 h-7 mr-2"
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity activeOpacity={0.8}>
          <Ionicons name="globe-outline" size={RFValue(20)} color="#3F72AF" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center bg-[#F1F4F9] rounded-full px-4 py-2">
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
