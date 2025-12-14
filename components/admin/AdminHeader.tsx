import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Alert,
  Platform,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Logo from "@/assets/images/logo.svg";
import apiClient from "@/services/apiClient";
import { notificationApi } from "@/services/notificationApi";

export default function AdminHeader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [hasToken, setHasToken] = useState(false);

  // ⭐ Realtime unread notifications cho Admin
  useEffect(() => {
    let interval: any = null;

    const loadUnread = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          setHasToken(false);
          setUnread(0);
          return;
        }

        setHasToken(true);

        const count = await notificationApi.getAdminUnreadCount();
        setUnread(count);
      } catch (e) {
      }
    };

    loadUnread();
    interval = setInterval(loadUnread, 5000);

    return () => interval && clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất khỏi quản trị?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await apiClient.post("/users/logout");
            await AsyncStorage.multiRemove(["token", "user"]);
            router.replace("/auth/login");
          } catch {
            Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <View className="w-full z-20 overflow-hidden bg-[#B9D7EA]">
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
        {/* Logo admin */}
        <Logo width={RFValue(95)} height={RFValue(30)} />

        <View className="flex-row items-center gap-4">
          {/*  Chuông thông báo admin */}
          {hasToken && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                router.push("/admin/notifications")
              }
            >
              <View className="relative">
                <Ionicons
                  name="notifications-outline"
                  size={RFValue(24)}
                  color="#fff"
                />

                {unread > 0 && (
                  <View className="absolute -top-1 -right-1 bg-red-600 w-4 h-4 rounded-full items-center justify-center">
                    <Text className="text-white text-[10px] font-bold">
                      {unread}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}

          {/*  Logout */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size={RFValue(20)} color="#fff" />
            ) : (
              <Ionicons name="log-out-outline" size={RFValue(22)} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}
