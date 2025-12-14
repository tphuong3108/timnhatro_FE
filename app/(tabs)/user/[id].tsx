import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { profileApi } from "@/services/profileApi";

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
        <ActionButtons activeTab={activeTab} onChangeTab={setActiveTab} hideFavorites={true} />

        {/* Nội dung */}
        <View className="mt-8">
          {activeTab === "posts" ? (
            <MyPosts rooms={user?.publicRooms || []} />
          ) : (
            <View className="items-center mt-10">
              <Ionicons name="lock-closed-outline" size={40} color="#999" />
              <Text className="text-gray-500 mt-3 text-sm">
                Danh sách phòng đã lưu được ẩn.
              </Text>
            </View>
          )}
        </View>
      </View>
    </Animated.ScrollView>
  );
}
