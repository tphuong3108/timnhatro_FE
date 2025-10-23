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
  Alert,
  ActivityIndicator,
} from "react-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import AppleIcon from "../../assets/images/apple.svg";
import FacebookIcon from "../../assets/images/facebook.svg";
import GoogleIcon from "../../assets/images/google.svg";
import apiClient from "../../utils/apiClient";
import InputField from "../../components/InputField";

export default function Register() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateFields = () => {
    if (!firstName || !lastName || !email || !phone || !password) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường bắt buộc!");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Mật khẩu không khớp", "Vui lòng kiểm tra lại mật khẩu!");
      return false;
    }
    if (!agree) {
      Alert.alert("Chú ý", "Bạn cần đồng ý với điều khoản trước khi đăng ký.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);
      await apiClient.post("/users/register", {
        firstName,
        lastName,
        phone,
        password,
        confirmPassword,
        email,
      });

      Alert.alert("🎉 OTP đã được gửi!", "Vui lòng kiểm tra email để lấy mã OTP.", [
        {
          text: "OK",
          onPress: () => {
            const query = new URLSearchParams({
              firstName,
              lastName,
              phone,
              password,
              email,
            }).toString();
            router.push(`/auth/otp-verify?${query}`);
          },
        },
      ]);
    } catch (error: any) {
      console.log("Register error:", error.response?.data || error.message);
      Alert.alert(
        "Lỗi gửi OTP",
        error.response?.data?.message || "Không thể gửi mã OTP. Thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    Alert.alert("Tính năng đang phát triển", `Đăng ký bằng ${provider} sắp ra mắt! 🚀`);
  };

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
          {/* Tiêu đề */}
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

          {/* Form */}
          <View>
            <InputField label="Họ" value={firstName} onChangeText={setFirstName} />
            <InputField label="Tên" value={lastName} onChangeText={setLastName} />
            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <InputField
              label="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <InputField
              label="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              right={
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <Ionicons
                    name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                    size={RFValue(20)}
                    color="gray"
                  />
                </TouchableOpacity>
              }
            />

            <InputField
              label="Xác thực mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!confirmPasswordVisible}
              right={
                <TouchableOpacity
                  onPress={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                >
                  <Ionicons
                    name={confirmPasswordVisible ? "eye-outline" : "eye-off-outline"}
                    size={RFValue(20)}
                    color="gray"
                  />
                </TouchableOpacity>
              }
            />

            {/* Checkbox điều khoản */}
            <TouchableOpacity
              onPress={() => setAgree(!agree)}
              className="flex-row items-center mb-5"
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
                {agree && (
                  <Ionicons name="checkmark" size={RFValue(12)} color="#3F72AF" />
                )}
              </View>
              <Text
                className="text-gray-600"
                style={{ fontSize: RFPercentage(1.8) }}
              >
                Tôi đã đọc các điều khoản và điều kiện
              </Text>
            </TouchableOpacity>

            {/* Nút đăng ký */}
            <TouchableOpacity
              className="bg-[#3F72AF] rounded-full"
              style={{
                paddingVertical: RFValue(12),
                marginBottom: RFValue(20),
              }}
              onPress={handleRegister}
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
                  ĐĂNG KÝ
                </Text>
              )}
            </TouchableOpacity>

            {/* Link đăng nhập */}
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

            {/* Divider */}
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

            {/* Mạng xã hội */}
            <View className="flex-row justify-between px-6 gap-6 mb-6">
              <TouchableOpacity
                className="flex-1 border border-[#3F72AF] rounded-lg items-center justify-center"
                style={{ height: RFValue(42) }}
                onPress={() => handleSocialRegister("Facebook")}
              >
                <FacebookIcon width={RFValue(20)} height={RFValue(20)} />
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 border border-[#3F72AF] rounded-lg items-center justify-center"
                style={{ height: RFValue(42) }}
                onPress={() => handleSocialRegister("Google")}
              >
                <GoogleIcon width={RFValue(20)} height={RFValue(20)} />
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 border border-[#3F72AF] rounded-lg items-center justify-center"
                style={{ height: RFValue(42) }}
                onPress={() => handleSocialRegister("Apple")}
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
