import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { TextInput } from "react-native-paper";
import apiClient from "../../utils/apiClient";
import Logo from "../../assets/images/logodoc.svg";

export default function ResetPasswordOtp() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const countdown = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(countdown);
  }, [timer]);

  const handleResetPassword = async () => {
    if (!otp || !newPassword.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ mã OTP và mật khẩu mới!");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post("/users/reset-password", {
        email,
        otp,
        newPassword,
      });

      Alert.alert("🎉 Thành công", "Mật khẩu của bạn đã được đặt lại!", [
        { text: "Đăng nhập", onPress: () => router.replace("/auth/login") },
      ]);
    } catch (error: any) {
      console.log("Reset password error:", error.response?.data || error.message);
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setCanResend(false);
      setTimer(60);
      await apiClient.post("/users/forgot-password", { email });
      Alert.alert(" Đã gửi lại mã OTP", "Vui lòng kiểm tra email.");
    } catch (error: any) {
      console.log("Resend OTP error:", error.response?.data || error.message);
      Alert.alert("Lỗi", "Không thể gửi lại OTP. Thử lại sau.");
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <View className="items-center mb-6">
        <Logo width={320} height={320} />
      </View>

      <Text className="text-3xl font-inter text-center mb-2">
        ĐẶT LẠI MẬT KHẨU
      </Text>
      <Text className="text-gray-500 text-center mb-8">
        Mã OTP đã được gửi tới email {email}
      </Text>

      <TextInput
        label="Mã OTP"
        mode="outlined"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        style={{ marginBottom: 16, backgroundColor: "white" }}
      />

      <TextInput
        label="Mật khẩu mới"
        mode="outlined"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={{ marginBottom: 16, backgroundColor: "white" }}
      />

      <TouchableOpacity
        className="bg-[#3F72AF] py-4 rounded-full mb-6 mt-4"
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text className="text-white font-inter text-center text-2xl">
          {loading ? "Đang xử lý..." : "XÁC NHẬN"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleResend}
        disabled={!canResend}
        className=""
      >
        <Text className="text-center text-gray-700">
          {canResend ? "Gửi lại mã OTP" : `Gửi lại mã sau ${timer}s`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
