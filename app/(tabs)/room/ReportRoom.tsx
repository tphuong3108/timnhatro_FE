import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MediaPicker from "./add/MediaPicker";

export default function ReportRoom() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reportText, setReportText] = useState("");
  const [media, setMedia] = useState<string[]>([]);

  //  Chọn ảnh/video
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

  //  Xoá file
  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  //  Gửi báo cáo
  const handleSend = () => {
    if (!reportText.trim() && media.length === 0) {
      Alert.alert(
        "Thông báo",
        "Vui lòng nhập nội dung hoặc tải lên ảnh/video minh chứng."
      );
      return;
    }

    Alert.alert("Đã gửi", "Báo cáo của bạn đã được gửi thành công!");
    setReportText("");
    setMedia([]);
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-white px-5 py-6">
      <Text className="text-2xl font-bold mb-2 text-[#3F72AF] text-center py-5">
        Báo cáo phòng #{id}
      </Text>

      <Text className="text-gray-600 mb-4 leading-5">
        Nếu bạn phát hiện phòng có dấu hiệu lừa đảo, sai thông tin hoặc hành vi
        vi phạm — hãy mô tả chi tiết bên dưới và đính kèm hình ảnh hoặc video
        minh chứng (nếu có) để giúp chúng tôi xác minh nhanh hơn.
      </Text>

      {/* Nội dung */}
      <TextInput
        placeholder="Nhập nội dung báo cáo..."
        multiline
        numberOfLines={6}
        value={reportText}
        onChangeText={setReportText}
        className="bg-gray-100 rounded-lg p-4 text-[14px] text-gray-700"
      />

      {/* ảnh / video */}
      <View className="mb-7 mt-5">
        {/* Tiêu đề */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm text-gray-500">{media.length} mục</Text>
        </View>

        {/* Trình chọn media */}
        <MediaPicker
          media={media}
          pickMedia={pickMedia}
          removeMedia={removeMedia}
        />
      </View>

      {/* gửi báo cáo */}
      <TouchableOpacity
        onPress={handleSend}
        className="mt-8 bg-[#f57575] rounded-lg py-3 flex-row justify-center items-center"
      >
        <Ionicons name="alert-circle-outline" size={20} color="#fff" />
        <Text className="ml-2 text-white font-semibold text-base">
          Gửi báo cáo
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
