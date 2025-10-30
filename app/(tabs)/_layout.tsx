import React from "react";
import { Tabs } from "expo-router";
import { View } from "react-native";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TabsLayout() {
  return (
    <View className="flex-1 bg-white relative overflow-hidden">
      <Header />
      <View className="flex-1 mb-[65px]">
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" },
          }}
        >
          <Tabs.Screen name="home" />
          <Tabs.Screen name="search" />
          <Tabs.Screen name="favorite" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </View>

      <View className="absolute bottom-0 left-0 right-0 z-50 bg-white shadow-md">
        <Footer />
      </View>
    </View>
  );
}
