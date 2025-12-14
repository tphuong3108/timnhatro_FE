import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import Logo from "../../assets/images/logodoc.svg";
import InputField from "../../components/InputField";
import apiClient from "@/services/apiClient";

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export default function EditProfile() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState<"fetch" | "save" | null>("fetch");

  // ✅ Lấy email từ token (chỉ khi cần)
  const loadFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded?.email) setEmail(decoded.email);
    } catch (error) {
    }
  };
  const fetchProfile = async () => {
    try {
      const res = await apiClient.get("/me");
      const data = res.data?.data;

      if (!data) throw new Error("Không có dữ liệu người dùng");

      // ✅ Nếu có fullName, tách ra họ & tên
      if (data.fullName) {
        const parts = data.fullName.trim().split(" ");
        const last = parts.pop() || "";
        const first = parts.join(" ");
        setFirstName(first);
        setLastName(last);
      }

      setEmail(data.email || "");
      setPhone(data.phone || "");
      setBio(data.bio || "");
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể tải thông tin người dùng.");
    } finally {
      setLoading(null);
    }
  };

  // ✅ Đảm bảo token load xong rồi mới lấy profile
  useEffect(() => {
    (async () => {
      await loadFromToken();
      await new Promise((r) => setTimeout(r, 100)); // tránh đè state
      await fetchProfile();
    })();
  }, []);

  // ✅ Cập nhật thông tin
  const handleSave = async () => {
    if (!firstName || !lastName || !email || !phone) {
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường bắt buộc!");
    }

    try {
      setLoading("save");
      await apiClient.patch("/me", {
        firstName,
        lastName,
        email,
        phone,
        bio,
      });
      Alert.alert("🎉 Thành công", "Cập nhật thông tin thành công!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin.");
    } finally {
      setLoading(null);
    }
  };

  // ✅ Hiển thị khi đang load
  if (loading === "fetch")
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text className="text-gray-500 mt-3">Đang tải hồ sơ...</Text>
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 bg-white px-6 pt-12 pb-10">
          <View className="items-center mb-2">
            <Logo width={200} height={200} />
          </View>

          <Text className="text-4xl font-bold text-[#3F72AF] text-center mb-1">
            CHỈNH SỬA HỒ SƠ
          </Text>
          <Text className="text-gray-500 text-[16px] text-center mb-8">
            Cập nhật thông tin cá nhân của bạn
          </Text>

          {/* Họ */}
          <InputField label="Họ" value={firstName} onChangeText={setFirstName} />

          {/* Tên */}
          <InputField label="Tên" value={lastName} onChangeText={setLastName} />

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

          {/* Mật khẩu (ẩn) */}
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
