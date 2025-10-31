// index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ActionButtons from "./ActionButtons";
import CoverSection from "./CoverSection";
import Favorites from "./Favorites";
import InfoSection from "./InfoSection";
import MyPosts from "./MyPosts";
import { profileApi } from "@/services/profileApi";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "favorites">("posts");

  // ✅ Đây là profile của chính chủ
  const isOwner = true;

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const data = await profileApi.getMyProfile();
      setUser(data);
    } catch (error) {
      console.error("Fetch profile error:", error);
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
      {/* ✅ Truyền isOwner = true để hiện camera và nút sửa */}
      <CoverSection user={user} isOwner={isOwner} />

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

          {user?.role?.toLowerCase() === "host" && (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/user/HomeStatsScreen")}
              className="border border-[#3F72AF] py-3 rounded-full flex-row justify-center items-center mt-4"
            >
              <Ionicons name="bar-chart-outline" size={20} color="#3F72AF" />
              <Text className="text-[#3F72AF] font-semibold text-[15px] ml-2">
                Xem thống kê
              </Text>
            </TouchableOpacity>
          )}
        <ActionButtons activeTab={activeTab} onChangeTab={setActiveTab} />

        <View className="mt-8">
          {activeTab === "posts" ? (
            <MyPosts rooms={user?.myRooms || []} />
          ) : (
            <Favorites favorites={user?.favorites || []} />
          )}
        </View>
      </View>
    </ScrollView>
  );
}
