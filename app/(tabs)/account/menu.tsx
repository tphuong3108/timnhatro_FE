import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type MenuItem =
  | { label: string; icon: string; route: string }
  | { label: string; icon: string; action: () => Promise<void> }; 
export default function AccountMenu() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          setIsLoggedIn(false);
          router.replace("/auth/login");
        },
      },
    ]);
  };

  if (isLoggedIn === null) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3F72AF" />
      </View>
    );
  }

  const staticItems: MenuItem[] = [
    {
      label: "Giới thiệu ứng dụng",
      icon: "information-circle-outline",
      route: "/account/about",
    },
    {
      label: "Chính sách & điều khoản",
      icon: "document-text-outline",
      route: "/account/policy",
    },
  ];

  const authItems: MenuItem[] = isLoggedIn
    ? [
        {
          label: "Đăng xuất",
          icon: "log-out-outline",
          action: handleLogout,
        },
      ]
    : [
        { label: "Đăng nhập", icon: "log-in-outline", route: "/auth/login" },
        { label: "Đăng ký", icon: "person-add-outline", route: "/auth/register" },
      ];

  const allItems: MenuItem[] = [...authItems, ...staticItems];

  return (
    <ScrollView
      className="flex-1 bg-[#f9fafb]"
      contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-6">
        <Text className="text-2xl font-bold text-[#3F72AF] text-center">
          Menu tài khoản
        </Text>
      </View>

      {allItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.8}
          onPress={
            "action" in item
              ? item.action
              : () => router.push({ pathname: item.route as any })
          }
          className="flex-row items-center bg-white p-4 mb-3 rounded-2xl border border-gray-200"
        >
          <Ionicons name={item.icon as any} size={22} color="#3F72AF" />
          <Text className="ml-3 text-gray-700 font-medium">{item.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
