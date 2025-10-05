import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { Platform } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#3F72AF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          height: Platform.OS === "ios" ? RFValue(80) : RFValue(60),
          paddingBottom: RFValue(8),
          paddingTop: RFValue(6),
          borderTopWidth: 0.3,
          borderTopColor: "#ccc",
        },
        tabBarLabelStyle: {
          fontSize: RFValue(10),
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={RFValue(22)} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Tìm phòng",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={RFValue(22)} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: "Tin nhắn",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-outline" size={RFValue(22)} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Tài khoản",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={RFValue(22)} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
