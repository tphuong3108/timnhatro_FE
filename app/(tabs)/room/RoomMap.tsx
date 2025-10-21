import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { View, Animated, Text, StyleSheet, Image } from "react-native";
import MapView, { Marker, UrlTile, PROVIDER_DEFAULT } from "react-native-maps";

export function RoomMap({
  mapRef,
  rooms,
  markersAnim,
  selectedRoom,
  scrollToCard,
  setIsMapReady,
}: any) {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={StyleSheet.absoluteFillObject}
        onMapReady={() => setIsMapReady(true)}
        initialRegion={{
          latitude: 11.94,
          longitude: 108.45,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        pitchEnabled
        zoomEnabled
        scrollEnabled
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          zIndex={-1}
        />

        {rooms.map((room: any, i: number) => {
          const scale = markersAnim[i].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.4],
          });
          const opacity = markersAnim[i].interpolate({
            inputRange: [0, 1],
            outputRange: [0.7, 1],
          });

          return (
            <Marker
              key={room._id}
              coordinate={{
                latitude: room.latitude,
                longitude: room.longitude,
              }}
              onPress={() => scrollToCard(room._id)}
            >
              <Animated.View
                style={{
                  transform: [{ scale }],
                  opacity,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
              <FontAwesome5 name="map-marker-alt" size={24} color="red" />
                <View
                  className={`absolute -bottom-5 bg-white px-2 py-[2px] rounded-full border border-gray-200 shadow-sm w-[70px] ${
                    selectedRoom === room._id ? "bg-[#DBE2EF]" : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-[12px] font-semibold ${
                      selectedRoom === room._id
                        ? "text-[#112D4E]"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    {room.price.toLocaleString("vi-VN")}
                  </Text>
                </View>
              </Animated.View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}
