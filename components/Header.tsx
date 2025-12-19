import apiClient from "@/services/apiClient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";

import { notificationApi } from "@/services/notificationApi";

import React, { useEffect, useState } from "react";
import {
    Alert,
    Platform,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Logo from "../assets/images/logo.svg";

export default function Header() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [unread, setUnread] = useState(0);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setHasToken(!!token);

      if (token) {
        const count = await notificationApi.getUnreadCount();
        setUnread(count);
      }
    };
    checkToken();
  }, []);

  useEffect(() => {
  let interval: any = null;

  const loadUnread = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setUnread(0);
        setHasToken(false);
        return;
      }

      setHasToken(true);
      const count = await notificationApi.getUnreadCount();
      setUnread(count);
    } catch (e) {
    }
  };
  loadUnread();
  interval = setInterval(loadUnread, 3000);

  return () => {
    if (interval) clearInterval(interval);
  };
}, []);

  const handleLogout = async () => {
    setShowPopup(false);
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await apiClient.post("/users/logout");
            await AsyncStorage.removeItem("token");
            router.replace("/auth/login");
          } catch {
            Alert.alert("Lỗi", "Không thể đăng xuất.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <View className="w-full z-20 overflow-hidden bg-[#B9D7EA]">
      {/* Header chính */}
      <BlurView
        intensity={40}
        tint="light"
        style={{
          paddingHorizontal: 20,
          paddingTop: Platform.OS === "ios" ? 60 : 40,
          paddingBottom: 12,
        }}
        className="flex-row justify-between items-center"
      >
        <Logo width={RFValue(95)} height={RFValue(30)} />
        <View className="flex-row items-center gap-4">

          {/* Icon thông báo */}
          {hasToken && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push({ pathname: "/notifications" })}
            >
              <View className="relative">
                <Ionicons
                  name="notifications-outline"
                  size={RFValue(24)}
                  color="#fff"
                />

                {unread > 0 && (
                  <View className={`absolute -top-1 -right-1 bg-red-600 rounded-full items-center justify-center ${unread >= 99 ? 'px-1 min-w-[20px] h-[16px]' : 'w-4 h-4'}`}>
                    <Text className="text-white text-[9px] font-bold">
                      {unread >= 99 ? "99+" : unread}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}

          {/* Icon menu */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/account/menu")}
          >
            <Ionicons name="menu-outline" size={RFValue(26)} color="#fff" />
          </TouchableOpacity>
        </View>

      </BlurView>
    </View>
  );
}
