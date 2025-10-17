import React from "react";
import { View, Animated, Text, StyleSheet } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";

export function RoomMap({ mapRef, rooms, markersAnim, selectedRoom, scrollToCard, setIsMapReady }: any) {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView
        ref={mapRef}
        provider={undefined}
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
        <UrlTile urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />

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
              coordinate={{ latitude: room.latitude, longitude: room.longitude }}
              onPress={() => scrollToCard(room._id)}
            >
              <Animated.View style={{ transform: [{ scale }], opacity }}>
                <View
                  className={`rounded-full px-2 py-[3px] border border-gray-300 shadow ${
                    selectedRoom === room._id ? "bg-[#DBE2EF]" : "bg-white"
                  }`}
                >
                  <Text
                    className={`text-[12px] font-semibold ${
                      selectedRoom === room._id ? "text-[#112D4E]" : "text-[#3F72AF]"
                    }`}
                  >
                    {room.price.toLocaleString("vi-VN")}đ
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
