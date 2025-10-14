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
import Logo from "../../assets/images/logodoc.svg";
import apiClient from "../../utils/apiClient";

export default function EditProfile() {
  const router = useRouter();
  const [name, setName] = useState("Nguyễn Văn A");
  const [email, setEmail] = useState("nguyenvana@example.com");
  const [phone, setPhone] = useState("0987654321");
  const [loading, setLoading] = useState<"save" | null>(null);

  const handleSave = async () => {
    if (!name || !email || !phone) {
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường!");
    }

    try {
      setLoading("save");
      await apiClient.put("/users/update-profile", {
        fullName: name,
        email,
        phone,
      });
      Alert.alert("🎉 Thành công", "Cập nhật thông tin thành công!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-white px-6 pt-12">
          <View className="items-center mb-4">
            <Logo width={220} height={220} />
          </View>

          <View className="w-full items-center mb-2">
            <Text className="text-3xl font-bold text-[#3F72AF] text-center">
              CHỈNH SỬA HỒ SƠ
            </Text>
          </View>

          <Text className="text-gray-500 text-[14px] text-center mb-8">
            Cập nhật thông tin cá nhân của bạn
          </Text>

          <TextInput
            label="Họ và tên"
            mode="outlined"
            value={name}
            onChangeText={setName}
            style={{ marginBottom: 16, backgroundColor: "white" }}
          />

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={{ marginBottom: 16, backgroundColor: "white" }}
          />

          <TextInput
            label="Số điện thoại"
            mode="outlined"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={{ marginBottom: 10, backgroundColor: "white" }}
          />

          <TouchableOpacity
            onPress={() => router.push("/auth/change-password")}
            activeOpacity={0.7}
            className="self-end mb-6"
          >
            <Text className="text-[#3F72AF] font-medium text-[14px] underline">
              Đổi mật khẩu
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-[#3F72AF] py-3 rounded-full"
            onPress={handleSave}
            disabled={loading === "save"}
          >
            {loading === "save" ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center text-lg">
                LƯU THAY ĐỔI
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
