import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname, Href } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";

export default function HostFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("");

  const { width } = Dimensions.get("window");
  const isWide = width >= 480;

  const tabs = [
    { key: "Trang chủ", route: "/host" as Href, icon: "home-outline", activeIcon: "home" },
    { key: "Phòng", route: "/host/rooms" as Href, icon: "business-outline", activeIcon: "business" },
    { key: "Đánh giá", route: "/host/reviews" as Href, icon: "chatbubble-outline", activeIcon: "chatbubble" },
    { key: "Thống kê", route: "/host/stats" as Href, icon: "bar-chart-outline", activeIcon: "bar-chart" },
  ];

  useEffect(() => {
    const found = tabs.find((t) => pathname.startsWith(t.route as string));
    if (found) setActiveTab(found.key);
  }, [pathname]);

  return (
    <View className="relative items-center bg-transparent z-30">
      <View
        className={`bg-white shadow-[0_-3px_10px_rgba(0,0,0,0.1)]
        flex-row justify-between items-center
        ${isWide ? "w-[430px] rounded-t-2xl" : "w-full"}
        h-[70px] px-4`}
      >
        {tabs.map((tab) => {
          const focused = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => router.push(tab.route)}
              activeOpacity={0.8}
              className="items-center justify-center flex-1"
            >
              <Ionicons
                name={focused ? (tab.activeIcon as any) : (tab.icon as any)}
                size={RFValue(22)}
                color={focused ? "#3F72AF" : "#999"}
              />
              <Text
                style={{
                  fontSize: RFValue(11),
                  color: focused ? "#3F72AF" : "#777",
                  marginTop: 2,
                }}
              >
                {tab.key}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
