import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import CoverSection from "./CoverSection";
import InfoSection from "./InfoSection";
import MyPosts from "./MyPosts";
import Favorites from "./Favorites";
import ActionButtons from "./ActionButtons";
import apiClient from "@/utils/apiClient";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "favorites">("posts");

  const fetchProfile = async () => {
    try {
      const mockUser = {
        fullName: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        phone: "0987654321",
        avatar: "https://i.pravatar.cc/150?img=3",
        role: "Người thuê trọ",
      };
      setUser(mockUser);
    } catch {
      Alert.alert("Lỗi", "Không thể tải hồ sơ người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleBanAccount = async () => {
    Alert.alert("Khóa tài khoản", "Bạn chắc chắn muốn khóa tài khoản?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Khóa",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await apiClient.put("/users/me/ban");
            await AsyncStorage.removeItem("token");
            Alert.alert("Tài khoản đã bị khóa", "Bạn sẽ bị đăng xuất.");
            router.replace("/auth/login");
          } catch {
            Alert.alert("Lỗi", "Không thể khóa tài khoản.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3F72AF" />
      </View>
    );

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <CoverSection user={user} />
      <View className="w-full max-w-[700px] self-center px-5">
        <InfoSection user={user} />

        <TouchableOpacity
          onPress={handleBanAccount}
          activeOpacity={0.8}
          className="border border-[#3F72AF] py-3 rounded-full flex-row justify-center items-center mt-4"
        >
          <Text className="text-[#3F72AF] font-semibold text-[16px] ml-2">
            Khóa tài khoản
          </Text>
        </TouchableOpacity>

        {/* Tabs */}
        <ActionButtons activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* Nội dung tab */}
        <View className="mt-8">
          {activeTab === "posts" ? <MyPosts /> : <Favorites />}
        </View>
      </View>
    </ScrollView>
  );
}
