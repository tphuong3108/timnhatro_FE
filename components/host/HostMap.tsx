import React from "react";
import MapView, { Marker } from "react-native-maps";
import { View, Text } from "react-native";

export default function HostMap({ rooms = [] }: any) {
  if (!rooms.length) {
    return (
      <View className="p-4 bg-white rounded-2xl mt-3">
        <Text className="text-gray-500 text-center">
          Chưa có phòng để hiển thị trên bản đồ.
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl overflow-hidden mt-3">
      <MapView
        style={{ width: "100%", height: 250 }}
        initialRegion={{
          latitude: rooms[0]?.coordinates?.lat || 10.762622,
          longitude: rooms[0]?.coordinates?.lng || 106.660172,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {rooms.map((room: any, index: number) => (
          <Marker
            key={index}
            coordinate={{
              latitude: room.coordinates?.lat || 0,
              longitude: room.coordinates?.lng || 0,
            }}
            title={room.name}
            description={room.address}
          />
        ))}
      </MapView>
    </View>
  );
}
