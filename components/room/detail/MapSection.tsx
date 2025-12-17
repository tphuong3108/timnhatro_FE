import React, { useRef, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import MapView, { Marker, UrlTile, Callout } from "react-native-maps";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function MapSection({ room, loadingLoc, openDirections }: any) {
  const markerRef = useRef<any>(null);
  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);

  // 🧭 Tự động focus vào marker khi map đã load
  useEffect(() => {
    if (mapReady && room) {
      const latitude =
        typeof room.latitude === "number"
          ? room.latitude
          : room.location?.coordinates?.[1];
      const longitude =
        typeof room.longitude === "number"
          ? room.longitude
          : room.location?.coordinates?.[0];

      if (latitude && longitude) {
        // Di chuyển bản đồ đến đúng vị trí phòng
        mapRef.current?.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          800
        );

        // Hiện popup callout
        const timer = setTimeout(() => {
          markerRef.current?.showCallout();
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [mapReady, room]);

  const handleMarkerPress = () => {
    markerRef.current?.showCallout();
  };

  if (!room) return null;

  const latitude =
    typeof room.latitude === "number"
      ? room.latitude
      : room.location?.coordinates?.[1];
  const longitude =
    typeof room.longitude === "number"
      ? room.longitude
      : room.location?.coordinates?.[0];

  return (
    <View className="px-5 py-5 border-t border-gray-200">
      <Text className="text-xl font-semibold text-[#3F72AF] mb-3">
        Vị trí trên bản đồ
      </Text>

      <View className="rounded-2xl overflow-hidden border border-gray-200 h-64">
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          showsUserLocation
          onMapReady={() => setMapReady(true)}
          initialRegion={{
            latitude: latitude || 10.762622,
            longitude: longitude || 106.660172,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <UrlTile
            urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
          />

          <Marker
            ref={markerRef}
            coordinate={{
              latitude: latitude || 10.762622,
              longitude: longitude || 106.660172,
            }}
            onPress={handleMarkerPress}
            centerOffset={{ x: 0, y: -20 }}
            tracksViewChanges={false}
          >
            <View className="items-center">
              <FontAwesome5 name="map-marker-alt" size={36} color="#E63946" />
            </View>

            <Callout tooltip>
              <View className="bg-white rounded-xl p-2 shadow-md border border-gray-200">
                <Text
                  className="text-[#112D4E] font-semibold w-[125px]"
                  numberOfLines={1}
                >
                  {room.name}
                </Text>
                <Text className="text-gray-600 text-xs mt-1" numberOfLines={1}>
                  {room.address}
                </Text>
              </View>
            </Callout>
          </Marker>
        </MapView>
      </View>

      <TouchableOpacity
        onPress={openDirections}
        className="flex-row justify-center items-center bg-[#3F72AF] mt-4 py-3 rounded-xl"
      >
        {loadingLoc ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="navigate-outline" size={20} color="#fff" />
            <Text className="ml-2 text-white font-semibold text-base">
              Chỉ đường tới đây
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
