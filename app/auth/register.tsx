import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import AppleIcon from "../../assets/images/apple.svg";
import FacebookIcon from "../../assets/images/facebook.svg";
import GoogleIcon from "../../assets/images/google.svg";

export default function Register() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-5 pt-10 pb-7"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-4xl font-bold text-[#3F72AF] text-center mb-2">
          ĐĂNG KÝ
        </Text>
        <Text className="text-base text-gray-500 text-center mb-5">
          Hãy bắt đầu tạo tài khoản cho bản thân
        </Text>

        <TextInput
          label="Họ"
          mode="outlined"
          className="mb-2 bg-white"
        />
        <TextInput
          label="Tên"
          mode="outlined"
          className="mb-2 bg-white"
        />
        <TextInput
          label="Email"
          mode="outlined"
          keyboardType="email-address"
          className="mb-2 bg-white"
        />
        <TextInput
          label="Số điện thoại"
          mode="outlined"
          keyboardType="phone-pad"
          className="mb-2 bg-white"
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
                  size={18}
                  color="gray"
                />
              )}
              onPress={() => setPasswordVisible(!passwordVisible)}
            />
          }
          className="mb-3 bg-white"
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
                    confirmPasswordVisible ? "eye-outline" : "eye-off-outline"
                  }
                  size={18}
                  color="gray"
                />
              )}
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            />
          }
          className="mb-4 bg-white"
        />

        <TouchableOpacity
          onPress={() => setRemember(!remember)}
          className="flex-row items-center mb-4"
        >
          <View className="w-[18px] h-[18px] border border-gray-400 rounded mr-2 items-center justify-center">
            {remember && (
              <Ionicons name="checkmark" size={12} color="#3F72AF" />
            )}
          </View>
          <Text className="text-sm text-gray-500">
            Tôi đã đọc các điều khoản và điều kiện
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-[#3F72AF] rounded-full py-3 mb-5"
          onPress={() => router.replace("/(tabs)")}
        >
          <Text className="text-white text-lg font-bold text-center">
            ĐĂNG KÝ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text className="text-center text-sm text-gray-500 mb-5">
            Bạn đã có tài khoản?{" "}
            <Text className="text-[#3F72AF] font-bold">Đăng nhập ngay</Text>
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center mb-5">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-2 text-sm text-gray-500">
            Hoặc đăng ký bằng
          </Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        <View className="flex-row justify-between space-x-2 mb-5">
          <TouchableOpacity className="flex-1 h-11 border border-[#3F72AF] rounded-lg items-center justify-center">
            <FacebookIcon width={20} height={20} />
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 h-11 border border-[#3F72AF] rounded-lg items-center justify-center">
            <GoogleIcon width={20} height={20} />
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 h-11 border border-[#3F72AF] rounded-lg items-center justify-center">
            <AppleIcon width={20} height={20} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
