import apiClient from "@/services/apiClient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AccountActions() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
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
    <View className="px-4 mt-2">
      {/* Nút Đăng xuất */}
      <TouchableOpacity
        onPress={handleLogout}
        disabled={loading}
        activeOpacity={0.8}
        className="border border-[#3F72AF] py-3 rounded-full flex-row justify-center items-center"
      >
        {loading ? (
          <ActivityIndicator size="small" color="#3F72AF" />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={20} color="#3F72AF" />
            <Text className="text-[#3F72AF] font-semibold text-[16px] ml-2">
              Đăng xuất
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
