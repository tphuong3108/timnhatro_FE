import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import FacebookIcon from "../../assets/images/facebook.svg";
import GoogleIcon from "../../assets/images/google.svg";
import AppleIcon from "../../assets/images/apple.svg";
import Logo from "../../assets/images/logodoc.svg";


export default function Register() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
   <View className="flex-1 bg-white px-[20px] py-[150px]">
    <Text 
    style={{ fontSize: 40, fontFamily: "Roboto-Bold",fontWeight: "500", color: "#F4A261", textAlign: "center" }}
    >
    ĐĂNG KÝ
    </Text>

      <Text className="text-gray-500 text-center text-xl mb-8">
        Hãy bắt đầu tạo tài khoản cho bản thân
      </Text>

      <TextInput
        label="Họ và tên"
        mode="outlined"
        placeholder="Nhập họ và tên"
        style={{ marginBottom: 12, backgroundColor: "white" }}
      />
      <TextInput
        label="Email"
        mode="outlined"
        placeholder="Nhập email"
        keyboardType="email-address"
        style={{ marginBottom: 12, backgroundColor: "white" }}
      />
      <TextInput
        label="Số điện thoại"
        mode="outlined"
        placeholder="Nhập số điện thoại"
        keyboardType="phone-pad"
        style={{ marginBottom: 12, backgroundColor: "white" }}
      />

      <TextInput
        label="Mật khẩu"
        mode="outlined"
        placeholder="Nhập mật khẩu"
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
        style={{ marginBottom: 12, backgroundColor: "white" }}
      />
      <TextInput
        label="Xác thực mật khẩu"
        mode="outlined"
        placeholder="Nhập lại mật khẩu"
        secureTextEntry={!confirmPasswordVisible}
        right={
          <TextInput.Icon
            icon={() => (
              <Ionicons
                name={confirmPasswordVisible ? "eye-outline" : "eye-off-outline"}
                size={22}
                color="gray"
              />
            )}
            onPress={() =>
              setConfirmPasswordVisible(!confirmPasswordVisible)
            }
          />
        }
        style={{ marginBottom: 16, backgroundColor: "white" }}
      />

      <TouchableOpacity
        onPress={() => setRemember(!remember)}
        className="flex-row items-center mb-4"
        activeOpacity={0.8}
      >
        <View className="w-5 h-5 border border-gray-400 rounded mr-2 items-center justify-center">
          {remember && <Ionicons name="checkmark" size={16} color="#3F72AF" />}
        </View>
        <Text className="text-gray-600">
          Tôi đã đọc các điều khoản và điều kiện
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-[#3F72AF] py-3 rounded-full mb-6"
        onPress={() => router.replace("/(tabs)")}
      >
        <Text className="text-white font-bold text-center text-lg">
          ĐĂNG KÝ
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/login")}>
        <Text className="text-center text-gray-600 mb-6">
          Bạn đã có tài khoản?{" "}
          <Text className="text-[#3F72AF] font-semibold">Đăng nhập ngay</Text>
        </Text>
      </TouchableOpacity>

      <View className="flex-row items-center mb-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="text-gray-500 mx-4">Hoặc đăng ký bằng</Text>
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
    </View>
  );
}
