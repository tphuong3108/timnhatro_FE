import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
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
import { useAuth } from "@/contexts/AuthContext";

import apiClient from "@/services/apiClient";

export default function Login() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập email và mật khẩu!");
    }

    try {
      setLoading(true);
      const res = await apiClient.post("users/login", { email, password });
      const { accessToken, userData } = res.data;
      const user = userData || res.data.user; 

      // role admin
      if (user.role?.toLowerCase() === "admin") {
        await AsyncStorage.setItem("token", accessToken);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        Alert.alert("🎉 Chào Admin!", "Đăng nhập quyền quản trị thành công!");
        router.replace("/admin/dashboard" as Href);
        return;
      }

      // Người dùng
      await AsyncStorage.setItem("token", accessToken);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      Alert.alert("🎉 Thành công", "Đăng nhập thành công!");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert(
        "Đăng nhập thất bại",
        error.response?.data?.message || "Sai email hoặc mật khẩu!"
      );
    } finally {
      setLoading(false);
    }
  };


  const handleSocialLogin = (provider: string) => {
    Alert.alert("Đang phát triển", `Tính năng đăng nhập bằng ${provider} sắp có!`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-between px-6 pb-4"
      >
        {/* Logo & tiêu đề */}
        <View className="items-center mt-4">
          <Logo width={RFValue(165)} height={RFValue(165)} onPress={() => router.push("/home")}/>
          <Text
            className="font-bold text-center mt-2 text-[#3F72AF]"
            style={{ fontSize: RFPercentage(3.2) }}
          >
            Chào mừng các bạn
          </Text>
          <Text
            className="text-gray-500 text-center"
            style={{
              fontSize: RFPercentage(2),
              marginTop: RFValue(6),
              marginBottom: RFValue(16),
            }}
          >
            Hãy đăng nhập tài khoản bạn nhé!
          </Text>
        </View>

        <View>
          {/* Email */}
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Mật khẩu */}
          <InputField
            label="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            right={
              <Ionicons
                name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                size={RFValue(20)}
                color="gray"
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
          />

          {/* Ghi nhớ mật khẩu & quên mật khẩu */}
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity
              onPress={() => setRemember(!remember)}
              className="flex-row items-center"
              activeOpacity={0.8}
            >
              <View
                className="border border-gray-400 rounded items-center justify-center"
                style={{
                  width: RFValue(18),
                  height: RFValue(18),
                  marginRight: RFValue(6),
                }}
              >
                {remember && (
                  <Ionicons name="checkmark" size={RFValue(12)} color="#3F72AF" />
                )}
              </View>
              <Text
                className="text-gray-600"
                style={{ fontSize: RFPercentage(1.8) }}
              >
                Ghi nhớ mật khẩu
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
              <Text
                className="text-blue-600"
                style={{ fontSize: RFPercentage(1.8) }}
              >
                Quên mật khẩu?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Nút đăng nhập */}
          <TouchableOpacity
            className="bg-[#3F72AF] rounded-full"
            style={{
              paddingVertical: RFValue(12),
              marginBottom: RFValue(20),
            }}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                className="text-white text-center font-medium"
                style={{ fontSize: RFPercentage(2.2) }}
              >
                ĐĂNG NHẬP
              </Text>
            )}
          </TouchableOpacity>

          {/* Hoặc đăng nhập bằng */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text
              className="text-gray-500 mx-4"
              style={{ fontSize: RFPercentage(1.8) }}
            >
              Hoặc đăng nhập bằng
            </Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Đăng nhập mạng xã hội */}
          <View className="flex-row justify-between px-6 gap-6 mb-10">
            <TouchableOpacity
              className="flex-1 border border-[#3F72AF] rounded-lg items-center justify-center"
              style={{ height: RFValue(42) }}
              onPress={() => handleSocialLogin("Facebook")}
            >
              <FacebookIcon width={RFValue(20)} height={RFValue(20)} />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 border border-[#3F72AF] rounded-lg items-center justify-center"
              style={{ height: RFValue(42) }}
              onPress={() => handleSocialLogin("Google")}
            >
              <GoogleIcon width={RFValue(20)} height={RFValue(20)} />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 border border-[#3F72AF] rounded-lg items-center justify-center"
              style={{ height: RFValue(42) }}
              onPress={() => handleSocialLogin("Apple")}
            >
              <AppleIcon width={RFValue(20)} height={RFValue(20)} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Link đăng ký */}
        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text
            className="text-center font-inter text-gray-600 -mt-10"
            style={{ fontSize: RFPercentage(1.8) }}
          >
            Bạn chưa có tài khoản?{" "}
            <Text className="text-[#3F72AF] font-semibold">Đăng ký ngay!</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
