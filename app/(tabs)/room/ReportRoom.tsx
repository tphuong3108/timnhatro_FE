import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ReportRoom() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reportText, setReportText] = useState("");

  const handleSend = () => {
    if (!reportText.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập nội dung báo cáo.");
      return;
    }
    Alert.alert("Đã gửi", "Báo cáo của bạn đã được gửi thành công!");
    setReportText("");
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-white px-5 py-6">
      <Text className="text-2xl font-bold mb-2 text-[#3F72AF] text-center py-5">
        Báo cáo phòng #{id}
      </Text>
      <Text className="text-gray-600 mb-4">
        Nếu bạn phát hiện phòng có dấu hiệu lừa đảo, sai thông tin hoặc hành vi
        vi phạm — hãy mô tả chi tiết bên dưới.
      </Text>

      <TextInput
        placeholder="Nhập nội dung báo cáo..."
        multiline
        numberOfLines={6}
        value={reportText}
        onChangeText={setReportText}
        className="bg-gray-100 rounded-lg p-4 text-[14px] text-gray-700"
      />

      <TouchableOpacity
        onPress={handleSend}
        className="mt-5 bg-red-500 rounded-lg py-3 flex-row justify-center items-center"
      >
        <Ionicons name="alert-circle-outline" size={20} color="#fff" />
        <Text className="ml-2 text-white font-semibold text-base">
          Gửi báo cáo
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
