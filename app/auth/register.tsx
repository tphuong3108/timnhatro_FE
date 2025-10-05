import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AppleIcon from "../../assets/images/apple.svg";
import FacebookIcon from "../../assets/images/facebook.svg";
import GoogleIcon from "../../assets/images/google.svg";

export default function Register() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "space-between",
            paddingHorizontal: 24,
            paddingBottom: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* --- Header --- */}
          <View className="items-center mt-8 mb-4">
            <Text
              className="font-bold text-[#3F72AF]"
              style={{ fontSize: RFPercentage(3.2) }}
            >
              ĐĂNG KÝ
            </Text>
            <Text
              className="text-gray-500 text-center"
              style={{
                fontSize: RFPercentage(2),
                marginTop: RFValue(6),
                marginBottom: RFValue(16),
              }}
            >
              Hãy bắt đầu tạo tài khoản cho bản thân
            </Text>
          </View>

          {/* --- Form --- */}
          <View>
            <TextInput
              label="Họ"
              mode="outlined"
              style={{
                marginBottom: RFValue(12),
                backgroundColor: "white",
                fontSize: RFValue(14),
              }}
            />
            <TextInput
              label="Tên"
              mode="outlined"
              style={{
                marginBottom: RFValue(12),
                backgroundColor: "white",
                fontSize: RFValue(14),
              }}
            />
            <TextInput
              label="Email"
              mode="outlined"
              keyboardType="email-address"
              style={{
                marginBottom: RFValue(12),
                backgroundColor: "white",
                fontSize: RFValue(14),
              }}
            />
            <TextInput
              label="Số điện thoại"
              mode="outlined"
              keyboardType="phone-pad"
              style={{
                marginBottom: RFValue(12),
                backgroundColor: "white",
                fontSize: RFValue(14),
              }}
            />

            <TextInput
              label="Mật khẩu"
              mode="outlined"
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
                marginBottom: RFValue(12),
                backgroundColor: "white",
                fontSize: RFValue(14),
              }}
            />

            <TextInput
              label="Xác thực mật khẩu"
              mode="outlined"
              secureTextEntry={!confirmPasswordVisible}
              right={
                <TextInput.Icon
                  icon={() => (
                    <Ionicons
                      name={
                        confirmPasswordVisible
                          ? "eye-outline"
                          : "eye-off-outline"
                      }
                      size={RFValue(18)}
                      color="gray"
                    />
                  )}
                  onPress={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                />
              }
              style={{
                marginBottom: RFValue(16),
                backgroundColor: "white",
                fontSize: RFValue(14),
              }}
            />

            <TouchableOpacity
              onPress={() => setRemember(!remember)}
              className="flex-row items-center mb-5"
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
                  <Ionicons
                    name="checkmark"
                    size={RFValue(12)}
                    color="#3F72AF"
                  />
                )}
              </View>
              <Text
                className="text-gray-600"
                style={{ fontSize: RFPercentage(1.8) }}
              >
                Tôi đã đọc các điều khoản và điều kiện
              </Text>
            </TouchableOpacity>

            {/* --- Đăng ký --- */}
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
                ĐĂNG KÝ
              </Text>
            </TouchableOpacity>

            {/* --- Link đăng nhập --- */}
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text
                className="text-center text-gray-600"
                style={{
                  fontSize: RFPercentage(1.8),
                  marginBottom: RFValue(20),
                }}
              >
                Bạn đã có tài khoản?{" "}
                <Text className="text-[#3F72AF] font-semibold">
                  Đăng nhập ngay
                </Text>
              </Text>
            </TouchableOpacity>

            {/* --- Chia cách --- */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text
                className="text-gray-500 mx-4"
                style={{ fontSize: RFPercentage(1.8) }}
              >
                Hoặc đăng ký bằng
              </Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* --- Nút mạng xã hội --- */}
            <View className="flex-row justify-between px-6 gap-6 mb-6">
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
