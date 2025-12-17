import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <View className="flex-1 bg-white relative overflow-hidden">
      <Header />
      <View className="flex-1 mb-[65px]">
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
          }}
        />
      </View>

      <View className="absolute bottom-0 left-0 right-0 z-50 bg-white shadow-md">
        <Footer />
      </View>
    </View>
  );
}

