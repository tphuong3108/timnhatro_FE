import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import useEditRoomLogic from "./EditRoomLogic";
import EditRoomForm from "./EditRoomForm";
import MapPicker from "../add/MapPicker";
import MediaPicker from "../add/MediaPicker";
import EditAmenitiesList from "./EditAmenitiesList";

export default function EditRoomScreen() {
const { id  } = useLocalSearchParams();
const roomId =
  typeof id === "string" ? id : Array.isArray(id) ? id[0] : "";
  const router = useRouter();

  const {
    roomData,
    setRoomData,
    loading,
    error,
    handleUpdateRoom,
    setSelectedAmenities,
    selectedAmenities,
    pickMedia,
    removeMedia,
    handleMapPress,
    getCurrentLocation,
    loadingLocation,
  } = useEditRoomLogic(roomId);

  const handleSubmit = useCallback(async () => {
    const result = await handleUpdateRoom(roomData);
    if (result.success) {
      Alert.alert("🎉 Thành công", "Phòng đã được cập nhật!", [
        { text: "OK", onPress: () => router.push("/(tabs)/user") },
      ]);
    } else {
      Alert.alert("❌ Lỗi", "Không thể cập nhật phòng, vui lòng thử lại.");
    }
  }, [roomData, handleUpdateRoom, router]);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text className="mt-3 text-gray-600">Đang tải dữ liệu phòng...</Text>
      </View>
    );

  if (error || !roomData)
    return (
      <View className="flex-1 justify-center items-center bg-white px-5">
        <Text className="text-lg font-semibold text-red-500 mb-3">
          ⚠️ Lỗi tải dữ liệu
        </Text>
        <Text className="text-gray-600 text-center">
          {error || "Không có dữ liệu phòng."}
        </Text>
      </View>
    );

  return (
    <ScrollView
      className="flex-1 bg-white px-7 pt-2"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-2xl font-semibold text-[#3F72AF] text-center mb-4">
        Sửa phòng
      </Text>

      <EditRoomForm roomData={roomData} setRoomData={setRoomData} />

      <MediaPicker
        media={roomData.images || []}
        pickMedia={pickMedia}
        removeMedia={removeMedia}
      />

      <MapPicker
        marker={roomData.marker}
        handleMapPress={handleMapPress}
        getCurrentLocation={getCurrentLocation}
        loadingLocation={loadingLocation}
      />

      <EditAmenitiesList
        existingAmenities={roomData.amenities}
        selectedAmenities={selectedAmenities}
        setSelectedAmenities={setSelectedAmenities}
      />

      <TouchableOpacity
        onPress={handleSubmit}
        activeOpacity={0.8}
        className="bg-[#3F72AF] rounded-2xl py-4 mt-8 mb-10 self-center w-[90%]"
      >
        <View className="flex-row items-center justify-center">
          <Ionicons name="save-outline" size={20} color="white" />
          <Text className="text-white font-semibold text-center text-[16px] ml-2">
            Lưu thay đổi
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}
