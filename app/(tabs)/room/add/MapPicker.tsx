import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function MapPicker({
  marker,
  handleMapPress,
  getCurrentLocation,
  loadingLocation,
}: any) {
  return (
    <View className="mb-5">
      <Text className="text-[#3F72AF] font-semibold mb-2">Chọn vị trí trên bản đồ</Text>
      <View className="h-64 w-full rounded-xl overflow-hidden border border-gray-300">
        <MapView
          style={{ flex: 1 }}
          onPress={handleMapPress}
          initialRegion={{
            latitude: marker?.latitude || 11.94,
            longitude: marker?.longitude || 108.45,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
          {marker && (
            <Marker coordinate={marker} title="Vị trí phòng">
              <FontAwesome5 name="map-marker-alt" size={28} color="red" />
            </Marker>
          )}
        </MapView>
      </View>

      {marker && (
        <Text className="text-gray-600 mt-2 text-center">
          📍 {marker.latitude.toFixed(5)}, {marker.longitude.toFixed(5)}
        </Text>
      )}

      <TouchableOpacity
        onPress={getCurrentLocation}
        className="flex-row items-center justify-center mt-4 bg-[#3F72AF] py-3 rounded-xl"
      >
        {loadingLocation ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="locate-outline" size={20} color="#fff" />
            <Text className="text-white ml-2 font-medium">Dùng vị trí hiện tại</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
