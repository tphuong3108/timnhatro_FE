import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AddRoomForm from "./AddRoomForm";
import MapPicker from "./MapPicker";
import MediaPicker from "./MediaPicker";
import AmenitiesList from "./AmenitiesList";
import { useAddRoomLogic } from "./AddRoomLogic";
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
    handleSubmit,
    loadingSubmit,
    selectedWard,
    setSelectedWard,
    wards,
  } = useAddRoomLogic();

  return (
    <View className="flex-1 bg-white">
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
        <AddRoomForm
          roomName={roomName}
          setRoomName={setRoomName}
          price={price}
          setPrice={setPrice}
          location={location}
          setLocation={setLocation}
          description={description}
          setDescription={setDescription}
          marker={marker}
          setMarker={setMarker} 
           selectedWard={selectedWard}
            setSelectedWard={setSelectedWard}
            wards={wards} 
        />

        <MapPicker
          marker={marker}
          handleMapPress={handleMapPress}
          getCurrentLocation={getCurrentLocation}
          loadingLocation={loadingLocation}
        />

        <MediaPicker
          media={media}
          pickMedia={pickMedia}
          removeMedia={removeMedia}
        />

        <Text className="text-[#3F72AF] font-semibold mb-2">Tiện nghi</Text>
        <AmenitiesList
          selectedAmenities={selectedAmenities}
          setSelectedAmenities={setSelectedAmenities}
        />
        
        <TouchableOpacity
          onPress={() => {
            console.log("🖱️ Bấm nút đăng phòng");
            handleSubmit();
          }}
          disabled={loadingSubmit}
          activeOpacity={0.8}
          className={`rounded-2xl py-4 mt-8 mb-10 self-center w-[90%] ${
            loadingSubmit ? "bg-gray-400" : "bg-[#3F72AF]"
          }`}
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="cloud-upload-outline" size={20} color="white" />
            <Text className="text-white font-semibold text-center text-[16px] ml-2">
              {loadingSubmit ? "Đang đăng..." : "Đăng phòng ngay"}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
