import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import AppleIcon from "../../assets/images/apple.svg";
import FacebookIcon from "../../assets/images/facebook.svg";
import GoogleIcon from "../../assets/images/google.svg";
import Logo from "../../assets/images/logodoc.svg";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <View className="items-center mb-6">
        <Logo width={320} height={320} />
      </View>

      <Text className="text-3xl font-inter text-center mb-2">QUÊN MẬT KHẨU</Text>
      <Text className="text-gray-500 text-center mb-8">
        Hãy nhập Email của bạn để lấy lại Mật khẩu
      </Text>

      <TextInput
        label="Email"
        mode="outlined"
        placeholder=""
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ marginBottom: 16, backgroundColor: "white" }}
      />

      <TouchableOpacity
        className="bg-[#3F72AF] py-3 rounded-full mb-6"
        onPress={() => router.push("/auth/otp-verify")}
      >
        <Text className="text-white font-inter text-center text-lg">
          LẤY MÃ OTP
        </Text>
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
