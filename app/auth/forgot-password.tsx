import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AppleIcon from "../../assets/images/apple.svg";
import FacebookIcon from "../../assets/images/facebook.svg";
import GoogleIcon from "../../assets/images/google.svg";
import Logo from "../../assets/images/logodoc.svg";
import InputField from "../../components/InputField";
import apiClient from "../../services/apiClient";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập email của bạn!");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post("/users/forgot-password", { email });
      Alert.alert(
        "OTP đã được gửi!",
        "Vui lòng kiểm tra email để lấy mã OTP.",
        [
          {
            text: "OK",
            onPress: () =>
              router.push({
                pathname: "/auth/reset-password",
                params: { email },
              }),
          },
        ]
      );
    } catch (error: any) {
      console.log("Forgot password error:", error.response?.data || error.message);
      Alert.alert(
        "Lỗi",
        error.response?.data?.message ||
          "Không thể gửi mã OTP. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: RFValue(24),
            paddingVertical: RFValue(32),
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo + Tiêu đề */}
          <View className="items-center -mt-10">
            <Logo width={RFValue(165)} height={RFValue(165)} />
            <Text
              className="text-center font-bold text-[#3F72AF]"
              style={{
                fontSize: RFPercentage(2.8),
                marginTop: RFValue(20),
              }}
            >
              QUÊN MẬT KHẨU
            </Text>
            <Text
              className="text-center text-gray-500"
              style={{
                fontSize: RFPercentage(1.8),
                marginTop: RFValue(6),
                marginBottom: RFValue(20),
              }}
            >
              Hãy nhập Email của bạn để lấy lại Mật khẩu
            </Text>
          </View>

          {/* Ô nhập Email (đã đồng bộ InputField) */}
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Nút gửi OTP */}
          <TouchableOpacity
            className="bg-[#3F72AF] rounded-full"
            style={{
              paddingVertical: RFValue(12),
              marginBottom: RFValue(28),
            }}
            onPress={handleSendOTP}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                className="text-white text-center font-semibold"
                style={{ fontSize: RFPercentage(2.1) }}
              >
                LẤY MÃ OTP
              </Text>
            )}
          </TouchableOpacity>

          {/* Hoặc đăng nhập bằng */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text
              className="text-gray-500 mx-3"
              style={{ fontSize: RFPercentage(1.7) }}
            >
              Hoặc đăng nhập bằng
            </Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Nút mạng xã hội */}
          <View
            className="flex-row justify-between gap-5 mb-6"
            style={{ marginHorizontal: RFValue(10) }}
          >
            <TouchableOpacity
              className="flex-1 border border-[#3F72AF] rounded-lg items-center justify-center"
              style={{ height: RFValue(44) }}
            >
              <FacebookIcon width={RFValue(20)} height={RFValue(20)} />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 border border-[#3F72AF] rounded-lg items-center justify-center"
              style={{ height: RFValue(44) }}
            >
              <GoogleIcon width={RFValue(20)} height={RFValue(20)} />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 border border-[#3F72AF] rounded-lg items-center justify-center"
              style={{ height: RFValue(44) }}
            >
              <AppleIcon width={RFValue(20)} height={RFValue(20)} />
            </TouchableOpacity>
          </View>

          {/* Link đăng ký */}
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text
              className="text-center font-inter text-gray-600 mt-12"
              style={{ fontSize: RFPercentage(1.8) }}
            >
              Bạn chưa có tài khoản?{" "}
              <Text className="text-[#3F72AF] font-semibold">Đăng ký ngay!</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
