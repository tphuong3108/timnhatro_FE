import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  icon: string;
  label: string;
  value: string | number;
  change?: number;
}

export default function StatCard({ icon, label, value, change }: Props) {
  const { width } = useWindowDimensions();
  const isSmall = width < 380;

  return (
    <View
      className={`relative ${
        isSmall ? "w-[48%]" : "w-[48%]"
      } bg-white p-4 mb-3 rounded-2xl shadow-sm border border-gray-100 overflow-hidden`}
    >
      <View className="absolute bottom-2 right-2 opacity-10">
        <Ionicons name={icon as any} size={50} color="#3F72AF" />
      </View>

      <View className="flex-row items-center mb-2">
        <Ionicons name={icon as any} size={20} color="#3F72AF" />
        <Text
          className={`ml-2 text-gray-700 font-medium ${
            isSmall ? "text-[13px]" : "text-[14px]"
          }`}
        >
          {label}
        </Text>
      </View>

      <Text
        className={`font-bold text-[#112D4E] ${
          isSmall ? "text-[20px]" : "text-[24px]"
        }`}
      >
        {value}
      </Text>

      {change !== undefined && (
        <Text
          className={`text-xs mt-1 ${
            change >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)}%
        </Text>
      )}
    </View>
  );
}
