// app/admin/users/[id].tsx
import { profileApi } from "@/services/profileApi";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import ActionButtons from "@/components/user/ActionButtons";
import CoverSection from "@/components/user/CoverSection";
import Favorites from "@/components/user/Favorites";
import InfoSection from "@/components/user/InfoSection";
import MyPosts from "@/components/user/MyPosts";

export default function AdminUserDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"posts" | "favorites">("posts");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await profileApi.getPublicProfile(id as string);
        setUser(data);
      } catch (err) {
        setError("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text className="text-gray-500 mt-2">Đang tải thông tin...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Ionicons name="alert-circle-outline" size={48} color="#999" />
        <Text className="text-gray-600 text-center mt-3">{error || "Không tìm thấy người dùng."}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-5 bg-blue-500 px-5 py-2 rounded-full"
        >
          <Text className="text-white font-semibold">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.ScrollView
      entering={FadeInDown.duration(500)}
      className="flex-1 bg-white -mx-4"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Ảnh bìa + avatar */}
      <CoverSection user={user} />

      {/* Thông tin cá nhân */}
      <View className="w-full max-w-[700px] self-center px-5">
        <InfoSection user={user} />

        {/* Tabs - Admin có thể xem cả favorites */}
        <ActionButtons activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* Nội dung */}
        <View className="mt-8">
          {activeTab === "posts" ? (
            <MyPosts rooms={user?.publicRooms || []} />
          ) : (
            <Favorites favorites={user?.favorites || []} />
          )}
        </View>
      </View>
    </Animated.ScrollView>
  );
}
