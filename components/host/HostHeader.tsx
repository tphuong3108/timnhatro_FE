import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { TouchableOpacity, View, Text, Platform, ActivityIndicator } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import Logo from "@/assets/images/logo.svg";

export default function HostHeader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await AsyncStorage.multiRemove(["token", "user"]);
    router.replace("/auth/login");
    setLoading(false);
  };

  return (
    <View className="w-full z-20 overflow-hidden bg-[#B9D7EA]">
      <BlurView
        intensity={30}
        tint="light"
        style={{
          paddingHorizontal: 20,
          paddingTop: Platform.OS === "ios" ? 55 : 35,
          paddingBottom: 12,
        }}
        className="flex-row justify-between items-center"
      >
        <Logo width={RFValue(95)} height={RFValue(30)} />
        <TouchableOpacity onPress={handleLogout} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size={RFValue(18)} />
          ) : (
            <Ionicons name="log-out-outline" size={RFValue(22)} color="#fff" />
          )}
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}
