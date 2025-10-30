import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  Alert,
  Modal,
  Pressable,
  Platform,
  ActionSheetIOS,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function CoverSection({ user, isOwner = false }: any) {
  const screenWidth = Dimensions.get("window").width;
  const coverHeight = screenWidth * 0.4;
  const router = useRouter();
  const [previewVisible, setPreviewVisible] = useState(false);

  // Mở camera
  const handleCameraPick = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Quyền bị từ chối", "Vui lòng cấp quyền truy cập camera.");
        return;
      }

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

  // Chọn ảnh từ thư viện
  const handleLibraryPick = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Quyền bị từ chối", "Vui lòng cấp quyền truy cập thư viện ảnh.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        Alert.alert("Ảnh đã chọn", `Đường dẫn: ${uri}`);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chọn ảnh từ thư viện.");
    }
  };

  // Menu chọn ảnh
  const handlePickImage = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Huỷ", "Chụp ảnh mới", "Chọn từ thư viện"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) handleCameraPick();
          else if (buttonIndex === 2) handleLibraryPick();
        }
      );
    } else {
      Alert.alert("Chọn ảnh", "Bạn muốn sử dụng nguồn nào?", [
        { text: "Chụp ảnh", onPress: handleCameraPick },
        { text: "Thư viện", onPress: handleLibraryPick },
        { text: "Huỷ", style: "cancel" },
      ]);
    }
  };

  // Xem ảnh full
  const handleAvatarPress = () => {
    if (user?.avatar) setPreviewVisible(true);
    else if (isOwner) handlePickImage();
  };

  return (
    <View className="w-full mb-4">
      {/* Banner */}
      <View
        style={{ height: coverHeight }}
        className="w-full bg-[#E8EEF5] justify-end items-end px-3 pb-3"
      />

      <View className="items-center -mt-14">
        <View className="relative">
          {/* Ảnh đại diện */}
          <TouchableOpacity
            onPress={handleAvatarPress}
            activeOpacity={0.9}
            disabled={!isOwner && !user?.avatar}
          >
            <Image
              source={
                user?.avatar
                  ? { uri: user.avatar }
                  : require("@/assets/images/user.png")
              }
              style={{ width: 90, height: 90 }}
              className="rounded-full border-4 border-white shadow-md"
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Nút camera — chỉ hiển thị khi là chính chủ */}
          {isOwner && (
            <TouchableOpacity
              onPress={handlePickImage}
              activeOpacity={0.8}
              className="absolute bottom-0 right-0 bg-[#3F72AF] p-[6px] rounded-full border-2 border-white"
            >
              <Ionicons name="camera-outline" size={14} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Thông tin người dùng */}
        <View className="w-full flex-row items-center justify-center mt-4">
          <Text
            className={`text-lg font-bold text-gray-800 text-center ${
              isOwner ? "ml-12" : ""
            }`}
          >
            {user?.fullName || "Nguyễn Văn A"}
          </Text>

          {isOwner && (
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
          )}
        </View>

        <Text className="text-gray-500 text-sm mt-1">
          {user?.bio || "Người dùng"}
        </Text>
      </View>

      {/* Xem ảnh đại diện */}
      <Modal visible={previewVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/90 justify-center items-center">
          <Pressable
            style={{ position: "absolute", top: 40, right: 20 }}
            onPress={() => setPreviewVisible(false)}
          >
            <Ionicons name="close-circle" size={34} color="#fff" />
          </Pressable>

          <Image
            source={{ uri: user?.avatar }}
            style={{
              width: "90%",
              height: "70%",
              borderRadius: 10,
              resizeMode: "contain",
            }}
          />
        </View>
      </Modal>
    </View>
  );
}
