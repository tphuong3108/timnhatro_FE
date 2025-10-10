import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function SectionHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <View className="flex-row justify-between items-center mb-2 px-1">
      <Text
        className="font-bold text-[#3F72AF]"
        style={{ fontSize: width > 400 ? 18 : 16 }}
      >
        {title}
      </Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push("/room" as any)}
      >
        <Text
          className="text-[#3F72AF] font-medium"
          style={{ fontSize: width > 400 ? 14 : 12 }}
        >
          Xem tất cả
        </Text>
      </TouchableOpacity>
    </View>
  );
}
