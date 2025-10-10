import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

interface FooterProps {
  onTabPress?: (tab: string) => void;
}

export default function Footer({ onTabPress }: FooterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("");

  const tabs = [
    { key: "Trang chủ", route: "/home" as const, icon: "home-outline", activeIcon: "home" },
    { key: "Nhắn tin", route: "/chat" as const, icon: "chatbubble-outline", activeIcon: "chatbubble" },
    { key: "Tìm phòng", route: "/explore" as const, icon: "business-outline", activeIcon: "business" },
    { key: "Tài khoản", route: "/user" as const, icon: "person-outline", activeIcon: "person" },
  ];

  const handlePress = (tab: (typeof tabs)[0]) => {
    setActiveTab(tab.key);
    router.push(tab.route);
    if (onTabPress) onTabPress(tab.key);
  };

  useEffect(() => {
    const foundTab = tabs.find((t) => pathname.startsWith(t.route));
    if (foundTab) setActiveTab(foundTab.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <View className="flex-row justify-around items-center bg-white border-t border-gray-200 h-[80px]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => handlePress(tab)}
            className="items-center"
            activeOpacity={0.8}
          >
            <Ionicons
              name={isActive ? (tab.activeIcon as any) : (tab.icon as any)}
              size={22}
              color={isActive ? "#3F72AF" : "#999"}
            />
            <Text
              className={`text-[12px] mt-1 ${
                isActive ? "text-[#3F72AF] font-semibold" : "text-gray-500"
              }`}
            >
              {tab.key}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
