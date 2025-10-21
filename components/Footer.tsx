import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

interface FooterProps {
  onTabPress?: (tab: string) => void;
}

export default function Footer({ onTabPress }: FooterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("");

  const { width } = Dimensions.get("window");
  const isWide = width >= 480;

  const tabs = [
    { key: "Trang chủ", route: "/home" as const, icon: "home-outline", activeIcon: "home" },
    { key: "Nhắn tin", route: "/messages" as any, icon: "chatbubble-outline", activeIcon: "chatbubble" },
    { key: "Tìm phòng", route: "/filters" as const, icon: "business-outline", activeIcon: "business" },
    { key: "Tài khoản", route: "/user" as const, icon: "person-outline", activeIcon: "person" },
  ];

  const handlePress = (tab: (typeof tabs)[0]) => {
    setActiveTab(tab.key);
    router.push(tab.route);
    onTabPress?.(tab.key);
  };

  const handleAddRoom = () => {
    router.push("/room/add");
  };

  useEffect(() => {
    const foundTab = tabs.find((t) => pathname.startsWith(t.route));
    if (foundTab) setActiveTab(foundTab.key);
  }, [pathname]);

  return (
    <View className="relative items-center bg-transparent z-30">
      <View
        className={`relative bg-white shadow-[0_-3px_10px_rgba(0,0,0,0.1)]
        flex-row justify-between items-center
        ${isWide ? "w-[430px] rounded-t-2xl" : "w-full"}
        h-[75px] px-3`}
      >
        <View className="flex-row flex-1 justify-evenly">
          {tabs.slice(0, 2).map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => handlePress(tab)}
              activeOpacity={0.85}
              className="items-center flex-1"
            >
              <Ionicons
                name={activeTab === tab.key ? (tab.activeIcon as any) : (tab.icon as any)}
                size={22}
                color={activeTab === tab.key ? "#3F72AF" : "#999"}
              />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                className={`mt-1 text-[11px] ${
                  activeTab === tab.key ? "text-[#3F72AF] font-semibold" : "text-gray-500"
                }`}
              >
                {tab.key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="w-[65px]" />
        <View className="flex-row flex-1 justify-evenly">
          {tabs.slice(2).map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => handlePress(tab)}
              activeOpacity={0.85}
              className="items-center flex-1"
            >
              <Ionicons
                name={activeTab === tab.key ? (tab.activeIcon as any) : (tab.icon as any)}
                size={22}
                color={activeTab === tab.key ? "#3F72AF" : "#999"}
              />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                className={`mt-1 text-[11px] ${
                  activeTab === tab.key ? "text-[#3F72AF] font-semibold" : "text-gray-500"
                }`}
              >
                {tab.key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleAddRoom}
        activeOpacity={0.9}
          className="absolute left-1/2 -translate-x-1/2 -top-[10px]
          w-[60px] h-[60px] rounded-full bg-[#3F72AF]
          items-center justify-center shadow-lg border-[4px] border-white">
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}
