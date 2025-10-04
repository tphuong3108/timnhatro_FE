import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import Logo from "../../assets/images/logodoc.svg";
import FacebookIcon from "../../assets/images/facebook.svg";
import GoogleIcon from "../../assets/images/google.svg";
import AppleIcon from "../../assets/images/apple.svg";

export default function OtpVerify() {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <View className="items-center mb-6">
        <Logo width={320} height={320} />
      </View>

      <Text className="text-3xl font-inter text-center mb-2">NHẬP MÃ OTP</Text>
      <Text className="text-gray-500 text-center mb-8">
        Mã OTP đã được gửi vào Email của bạn
      </Text>

      <TextInput
        label="Mã OTP"
        mode="outlined"
        placeholder="Nhập mã OTP"
        value={otp}
        onChangeText={setOtp}
        secureTextEntry
        style={{ marginBottom: 16, backgroundColor: "white" }}
      />

      <TouchableOpacity
        className="bg-[#3F72AF] py-3 rounded-full mb-6"
        onPress={() => router.replace("/(tabs)")}
      >
        <Text className="text-white font-inter text-center text-lg">GỬI MÃ</Text>
      </TouchableOpacity>

      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="text-gray-500 mx-4">Hoặc đăng nhập bằng</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>
    <View className="flex-row justify-between px-6 gap-6 mb-6 mt-2">
        <TouchableOpacity className="flex-1 h-14 border border-[#3F72AF] rounded-lg items-center justify-center">
            <FacebookIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 h-14 border border-[#3F72AF] rounded-lg items-center justify-center">
            <GoogleIcon width={24} height={24} />
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 h-14 border border-[#3F72AF] rounded-lg items-center justify-center">
            <AppleIcon width={24} height={24} />
        </TouchableOpacity>
        </View>

      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text className="text-center text-gray-600">
          Bạn chưa có tài khoản?{" "}
          <Text className="text-[#3F72AF] font-inter">Đăng ký ngay!</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
