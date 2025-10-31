import React from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import useEditRoomLogic from "./EditRoomLogic";
import EditRoomForm from "./EditRoomForm";

export default function EditRoomScreen() {
  const { id } = useLocalSearchParams();
  const roomId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : "";
  const router = useRouter();

  const {
    roomData,
    setRoomData,
    loading,
    error,
    handleUpdateRoom,
  } = useEditRoomLogic(roomId);

  console.log("🟢 EditRoomScreen nhận roomId:", roomId);

  const handleSubmit = async () => {
    if (!roomData) {
      Alert.alert("⚠️ Lỗi", "Không có dữ liệu phòng để cập nhật.");
      return;
    }

    console.log("📤 Gửi yêu cầu cập nhật phòng...");
    const result = await handleUpdateRoom(roomData);

    if (result.success) {
      Alert.alert("🎉 Thành công", "Phòng đã được cập nhật thành công!", [
        {
          text: "OK",
          onPress: () => router.push("/user/MyPosts"),
        },
      ]);
    } else {
      Alert.alert("❌ Lỗi", "Không thể cập nhật phòng, vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text className="mt-3 text-gray-600">Đang tải dữ liệu phòng...</Text>
      </View>
    );
  }

  if (error || !roomData) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-lg font-semibold text-red-500 mb-3">
          ⚠️ Lỗi tải dữ liệu
        </Text>
        <Text className="text-gray-600 text-center">{error || "Không có dữ liệu phòng."}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <EditRoomForm
        roomData={roomData}
        setRoomData={setRoomData}
        onSubmit={handleSubmit}
      />
    </View>
  );
}
