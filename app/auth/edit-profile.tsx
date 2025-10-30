import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../../assets/images/logodoc.svg";
import apiClient from "../../utils/apiClient";
import InputField from "../../components/InputField";

export default function EditProfile() {
  const router = useRouter();

  const [name, setName] = useState("Nguyễn Văn A");
  const [email, setEmail] = useState("nguyenvana@example.com");
  const [phone, setPhone] = useState("0987654321");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [bio, setBio] = useState("Tôi là sinh viên đang tìm nhà trọ gần trường.");
  const [loading, setLoading] = useState<"save" | null>(null);

  const handleSave = async () => {
    if (!name || !email || !phone) {
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường bắt buộc!");
    }

    try {
      setLoading("save");
      await apiClient.put("/users/update-profile", {
        fullName: name,
        email,
        phone,
        bio,
      });
      Alert.alert("🎉 Thành công", "Cập nhật thông tin thành công!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.log("Update profile error:", error.response?.data || error.message);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 bg-white px-6 pt-12 pb-10">
          {/* Logo */}
          <View className="items-center mb-2">
            <Logo width={200} height={200} />
          </View>

          <Text className="text-4xl font-bold text-[#3F72AF] text-center mb-1">
            CHỈNH SỬA HỒ SƠ
          </Text>
          <Text className="text-gray-500 text-[16px] text-center mb-8">
            Cập nhật thông tin cá nhân của bạn
          </Text>

          {/* Họ tên */}
          <InputField label="Họ và tên" value={name} onChangeText={setName} />

          {/* Email */}
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Số điện thoại */}
          <InputField
            label="Số điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          {/* Tiểu sử */}
          <InputField
            label="Tiểu sử"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={5}
          />

          {/* Mật khẩu */}
          <InputField
            label="Mật khẩu"
            value="**********"
            editable={false}
            secureTextEntry={!passwordVisible}
            right={
              <TextInput.Icon
                icon={() => (
                  <Ionicons
                    name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="gray"
                  />
                )}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
          />

          {/* Nút đổi mật khẩu */}
          <TouchableOpacity
            onPress={() => router.push("/auth/change-password")}
            className="self-end mb-6"
            activeOpacity={0.7}
          >
            <Text className="text-[#3F72AF] font-medium text-[14px] underline">
              Đổi mật khẩu
            </Text>
          </TouchableOpacity>

          {/* Nút lưu */}
          <TouchableOpacity
            className="bg-[#3F72AF] py-3 rounded-full"
            onPress={handleSave}
            disabled={loading === "save"}
            activeOpacity={0.8}
          >
            {loading === "save" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center text-xl font-semibold">
                LƯU THAY ĐỔI
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
