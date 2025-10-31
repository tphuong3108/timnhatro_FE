import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

interface MapPickerProps {
  marker?: { latitude: number; longitude: number };
  handleMapPress: (event: any) => void;
  getCurrentLocation: () => void;
  loadingLocation: boolean;
}

export default function MapPicker({
  marker,
  handleMapPress,
  getCurrentLocation,
  loadingLocation,
}: MapPickerProps) {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (marker && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: marker.latitude,
        longitude: marker.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [marker]);

  return (
    <View className="mb-5">
      <Text className="text-[#3F72AF] font-semibold mb-2">Chọn vị trí trên bản đồ</Text>

      <View className="h-64 w-full rounded-xl overflow-hidden border border-gray-300">
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          onPress={handleMapPress}
          initialRegion={{
            latitude: marker?.latitude || 10.762622,
            longitude: marker?.longitude || 106.660172,
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
        activeOpacity={0.8}
        className="flex-row items-center justify-center mt-4 bg-[#B9D7EA] py-3 rounded-xl w-[90%] self-center"
      >
        {loadingLocation ? (
          <ActivityIndicator color="#3F72AF" />
        ) : (
          <>
            <Ionicons name="locate-outline" size={20} color="#3F72AF" />
            <Text className="text-[#3F72AF] ml-2 font-bold">Dùng vị trí hiện tại</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
