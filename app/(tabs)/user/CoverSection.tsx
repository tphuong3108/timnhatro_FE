import React from "react";
import { View, Image, TouchableOpacity, Text, Dimensions, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function CoverSection({ user }: any) {
  const screenWidth = Dimensions.get("window").width;
  const coverHeight = screenWidth * 0.45;
  const router = useRouter();

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Quyền bị từ chối", "Vui lòng cấp quyền truy cập camera.");
        return;
      }

      // Mở camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        Alert.alert("Ảnh mới", `Đã chọn: ${uri}`);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể mở camera.");
    }
  };

  return (
    <View className="w-full mb-10">
      <View
        style={{ height: coverHeight }}
        className="w-full bg-[#E8EEF5] justify-end items-end px-4 pb-4"
      />

      <View className="items-center -mt-14">
        <View className="relative">
          <Image
            source={
              user?.avatar
                ? { uri: user.avatar }
                : require("@/assets/images/user.png")
            }
            style={{
              width: 80,
              height: 80,
            }}
            className="rounded-full border-4 border-white shadow-md"
            resizeMode="cover"
          />

          {/* Nút camera */}
          <TouchableOpacity
            onPress={handlePickImage}
            activeOpacity={0.8}
            className="absolute bottom-0 right-0 bg-[#3F72AF] p-[6px] rounded-full border-2 border-white"
          >
            <Ionicons name="camera-outline" size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        <View className="w-full flex-row items-center justify-center mt-4">
          <Text className="text-lg font-bold text-gray-800 text-center ml-12 ">
            {user?.fullName || "Nguyễn Văn A"}
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/auth/edit-profile" as any)}
            activeOpacity={0.8}
            className="ml-2 bg-[#E8F1FB] px-2 py-[2px] rounded-lg flex-row items-center"
          >
            <Ionicons name="create-outline" size={16} color="#3F72AF" />
            <Text className="text-[#3F72AF] text-[13px] ml-1 font-medium">
              Sửa
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-gray-500 text-sm mt-1">
          {user?.role || "Người dùng"}
        </Text>
      </View>
    </View>
  );
}
