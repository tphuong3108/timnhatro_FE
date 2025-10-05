import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { TextInput } from "react-native-paper";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AppleIcon from "../../assets/images/apple.svg";
import FacebookIcon from "../../assets/images/facebook.svg";
import GoogleIcon from "../../assets/images/google.svg";
import Logo from "../../assets/images/logodoc.svg";

export default function Login() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-between px-6 pb-4"
      >
        <View className="items-center mt-4">
          <Logo width={RFValue(165)} height={RFValue(165)} />
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
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={{
              marginBottom: RFValue(12),
              backgroundColor: "white",
              fontSize: RFValue(14),
            }}
          />

          <TextInput
            label="Mật khẩu"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            right={
              <TextInput.Icon
                icon={() => (
                  <Ionicons
                    name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                    size={RFValue(18)}
                    color="gray"
                  />
                )}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
            style={{
              marginBottom: RFValue(14),
              backgroundColor: "white",
              fontSize: RFValue(14),
            }}
          />

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

            <TouchableOpacity
              onPress={() => router.push("/auth/forgot-password")}
            >
              <Text
                className="text-blue-600"
                style={{ fontSize: RFPercentage(1.8) }}
              >
                Quên mật khẩu?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-[#3F72AF] rounded-full"
            style={{
              paddingVertical: RFValue(12),
              marginBottom: RFValue(20),
            }}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text
              className="text-white text-center font-medium"
              style={{ fontSize: RFPercentage(2.2) }}
            >
              ĐĂNG NHẬP
            </Text>
          </TouchableOpacity>

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

          <View className="flex-row justify-between px-6 gap-6 mb-10">
            <TouchableOpacity
              className="flex-1 border border-[#3F72AF] rounded-lg items-center justify-center"
              style={{ height: RFValue(42) }}
            >
              <FacebookIcon width={RFValue(20)} height={RFValue(20)} />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 border border-[#3F72AF] rounded-lg items-center justify-center"
              style={{ height: RFValue(42) }}
            >
              <GoogleIcon width={RFValue(20)} height={RFValue(20)} />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 border border-[#3F72AF] rounded-lg items-center justify-center"
              style={{ height: RFValue(42) }}
            >
              <AppleIcon width={RFValue(20)} height={RFValue(20)} />
            </TouchableOpacity>
          </View>
        </View>

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
