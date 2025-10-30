import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, ScrollView } from "react-native";
import { Slot, Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminFooter from "@/components/admin/AdminFooter";

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
      } catch (error) {
        console.error("Auth check failed:", error);
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
    <View className="flex-1 bg-[#F9FAFB]">
      <AdminHeader />
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{
          paddingBottom: 90,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Slot />
      </ScrollView>
      <AdminFooter />
    </View>
  );
}
