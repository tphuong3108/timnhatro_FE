import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

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
          <Tabs.Screen name="home/index" options={{ title: "Home" }} />
          <Tabs.Screen name="filters/index" options={{ title: "Search" }} />
          <Tabs.Screen name="user/Favorites" options={{ title: "Favorites" }} />
          <Tabs.Screen name="user/index" options={{ title: "Profile" }} />
        </Tabs>
      </View>

      <View className="absolute bottom-0 left-0 right-0 z-50 bg-white shadow-md">
        <Footer />
      </View>
    </View>
  );
}
