import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";

export default function ActionButtons() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"posts" | "favorites">("posts");

  return (
    <View className="mt-4">
      <View className="flex-row bg-white border-b border-gray-200">
        {[
          { key: "posts", label: "Bài đăng" },
          { key: "favorites", label: "Phòng đã lưu" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => {
              setActiveTab(tab.key as "posts" | "favorites");
              router.push(
                tab.key === "posts"
                  ? "/(tabs)/user/MyPosts"
                  : "/(tabs)/user/Favorites"
              );
            }}
            activeOpacity={0.8}
            className="flex-1 items-center py-3"
          >
            <Text
              className={`font-medium ${
                activeTab === tab.key
                  ? "text-[#3F72AF]"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </Text>
            {activeTab === tab.key && (
              <View className="h-[2px] w-8 bg-[#3F72AF] rounded-full mt-1" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
