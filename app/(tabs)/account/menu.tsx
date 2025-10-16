import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type MenuItem =
  | { label: string; icon: string; route: string }
  | { label: string; icon: string; action: () => void };

export default function AccountMenu() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    setIsLoggedIn(false);
    router.replace("/home");
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
      className="flex-1 bg-white px-4 pt-6"
      contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
      showsVerticalScrollIndicator={false}
    >
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
