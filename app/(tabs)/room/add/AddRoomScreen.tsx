import React from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AddRoomForm from "./AddRoomForm";
import MapPicker from "./MapPicker";
import MediaPicker from "./MediaPicker";
import AmenitiesList from "./AmenitiesList";
import { useAddRoomLogic } from "./AddRoomLogic";

export default function AddRoomScreen() {
  const logic = useAddRoomLogic();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1 px-5 pt-2"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <Text className="text-2xl font-semibold text-[#3F72AF] text-center mb-4">
          Đăng phòng
        </Text>

        <AddRoomForm
          roomName={logic.roomName}
          setRoomName={logic.setRoomName}
          price={logic.price}
          setPrice={logic.setPrice}
          location={logic.location}
          setLocation={logic.setLocation}
          marker={logic.marker}
          setMarker={logic.setMarker}
          description={logic.description}
          setDescription={logic.setDescription}
        />

        <MapPicker
          marker={logic.marker}
          handleMapPress={logic.handleMapPress}
          getCurrentLocation={logic.getCurrentLocation}
          loadingLocation={logic.loadingLocation}
        />

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
          onPress={logic.handleSubmit}
          activeOpacity={0.8}
          className="bg-[#3F72AF] rounded-2xl py-4 mt-8 mb-10 self-center w-[90%]"
          disabled={logic.loadingSubmit}
        >
          {logic.loadingSubmit ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View className="flex-row items-center justify-center">
              <Ionicons name="cloud-upload-outline" size={20} color="white" />
              <Text className="text-white font-semibold text-center text-[16px] ml-2">
                Đăng phòng ngay
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
