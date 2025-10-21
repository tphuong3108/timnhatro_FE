import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AddRoomForm from "./AddRoomForm";
import MapPicker from "./MapPicker";
import MediaPicker from "./MediaPicker";
import AmenitiesList from "./AmenitiesList";
import useAddRoom from "./addRoom";
import { useRouter } from "expo-router";

export default function AddRoomIndex() {
  const router = useRouter();
  const {
    roomName,
    setRoomName,
    price,
    setPrice,
    location,
    setLocation,
    description,
    setDescription,
    marker,
    setMarker,
    media,
    pickMedia,
    removeMedia,
    selectedAmenities,
    setSelectedAmenities,
    handleMapPress,
    getCurrentLocation,
    loadingLocation,
  } = useAddRoom();

  const handleSubmit = () => {
    if (!roomName || !price || !location || !marker) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin và chọn vị trí!");
      return;
    }

    const newRoom = {
      name: roomName,
      price,
      location,
      description,
      amenities: selectedAmenities,
      media,
      coordinates: marker,
    };

    console.log(" Dữ liệu đăng phòng:", newRoom);

    Alert.alert("Thành công", "Phòng của bạn đã được đăng!", [
      { text: "OK", onPress: () => router.replace("/") },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Tiêu đề */}
      <View className="py-4">
        <Text className="text-2xl font-semibold text-[#3F72AF] text-center">
          Đăng phòng
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-2"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        {/* Form thông tin */}
        <AddRoomForm
          roomName={roomName}
          setRoomName={setRoomName}
          price={price}
          setPrice={setPrice}
          location={location}
          setLocation={setLocation}
          description={description}
          setDescription={setDescription}
        />

        {/* Bản đồ chọn vị trí */}
        <MapPicker
          marker={marker}
          handleMapPress={handleMapPress}
          getCurrentLocation={getCurrentLocation}
          loadingLocation={loadingLocation}
        />

        {/* Hình ảnh */}
        <MediaPicker
          media={media}
          pickMedia={pickMedia}
          removeMedia={removeMedia}
        />

        {/* Tiện nghi */}
        <Text className="text-[#3F72AF] font-semibold mb-2">Tiện nghi</Text>
        <AmenitiesList
          selectedAmenities={selectedAmenities}
          setSelectedAmenities={setSelectedAmenities}
        />

        {/* Nút Đăng phòng */}
        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.8}
          className="bg-[#3F72AF] rounded-2xl py-4 mt-8 mb-10 self-center w-[90%]"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="cloud-upload-outline" size={20} color="white" />
            <Text className="text-white font-semibold text-center text-[16px] ml-2">
              Đăng phòng ngay
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
