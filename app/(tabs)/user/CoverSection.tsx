import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { View, Image, TouchableOpacity, Alert, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { profileApi } from "@/services/profileApi";

export default function CoverSection({ user }: any) {
  const [uploading, setUploading] = useState(false);
  const [avatarUri, setAvatarUri] = useState(user?.avatar || "");

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);
      Alert.alert("Ảnh đã chọn", `Đường dẫn: ${uri}`);

      const formData = new FormData();
      formData.append("avatar", {
        uri,
        type: "image/jpeg",
        name: "avatar.jpg",
      } as any);

      try {
        setUploading(true);
        await profileApi.updateProfile(formData); // backend phải chấp nhận multipart
        Alert.alert("🎉 Thành công", "Ảnh đại diện đã được cập nhật!");
      } catch (error: any) {
        console.error("Upload avatar error:", error.response?.data || error);
        Alert.alert("Lỗi", "Không thể tải ảnh lên server.");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <View className="items-center mt-4">
      <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
        <Image
          source={
            avatarUri
              ? { uri: avatarUri }
              : require("@/assets/images/default-avatar.png")
          }
          className="w-28 h-28 rounded-full border-2 border-[#3F72AF]"
        />
        <View className="absolute bottom-1 right-2 bg-white rounded-full p-1.5 shadow">
          <Ionicons name="camera-outline" size={18} color="#3F72AF" />
        </View>
      </TouchableOpacity>

      <Text className="mt-3 text-2xl font-bold text-[#112D4E]">
        {user?.fullName}
      </Text>
      <Text className="text-gray-500 italic text-center">
        {user?.bio || "Chưa có tiểu sử"}
      </Text>

      {uploading && (
        <Text className="text-gray-400 mt-2">Đang tải ảnh lên...</Text>
      )}
    </View>
  );
}
