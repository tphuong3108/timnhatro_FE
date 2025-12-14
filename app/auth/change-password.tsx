import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import Logo from "../../assets/images/logodoc.svg";
import InputField from "../../components/InputField";
import apiClient from "../../services/apiClient";

export default function ChangePassword() {
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return Alert.alert("Thiếu thông tin", "Vui lòng điền đầy đủ các trường bắt buộc!");
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
    }

    try {
      setLoading(true);
      await apiClient.put("/users/change-password", {
        currentPassword: oldPassword,
        newPassword,
      });
      Alert.alert("🎉 Thành công", "Đổi mật khẩu thành công!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.response?.data?.message || "Không thể đổi mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-white px-6 pt-12 pb-10">
          {/* Logo */}
          <View className="items-center mb-4">
            <Logo width={240} height={240} />
          </View>

          <Text className="text-3xl font-bold text-[#3F72AF] text-center mb-2">
            ĐỔI MẬT KHẨU
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Cập nhật mật khẩu để bảo vệ tài khoản của bạn
          </Text>

          {/* Mật khẩu hiện tại */}
          <InputField
            label="Mật khẩu hiện tại"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry={!showOld}
            right={
              <TextInput.Icon
                icon={() => (
                  <Ionicons
                    name={showOld ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="gray"
                  />
                )}
                onPress={() => setShowOld(!showOld)}
              />
            }
          />

          {/* Mật khẩu mới */}
          <InputField
            label="Mật khẩu mới"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNew}
            right={
              <TextInput.Icon
                icon={() => (
                  <Ionicons
                    name={showNew ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="gray"
                  />
                )}
                onPress={() => setShowNew(!showNew)}
              />
            }
          />

          {/* Xác nhận mật khẩu mới */}
          <InputField
            label="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
            right={
              <TextInput.Icon
                icon={() => (
                  <Ionicons
                    name={showConfirm ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="gray"
                  />
                )}
                onPress={() => setShowConfirm(!showConfirm)}
              />
            }
          />

          {/* Nút xác nhận */}
          <TouchableOpacity
            className="bg-[#3F72AF] py-3 rounded-full mt-4"
            onPress={handleChangePassword}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-center text-lg">
                XÁC NHẬN
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
