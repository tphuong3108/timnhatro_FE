import React, { useMemo, useRef, useState } from "react";
import { View, Text, FlatList, Animated, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import rooms from "@/constants/data/rooms";
import MapRoomCard from "@/components/MapRoomCard";

const { height } = Dimensions.get("window");

export default function RoomMapScreen() {
  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<FlatList>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const markersAnim = useRef(rooms.map(() => new Animated.Value(0))).current;
  const snapPoints = useMemo(() => ["15%", "55%", "95%"], []);

  // 👉 Khi scroll card => focus map marker
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const current = viewableItems[0].item;
      setSelectedRoom(current._id);

      const idx = rooms.findIndex((r) => r._id === current._id);
      markersAnim.forEach((a, i) => {
        Animated.timing(a, {
          toValue: i === idx ? 1 : 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });

      mapRef.current?.animateToRegion(
        {
          latitude: current.latitude,
          longitude: current.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        400
      );
    }
  }).current;

  const scrollToCard = (id: string) => {
    const index = rooms.findIndex((r) => r._id === id);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setSelectedRoom(id);
    }
  };

  return (
    <GestureHandlerRootView className="flex-1 bg-white">
      <View className="flex-1 relative">
        {/* 🗺️ Map */}
        <View className="absolute inset-0 z-0">
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: 11.94,
              longitude: 108.45,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation
            showsMyLocationButton
          >
            {rooms.map((room, i) => {
              const scale = markersAnim[i].interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.3],
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
                  onPress={() => {
                    bottomSheetRef.current?.snapToIndex(1);
                    scrollToCard(room._id);
                  }}
                >
                  <Animated.View
                    style={{ transform: [{ scale }], opacity }}
                    className="items-center"
                  >
                    <View className="bg-white rounded-full px-2 py-[3px] border border-gray-300 shadow">
                      <Text className="text-[12px] font-semibold text-[#3F72AF]">
                        {room.price.toLocaleString("vi-VN")}đ
                      </Text>
                    </View>
                  </Animated.View>
                </Marker>
              );
            })}
          </MapView>
        </View>

        {/* 🧭 BottomSheet (hiển thị danh sách phòng) */}
        <BottomSheet
          ref={bottomSheetRef}
          index={1} // mở ở mức giữa
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          backgroundStyle={{ backgroundColor: "#fff" }}
          handleIndicatorStyle={{ backgroundColor: "#ccc" }}
          style={{
            zIndex: 999, // 🔥 luôn nổi trên footer
            elevation: 20,
            marginBottom: 70, // tránh footer
          }}
        >
          <View className="px-5 pb-[120px] min-h-[400px]">
            <Text className="text-[#3F72AF] text-base font-semibold mb-3">
              {rooms.length} chỗ ở trong khu vực này
            </Text>

            <FlatList
              ref={flatListRef}
              data={rooms}
              keyExtractor={(item) => item._id}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={{ viewAreaCoveragePercentThreshold: 60 }}
              renderItem={({ item }) => <MapRoomCard room={item} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          </View>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}
