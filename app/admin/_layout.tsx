import AdminFooter from "@/components/admin/AdminFooter";
import AdminHeader from "@/components/admin/AdminHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function AdminLayout() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userData = await AsyncStorage.getItem("user");

        if (!token || !userData) {
          setIsLoggedIn(false);
          setIsChecking(false);
          return;
        }

        const user = JSON.parse(userData);
        setIsLoggedIn(true);
        setIsAdmin(user?.role?.toLowerCase() === "admin");
      } catch {
      } finally {
        setIsChecking(false);
      }
    };
    checkAuth();
  }, []);

  if (isChecking) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3F72AF" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href="/auth/login" />;
  }

  if (!isAdmin) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <View className="flex-1 bg-[#F9FAFB] relative overflow-hidden">
      <AdminHeader />
      <View className="flex-1 mb-[65px] px-4">
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            contentStyle: { backgroundColor: "#F9FAFB" },
          }}
        />
      </View>

      <View className="absolute bottom-0 left-0 right-0 z-50 bg-white shadow-md">
        <AdminFooter />
      </View>
    </View>
  );
}
