import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Logo from "../../assets/images/logodoc.svg";
import InputField from "../../components/InputField";
import apiClient from "../../services/apiClient";

export default function OtpVerify() {
  const router = useRouter();
  const { firstName, lastName, email, phone, password } = useLocalSearchParams();
  const [otp, setOtp] = useState("");
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

  const handleVerify = async () => {
    if (!otp) return Alert.alert("Thiếu thông tin", "Vui lòng nhập mã OTP");

    try {
      setLoading(true);
      await apiClient.post("/users/verify-email", { email, otp });

      Alert.alert("🎉 Thành công", "Tài khoản đã được tạo!", [
        { text: "OK", onPress: () => router.replace("/auth/login") },
      ]);
    } catch (error: any) {
      console.log("Verify OTP error:", error.response?.data || error.message);
      Alert.alert(
        "Lỗi xác thực",
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
      await apiClient.post("/users/register", {
        firstName,
        lastName,
        phone,
        password,
        email,
      });
      Alert.alert("Đã gửi lại mã OTP", "Vui lòng kiểm tra email.");
    } catch (error: any) {
      console.log("Resend OTP error:", error.response?.data || error.message);
      Alert.alert("Lỗi", "Không thể gửi lại OTP. Thử lại sau.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-white px-6 pt-12 pb-10">
          {/* Logo */}
          <View className="items-center mb-6">
            <Logo width={280} height={280} />
          </View>

          {/* Tiêu đề */}
          <Text className="text-3xl font-bold text-center text-[#3F72AF] mb-2">
            NHẬP MÃ OTP
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Mã OTP đã được gửi tới email{" "}
            <Text className="font-semibold text-[#3F72AF]">{email}</Text>
          </Text>

          {/* Ô nhập OTP */}
          <InputField
            label="Mã OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
          />

          {/* Nút xác nhận */}
          <TouchableOpacity
            className="bg-[#3F72AF] py-3 rounded-full mb-6"
            onPress={handleVerify}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center text-lg font-semibold">
                XÁC NHẬN
              </Text>
            )}
          </TouchableOpacity>

          {/* Gửi lại mã OTP */}
          <TouchableOpacity onPress={handleResend} disabled={!canResend}>
            <Text
              className={`text-center ${
                canResend ? "text-[#3F72AF]" : "text-gray-400"
              } font-medium`}
            >
              {canResend ? "Gửi lại mã OTP" : `Gửi lại mã sau ${timer}s`}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
