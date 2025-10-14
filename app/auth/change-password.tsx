import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, SafeAreaView, ScrollView } from "react-native";
import { TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import Logo from "../../assets/images/logodoc.svg";
import { Ionicons } from "@expo/vector-icons";
import apiClient from "../../utils/apiClient";

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
      console.log("Change password error:", error.response?.data || error.message);
      Alert.alert("Lỗi", error.response?.data?.message || "Không thể đổi mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-white px-6 pt-12">
          <View className="items-center mb-4">
            <Logo width={260} height={260} />
          </View>

          <Text className="text-3xl font-inter text-center text-[#3F72AF] mb-2 font-bold">
            ĐỔI MẬT KHẨU
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Cập nhật mật khẩu để bảo vệ tài khoản của bạn
          </Text>

          <TextInput
            label="Mật khẩu hiện tại"
            mode="outlined"
            secureTextEntry={!showOld}
            value={oldPassword}
            onChangeText={setOldPassword}
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
            style={{ marginBottom: 16, backgroundColor: "white" }}
          />

          <TextInput
            label="Mật khẩu mới"
            mode="outlined"
            secureTextEntry={!showNew}
            value={newPassword}
            onChangeText={setNewPassword}
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
            style={{ marginBottom: 16, backgroundColor: "white" }}
          />

          <TextInput
            label="Xác nhận mật khẩu mới"
            mode="outlined"
            secureTextEntry={!showConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
            style={{ marginBottom: 24, backgroundColor: "white" }}
          />

          <TouchableOpacity
            className="bg-[#3F72AF] py-3 rounded-full"
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text className="text-white font-inter text-center text-lg">
              {loading ? "Đang xử lý..." : "XÁC NHẬN"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
