import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import Logo from "../../assets/images/logodoc.svg";
import apiClient from "../../utils/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfile() {
  const router = useRouter();

  const [name, setName] = useState("Nguyễn Văn A");
  const [email, setEmail] = useState("nguyenvana@example.com");
  const [phone, setPhone] = useState("0987654321");
  const [loading, setLoading] = useState<"save" | "ban" | null>(null);

  const handleSave = async () => {
    if (!name || !email || !phone) {
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường!");
    }

    try {
      setLoading("save");
      await apiClient.put("/users/update-profile", {
        fullName: name,
        email,
        phone,
      });
      Alert.alert("🎉 Thành công", "Cập nhật thông tin thành công!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.log("Edit profile error:", error.response?.data || error.message);
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Không thể cập nhật thông tin."
      );
    } finally {
      setLoading(null);
    }
  };

  const handleBanAccount = async () => {
    Alert.alert("Khóa tài khoản", "Bạn chắc chắn muốn khóa tài khoản?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Khóa",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading("ban");
            await apiClient.put("/users/me/ban");
            await AsyncStorage.removeItem("token");
            Alert.alert("Tài khoản đã bị khóa", "Bạn sẽ bị đăng xuất.");
            router.replace("/auth/login");
          } catch {
            Alert.alert("Lỗi", "Không thể khóa tài khoản.");
          } finally {
            setLoading(null);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-white px-6 pt-12">
          <View className="items-center mb-4">
            <Logo width={220} height={220} />
          </View>

          <View className="w-full items-center mb-2">
            <Text className="text-3xl font-bold text-[#3F72AF] font-inter text-center">
              CHỈNH SỬA HỒ SƠ
            </Text>
          </View>

          <Text className="text-gray-500 text-[14px] text-center mb-8">
            Cập nhật thông tin cá nhân của bạn
          </Text>

          <TextInput
            label="Họ và tên"
            mode="outlined"
            value={name}
            onChangeText={setName}
            style={{ marginBottom: 16, backgroundColor: "white" }}
          />

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={{ marginBottom: 16, backgroundColor: "white" }}
          />

          <TextInput
            label="Số điện thoại"
            mode="outlined"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={{ marginBottom: 10, backgroundColor: "white" }}
          />

          <TouchableOpacity
            onPress={() => router.push("/auth/change-password")}
            activeOpacity={0.7}
            className="self-end mb-6"
          >
            <Text className="text-[#3F72AF] font-medium text-[14px] underline">
              Đổi mật khẩu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-[#3F72AF] py-3 rounded-full"
            onPress={handleSave}
            disabled={loading === "save"}
          >
            {loading === "save" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-inter text-center text-lg">
                LƯU THAY ĐỔI
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBanAccount}
            disabled={loading === "ban"}
            activeOpacity={0.8}
            className="border border-red-500 py-3 rounded-full flex-row justify-center items-center mt-6 mb-10"
          >
            {loading === "ban" ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <>
                <Ionicons name="close-circle-outline" size={20} color="#ef4444" />
                <Text className="text-red-500 font-semibold text-[16px] ml-2">
                  Khóa tài khoản
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
