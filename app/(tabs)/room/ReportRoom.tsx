import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import MediaPicker from "./add/MediaPicker";
import { roomApi } from "@/services/roomApi";

export default function ReportRoom() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reportText, setReportText] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const pickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Thông báo", "Bạn cần cấp quyền truy cập ảnh/video.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setMedia((prev) => [...prev, ...uris]);
    }
  };

  // 🗑️ Xóa media
  const removeMedia = (uri: string) => {
    setMedia((prev) => prev.filter((item) => item !== uri));
  };

  // 🚀 Gửi báo cáo
  const handleSend = async () => {
    if (!reportText.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập nội dung báo cáo.");
      return;
    }

    try {
      setLoading(true);
      await roomApi.reportRoom(id, reportText.trim());
      Alert.alert("🎉 Thành công", "Báo cáo của bạn đã được gửi!", [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/home"),
        },
      ]);
      setReportText("");
      setMedia([]);
    } catch (err: any) {
      console.log("❌ Lỗi gửi báo cáo:", err.response?.data || err.message);
      Alert.alert(
        "Lỗi",
        err.response?.data?.message ||
          "Không thể gửi báo cáo, vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-5 py-6">
      <Text className="text-2xl font-bold mb-2 text-[#3F72AF] text-center py-5">
        Báo cáo phòng
      </Text>

      <Text className="text-gray-600 mb-4 leading-5">
        Nếu bạn phát hiện phòng có dấu hiệu lừa đảo, sai thông tin hoặc hành vi
        vi phạm — hãy mô tả chi tiết bên dưới và đính kèm hình ảnh hoặc video
        minh chứng (nếu có) để giúp chúng tôi xác minh nhanh hơn.
      </Text>

      {/* Nội dung báo cáo */}
      <TextInput
        placeholder="Nhập nội dung báo cáo..."
        multiline
        numberOfLines={6}
        value={reportText}
        onChangeText={setReportText}
        className="bg-gray-100 rounded-lg p-4 text-[14px] text-gray-700"
      />

      {/* Ảnh / Video */}
      <View className="mb-7 mt-5">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm text-gray-500">{media.length} mục</Text>
        </View>

        <MediaPicker
          media={media}
          pickMedia={pickMedia}
          removeMedia={removeMedia}
        />
      </View>

      {/* Gửi báo cáo */}
      <TouchableOpacity
        onPress={handleSend}
        disabled={loading}
        className={`mt-8 rounded-lg py-3 flex-row justify-center items-center ${
          loading ? "bg-gray-400" : "bg-[#f57575]"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="alert-circle-outline" size={20} color="#fff" />
            <Text className="ml-2 text-white font-semibold text-base">
              Gửi báo cáo
            </Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
