import React, { useState } from "react";
import {
  TouchableOpacity,
  Platform,
  View,
  ActivityIndicator,
  Alert,
  Text,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "@/utils/apiClient";
import Logo from "../assets/images/logo.svg";

export default function Header() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleLogout = async () => {
    setShowPopup(false);
    Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
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
    <View className="w-full z-20 overflow-hidden bg-[#B9D7EA]">
      {/* Header chính */}
      <BlurView
        intensity={40}
        tint="light"
        style={{
          paddingHorizontal: 20,
          paddingTop: Platform.OS === "ios" ? 60 : 40,
          paddingBottom: 12,
        }}
        className="flex-row justify-between items-center"
      >
        <Logo width={RFValue(95)} height={RFValue(30)} />

        {/* Nút menu 3 gạch */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowPopup(true)}
        >
          <Ionicons name="menu-outline" size={RFValue(26)} color="#fff" />
        </TouchableOpacity>
      </BlurView>

      {/* Popup dạng Modal */}
      <Modal
        visible={showPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPopup(false)}
      >
        {/* Nền mờ */}
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
          onPress={() => setShowPopup(false)}
        >
          {/* Menu nổi */}
          <View
            style={{
              position: "absolute",
              top: Platform.OS === "ios" ? 90 : 70,
              right: 10,
              backgroundColor: "#fff",
              borderRadius: 10,
              width: 180,
              paddingVertical: 8,
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 10,
            }}
          >
            {/* ✅ Mục Trang cá nhân */}
            <TouchableOpacity
              onPress={() => {
                setShowPopup(false);
                router.push("/user");
              }}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderBottomWidth: 0.5,
                borderColor: "#E5E7EB",
              }}
            >
              <Ionicons name="person-outline" size={20} color="#3F72AF" />
              <Text
                style={{
                  marginLeft: 8,
                  color: "#3F72AF",
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                Trang cá nhân
              </Text>
            </TouchableOpacity>

            {/* Mục Đăng xuất */}
            <TouchableOpacity
              onPress={handleLogout}
              disabled={loading}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 14,
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#3F72AF" />
              ) : (
                <>
                  <Ionicons name="log-out-outline" size={20} color="#3F72AF" />
                  <Text
                    style={{
                      marginLeft: 8,
                      color: "#3F72AF",
                      fontSize: 15,
                      fontWeight: "500",
                    }}
                  >
                    Đăng xuất
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
