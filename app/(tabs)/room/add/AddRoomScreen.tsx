import { useRouter } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AddRoomForm from "./AddRoomForm";
import { useAddRoomLogic } from "./AddRoomLogic";
import MapPicker from "./MapPicker";
import MediaPicker from "./MediaPicker";
import AmenitiesList from "./AmenitiesList";

export default function AddRoomScreen() {
  const router = useRouter();
  const logic = useAddRoomLogic();

  const handleSubmit = () => {
    const {
      roomName,
      price,
      location,
      description,
      marker,
      media,
      selectedAmenities,
    } = logic;

    if (!roomName || !price || !location || !marker) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin và chọn vị trí!");
      return;
    }

    const newRoom = {
      roomName,
      price,
      location,
      description,
      amenities: selectedAmenities,
      media,
      marker,
    };

    console.log(" Dữ liệu đăng phòng:", newRoom);

    Alert.alert("Thành công", "Phòng của bạn đã được đăng!", [
      { text: "OK", onPress: () => router.replace("/") },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="py-4">
        <Text className="text-2xl font-semibold text-[#3F72AF] text-center">
          Đăng phòng
        </Text>
      </View>

      <ScrollView
        className="px-5 pt-2"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <AddRoomForm {...logic} />
        <MapPicker {...logic} />
        <MediaPicker
          media={logic.media}
          pickMedia={logic.pickMedia}
          removeMedia={logic.removeMedia}
        />

        <Text className="text-[#3F72AF] font-semibold mb-2">Tiện nghi</Text>
        <AmenitiesList
          selectedAmenities={logic.selectedAmenities}
          setSelectedAmenities={logic.setSelectedAmenities}
        />

        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.8}
          className="bg-[#3F72AF] rounded-2xl py-4 mt-8 mb-10 self-center w-[90%]"
        >
          <Text className="text-white font-semibold text-center text-[16px]">
            Đăng phòng ngay
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
