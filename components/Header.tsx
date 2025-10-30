import apiClient from "@/services/apiClient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  TouchableOpacity,
  View
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Logo from "../assets/images/logo.svg";

export default function Header() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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

        {/* Nút menu 3 gạch */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/account/menu")}
        >
          <Ionicons name="menu-outline" size={RFValue(26)} color="#fff" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}
