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
          latitude: 10.7769,
          longitude: 106.7009,
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
          if (!markersAnim[i]) return null;

          const scale = markersAnim[i].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.4],
          });

          const handleMarkerPress = () => {
            // ✅ Fix TypeScript warning: khai báo kiểu rõ ràng
            markersAnim.forEach((a: Animated.Value, index: number) => {
              Animated.timing(a, {
                toValue: index === i ? 1 : 0,
                duration: 300,
                useNativeDriver: true,
              }).start();
            });

            scrollToCard(room._id);

            // ✅ Giữ animation nhún marker được chọn
            Animated.sequence([
              Animated.spring(markersAnim[i], {
                toValue: 1.6,
                useNativeDriver: true,
              }),
              Animated.spring(markersAnim[i], {
                toValue: 1.4,
                friction: 4,
                tension: 80,
                useNativeDriver: true,
              }),
            ]).start();
          };

          return (
            <Marker
              key={room._id}
              coordinate={{
                latitude: room.latitude,
                longitude: room.longitude,
              }}
              onPress={handleMarkerPress}
              centerOffset={{ x: 0, y: -15 }}
              tracksViewChanges={false}
            >
              <Animated.View
                style={{
                  transform: [{ scale }],
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
                    {room.price?.toLocaleString("vi-VN") ?? "0"} ₫
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
