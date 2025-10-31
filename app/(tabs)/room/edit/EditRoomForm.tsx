import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "@/services/apiClient";

export default function EditRoomForm({ initialData, roomId }: any) {
  const [name, setName] = useState(initialData.name);
  const [price, setPrice] = useState(initialData.price.toString());
  const [address, setAddress] = useState(initialData.address);
  const [description, setDescription] = useState(initialData.description);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${apiClient.defaults.baseURL}/hosts/rooms/${roomId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          address,
          description,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      Toast.show({ type: "success", text1: "Cập nhật phòng thành công!" });
      router.push("/(tabs)/user"); // quay lại danh sách
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể cập nhật phòng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-5">
      <Text className="text-lg font-semibold mb-2 text-gray-700">Tên phòng</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-3 py-2 mb-4"
        value={name}
        onChangeText={setName}
        placeholder="Nhập tên phòng"
      />

      <Text className="text-lg font-semibold mb-2 text-gray-700">Giá (VNĐ)</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-3 py-2 mb-4"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
        placeholder="Nhập giá"
      />

      <Text className="text-lg font-semibold mb-2 text-gray-700">Địa chỉ</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-3 py-2 mb-4"
        value={address}
        onChangeText={setAddress}
        placeholder="Nhập địa chỉ"
      />

      <Text className="text-lg font-semibold mb-2 text-gray-700">Mô tả</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-3 py-2 mb-4"
        value={description}
        onChangeText={setDescription}
        placeholder="Nhập mô tả"
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className="bg-[#3F72AF] py-3 rounded-2xl mt-2"
      >
        <Text className="text-center text-white font-semibold text-lg">
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
