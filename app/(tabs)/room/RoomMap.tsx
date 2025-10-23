import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";

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

          const translateY = selectedRoom === room._id ? -120 : 0;

          return (
            <Marker
              key={room._id}
              coordinate={{
                latitude: room.latitude,
                longitude: room.longitude,
              }}
              onPress={() => scrollToCard(room._id)}
              centerOffset={{ x: 0, y: -25 }} 
            >
              <Animated.View
                style={{
                  transform: [{ scale }, { translateY }],
                  opacity,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View
                  className={`px-3 py-[3px] rounded-full border border-gray-300 shadow-sm ${
                    selectedRoom === room._id ? "bg-[#DBE2EF]" : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-[13px] font-semibold ${
                      selectedRoom === room._id
                        ? "text-[#112D4E]"
                        : "text-[#3F72AF]"
                    }`}
                  >
                    {room.price.toLocaleString("vi-VN")} ₫
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
