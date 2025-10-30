import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

export default function AdminHeader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất khỏi quản trị?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          try {
            console.log("DEBUG | Bắt đầu đăng xuất...");
            setLoading(true);
            await apiClient.post("/users/logout").catch((e) => {
              console.warn("⚠️ Lỗi API logout:", e?.message);
            });
            await AsyncStorage.multiRemove(["token", "user"]);
            console.log("DEBUG | Đăng xuất thành công, điều hướng về login...");
            setTimeout(() => {
              router.replace("/auth/login");
            }, 300);
          } catch (err) {
            console.error("Lỗi đăng xuất:", err);
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
        <Logo width={RFValue(95)} height={RFValue(30)} />
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
      </BlurView>
    </View>
  );
}
