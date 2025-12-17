import { profileApi } from "@/services/profileApi";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function CoverSection({ user, isOwner = false, onAvatarUpdated }: any) {
  const screenWidth = Dimensions.get("window").width;
  const coverHeight = screenWidth * 0.4;
  const router = useRouter();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  // Upload ảnh lên server
  const uploadAvatar = async (uri: string) => {
    try {
      setUploading(true);
      setLocalAvatar(uri); // Hiển thị ảnh ngay lập tức
      
      
      const updatedUser = await profileApi.uploadAvatar(uri);
      
      
      Alert.alert("Thành công", "Đã cập nhật ảnh đại diện!");
      
      // Callback để refresh profile nếu cần
      if (onAvatarUpdated) {
        onAvatarUpdated(updatedUser);
      }
    } catch (error: any) {

      setLocalAvatar(null); // Rollback nếu lỗi
      Alert.alert("Lỗi", error.response?.data?.message || `Không thể cập nhật ảnh đại diện. ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

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
        await uploadAvatar(uri);
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
        await uploadAvatar(uri);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chọn ảnh từ thư viện.");
    }
  };

  const handlePickImage = () => {
    const hasAvatar = localAvatar || user?.avatar;
    
    if (Platform.OS === "ios") {
      const options = hasAvatar 
        ? ["Huỷ", "Xem ảnh đại diện", "Chụp ảnh mới", "Chọn từ thư viện"]
        : ["Huỷ", "Chụp ảnh mới", "Chọn từ thư viện"];
      
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (hasAvatar) {
            if (buttonIndex === 1) setPreviewVisible(true);
            else if (buttonIndex === 2) handleCameraPick();
            else if (buttonIndex === 3) handleLibraryPick();
          } else {
            if (buttonIndex === 1) handleCameraPick();
            else if (buttonIndex === 2) handleLibraryPick();
          }
        }
      );
    } else {
      const buttons = hasAvatar
        ? [
            { text: "Xem ảnh đại diện", onPress: () => setPreviewVisible(true) },
            { text: "Chụp ảnh mới", onPress: handleCameraPick },
            { text: "Chọn từ thư viện", onPress: handleLibraryPick },
            { text: "Huỷ", style: "cancel" as const },
          ]
        : [
            { text: "Chụp ảnh", onPress: handleCameraPick },
            { text: "Thư viện", onPress: handleLibraryPick },
            { text: "Huỷ", style: "cancel" as const },
          ];
      
      Alert.alert("Ảnh đại diện", "Bạn muốn làm gì?", buttons);
    }
  };

  // Xem ảnh full (khi nhấn vào avatar)
  const handleAvatarPress = () => {
    const hasAvatar = localAvatar || user?.avatar;
    if (hasAvatar && !uploading) {
      setPreviewVisible(true);
    } else if (isOwner && !uploading) {
      handlePickImage();
    }
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
            disabled={uploading || (!isOwner && !user?.avatar)}
          >
            <View>
              <Image
                source={
                  localAvatar
                    ? { uri: localAvatar }
                    : user?.avatar
                    ? { uri: user.avatar }
                    : require("@/assets/images/user.png")
                }
                style={{ width: 90, height: 90 }}
                className="rounded-full border-4 border-white shadow-md"
                resizeMode="cover"
              />
              {uploading && (
                <View 
                  className="absolute inset-0 bg-black/40 rounded-full items-center justify-center"
                  style={{ width: 90, height: 90 }}
                >
                  <ActivityIndicator color="#fff" size="small" />
                </View>
              )}
            </View>
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
            style={{ position: "absolute", top: 60, right: 20, zIndex: 10 }}
            onPress={() => setPreviewVisible(false)}
          >
            <Ionicons name="close-circle" size={34} color="#fff" />
          </Pressable>

          <Image
            source={{ uri: localAvatar || user?.avatar }}
            style={{
              width: "90%",
              height: "70%",
              borderRadius: 10,
            }}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
}
