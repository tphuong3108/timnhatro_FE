// app/admin/users/[id].tsx
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
import { adminApi } from "@/services/adminApi";
import InfoSection from "@/app/(tabs)/user/InfoSection";
import CoverSection from "@/app/(tabs)/user/CoverSection";
import ActionButtons from "@/app/(tabs)/user/ActionButtons";
import Favorites from "@/app/(tabs)/user/Favorites";
import MyPosts from "@/app/(tabs)/user/MyPosts";


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

        const data = await adminApi.getUserDetails(id as string);

        // Dữ liệu backend trả về có dạng { success: true, user: {...} }
        setUser(data.user || data);
      } catch (err) {
        setError("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // 🌀 Loading
  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text className="text-gray-500 mt-2">Đang tải thông tin...</Text>
      </View>
    );

  // ❌ Lỗi
  if (error || !user)
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Ionicons name="alert-circle-outline" size={48} color="#999" />
        <Text className="text-gray-600 text-center mt-3">
          {error || "Không tìm thấy người dùng."}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-5 bg-blue-500 px-5 py-2 rounded-full"
        >
          <Text className="text-white font-semibold">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );

  // ✅ Hiển thị giống UserProfile
  return (
    <Animated.ScrollView
      entering={FadeInDown.duration(500)}
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Ảnh bìa + avatar */}
      <CoverSection user={user} isOwner={false} />

      {/* Thông tin cá nhân */}
      <View className="w-full max-w-[700px] self-center px-5">
        <InfoSection user={user} />

        {/* Tabs */}
        <ActionButtons
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />

        {/* Nội dung */}
        <View className="mt-8">
          {activeTab === "posts" ? (
            <MyPosts rooms={user?.rooms || []} />
          ) : (
            <Favorites favorites={user?.favorites || []} />
          )}
        </View>
      </View>
    </Animated.ScrollView>
  );
}
