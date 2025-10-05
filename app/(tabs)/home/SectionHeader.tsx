import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

export default function SectionHeader({ title }: { title: string }) {
  return (
    <View className="flex-row justify-between items-center mb-2">
      <Text
        className="font-bold text-[#3F72AF]"
        style={{ fontSize: RFPercentage(2.2) }}
      >
        {title}
      </Text>
      <TouchableOpacity>
        <Text className="text-[#3F72AF] font-medium">Xem tất cả</Text>
      </TouchableOpacity>
    </View>
  );
}
