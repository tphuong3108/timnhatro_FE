import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AddRoom() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!roomName || !price || !location) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin phòng!");
      return;
    }
    Alert.alert("Thành công", "Phòng của bạn đã được đăng!");
    router.push("/home");
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-gray-700 font-semibold mb-1">Tên phòng</Text>
        <TextInput
          value={roomName}
          onChangeText={setRoomName}
          placeholder="VD: Phòng trọ sinh viên gần ĐH Bách Khoa"
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-[14px]"
        />

        <Text className="text-gray-700 font-semibold mb-1">Giá thuê (VNĐ/tháng)</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholder="VD: 2.500.000"
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-[14px]"
        />

        <Text className="text-gray-700 font-semibold mb-1">Địa chỉ</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="VD: 25 Lý Thường Kiệt, Q.10, TP.HCM"
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-[14px]"
        />

        <Text className="text-gray-700 font-semibold mb-1">Mô tả chi tiết</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Thêm mô tả về tiện nghi, diện tích, nội thất..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="border border-gray-300 rounded-xl px-4 py-3 mb-6 text-[14px]"
        />

        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.8}
          className="bg-[#3F72AF] rounded-2xl py-4 mb-10"
        >
          <Text className="text-white font-semibold text-center text-[16px]">
            Đăng phòng ngay
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
