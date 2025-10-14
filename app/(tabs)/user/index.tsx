import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, Alert } from "react-native";
import CoverSection from "./CoverSection";
import InfoSection from "./InfoSection";
import MyPosts from "./MyPosts";
import Favorites from "./Favorites";
import AccountActions from "./AccountActions";
import apiClient from "@/utils/apiClient";
import ActionButtons from "./ActionButtons";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "favorites">("posts");
  
  // const fetchProfile = async () => {
  //   try {
  //     const res = await apiClient.get("/users/profile");
  //     setUser(res.data.user || res.data);
  //   } catch {
  //     Alert.alert("Lỗi", "Không thể tải hồ sơ người dùng.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

        {/* Tabs */}
        <ActionButtons activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* Nội dung tab */}
        <View className="mt-8">
          {activeTab === "posts" ? <MyPosts /> : <Favorites />}
        </View>

        {/* Nút đăng xuất */}
        <View className="mt-5">
          <AccountActions />
        </View>
      </View>
    </ScrollView>
  );
}


