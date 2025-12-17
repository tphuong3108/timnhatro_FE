import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function InfoSection({ user }: any) {
  return (
    <View className="">
      <View className="bg-gray-50 rounded-2xl p-5 shadow-sm">
        <View className="flex-row items-center mb-3">
          <Ionicons name="mail-outline" size={20} color="#3F72AF" />
          <Text className="ml-3 text-gray-700">{user?.email}</Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="call-outline" size={20} color="#3F72AF" />
          <Text className="ml-3 text-gray-700">
            {user?.phone || "Chưa cập nhật số điện thoại"}
          </Text>
        </View>
      </View>
    </View>
  );
}
