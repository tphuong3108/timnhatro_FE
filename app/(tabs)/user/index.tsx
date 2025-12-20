// index.tsx
import ActionButtons from "@/components/user/ActionButtons";
import CoverSection from "@/components/user/CoverSection";
import Favorites from "@/components/user/Favorites";
import InfoSection from "@/components/user/InfoSection";
import MyPosts from "@/components/user/MyPosts";
import { profileApi } from "@/services/profileApi";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"posts" | "favorites">("posts");

  //  Đây là profile của chính chủ
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
    } catch {
      Alert.alert("Lỗi", "Không thể tải hồ sơ người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

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
        <TouchableOpacity
          onPress={() =>
            router.push(
              user?.role?.toLowerCase() === "host"
                ? "/(tabs)/booking/HostBookingList"
                : "/(tabs)/booking/UserBookingList"
            )
          }
          activeOpacity={0.8}
          className="border border-[#3F72AF] py-3 rounded-full flex-row justify-center items-center mt-4"
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#3F72AF"
          />
          <Text className="text-[#3F72AF] font-semibold text-[16px] ml-2">
            {user?.role?.toLowerCase() === "host"
              ? "Lịch Xem Phòng"
              : "Lịch xem phòng của bạn"}
          </Text>
        </TouchableOpacity>
        {user?.role?.toLowerCase() === "host" && (
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/historypayments/HostPaymentHistory")}
            activeOpacity={0.8}
            className="border border-[#3F72AF] py-3 rounded-full flex-row justify-center items-center mt-4"
          >
            <Ionicons name="cash-outline" size={20} color="#3F72AF" />
            <Text className="text-[#3F72AF] font-semibold text-[15px] ml-2">
              Lịch sử giao dịch
            </Text>
          </TouchableOpacity>
        )}

        {user?.role?.toLowerCase() === "host" && (
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/user/HostStatsScreen")}
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
            <MyPosts
              rooms={user?.myRooms || []}
              isOwner={true}
              onDelete={(id: string) => {
                setUser((prev: any) => ({
                  ...prev,
                  myRooms: (prev?.myRooms || []).filter((r: any) => r._id !== id),
                }));
              }}
              onEdit={(id: string) => router.push(`/(tabs)/room/edit/${id}`)}
            />
          ) : (
            <Favorites favorites={user?.favorites || []} />
          )}
        </View>
      </View>
    </ScrollView>
  );
}
