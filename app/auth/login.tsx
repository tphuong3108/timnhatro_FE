import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import Logo from "../../assets/images/logodoc.svg";
import FacebookIcon from "../../assets/images/facebook.svg";
import GoogleIcon from "../../assets/images/google.svg";
import AppleIcon from "../../assets/images/apple.svg";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  return (
    <View className="flex-1 bg-white px-6 pt-10">
      <View className="items-center mb-6">
        <Logo width={320} height={320} />
      </View>

      <Text className="text-4xl font-bold text-center">Chào mừng các bạn</Text>
      <Text className="text-gray-500 text-center mt-2 mb-8 text-xl">
        Hãy đăng nhập tài khoản bạn nhé!
      </Text>

      <TextInput
        label="Email"
        mode="outlined"
        placeholder="Nhập email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ marginBottom: 12, backgroundColor: "white" }}
      />

      <TextInput
        label="Mật khẩu"
        mode="outlined"
        placeholder="Nhập mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!passwordVisible}
        right={
          <TextInput.Icon
            icon={() => (
              <Ionicons
                name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                size={22}
                color="gray"
              />
            )}
            onPress={() => setPasswordVisible(!passwordVisible)}
          />
        }
        style={{ marginBottom: 16, backgroundColor: "white" }}
      />

      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity
          onPress={() => setRemember(!remember)}
          className="flex-row items-center"
          activeOpacity={0.8}
        >
          <View className="w-5 h-5 border border-gray-400 rounded mr-2 items-center justify-center">
            {remember && <Ionicons name="checkmark" size={16} color="#3F72AF" />}
          </View>
          <Text className="text-gray-600">Ghi nhớ mật khẩu</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
          <Text className="text-blue-600">Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="bg-[#3F72AF] py-3 rounded-full mb-6"
        onPress={() => router.replace("/(tabs)")}
      >
        <Text className="text-white font-bold text-center text-lg">
          ĐĂNG NHẬP
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
          <Text className="text-[#3F72AF] font-semibold">Đăng ký ngay!</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}
