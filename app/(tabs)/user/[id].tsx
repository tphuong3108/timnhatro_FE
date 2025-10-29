import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import InfoSection from "./InfoSection";
import ActionButtons from "./ActionButtons";
import CoverSection from "./CoverSection";
import MyPosts from "./MyPosts";
import Favorites from "./Favorites";


export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "favorites">("posts");

  useEffect(() => {
    setTimeout(() => {
      setUser({
        _id: id,
        fullName: "Tracy Nguyễn",
        email: "tracy@example.com",
        phone: "0987654321",
        avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        role: "Chủ trọ siêu cấp 🌟",
      });
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3F72AF" />
      </View>
    );

  return (
    <Animated.ScrollView
      entering={FadeInDown.duration(500)}
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Ảnh bìa + avatar */}
      <CoverSection user={user} />

      {/* Thông tin cá nhân */}
      <View className="w-full max-w-[700px] self-center px-5">
        <InfoSection user={user} />

        {/* Tabs */}
        <ActionButtons activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* Nội dung */}
        <View className="mt-8">
          {activeTab === "posts" ? <MyPosts /> : <Favorites favorites={[]} />}
        </View>
      </View>
    </Animated.ScrollView>
  );
}
