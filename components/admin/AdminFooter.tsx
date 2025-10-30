import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname, Href } from "expo-router";
import { RFValue } from "react-native-responsive-fontsize";

export default function AdminFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("");

  const { width } = Dimensions.get("window");
  const isWide = width >= 480;

  const tabs: { key: string; route: Href; icon: string; activeIcon: string }[] = [
    { key: "Dashboard", route: "/admin/dashboard" as Href, icon: "grid-outline", activeIcon: "grid" },
    { key: "Bài đăng", route: "/admin/posts" as Href, icon: "document-text-outline", activeIcon: "document-text" },
    { key: "Người dùng", route: "/admin/users" as Href, icon: "people-outline", activeIcon: "people" },
    { key: "Báo cáo", route: "/admin/reports" as Href, icon: "bar-chart-outline", activeIcon: "bar-chart" },
  ];

  useEffect(() => {
    const found = tabs.find((t) => pathname.startsWith(t.route as string));
    if (found) setActiveTab(found.key);
  }, [pathname]);

  return (
    <View className="relative items-center bg-transparent z-30">
      <View
        className={`relative bg-white shadow-[0_-3px_10px_rgba(0,0,0,0.1)]
        flex-row justify-between items-center
        ${isWide ? "w-[430px] rounded-t-2xl" : "w-full"}
        h-[75px] px-4`}
      >
        {tabs.map((tab) => {
          const focused = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => router.push(tab.route)}
              activeOpacity={0.85}
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
                  marginTop: 2,
                  textAlign: "center",
                  fontWeight: focused ? "600" : "400",
                  color: focused ? "#3F72AF" : "#777",
                }}
                numberOfLines={1}
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
