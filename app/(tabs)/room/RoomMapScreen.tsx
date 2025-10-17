import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  PanResponder,
} from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { Star } from "lucide-react-native";
import rooms from "@/constants/data/rooms";

const { height } = Dimensions.get("window");
const SNAP_POINTS = [0.15, 0.5, 0.95];

export default function RoomMapScreen() {
  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<FlatList>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [snapIndex, setSnapIndex] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  const modalHeight = useRef(new Animated.Value(height * SNAP_POINTS[snapIndex])).current;
  const markersAnim = useRef(rooms.map(() => new Animated.Value(0))).current;
  const [isMapReady, setIsMapReady] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
      onPanResponderMove: (_, g) => {
        const newHeight = height * SNAP_POINTS[snapIndex] - g.dy;
        if (newHeight >= height * 0.15 && newHeight <= height * 0.95) {
          modalHeight.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, g) => {
        const dy = g.dy;
        let newIndex = snapIndex;
        if (dy > 80) newIndex = Math.max(0, snapIndex - 1);
        else if (dy < -80) newIndex = Math.min(2, snapIndex + 1);
        setSnapIndex(newIndex);
        Animated.spring(modalHeight, {
          toValue: height * SNAP_POINTS[newIndex],
          useNativeDriver: false,
          friction: 8,
        }).start();
      },
    })
  ).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (!viewableItems.length) return;
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
  }).current;

  const scrollToCard = (id: string) => {
    const index = rooms.findIndex((r) => r._id === id);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setSelectedRoom(id);
      const room = rooms[index];
      mapRef.current?.animateToRegion(
        {
          latitude: room.latitude,
          longitude: room.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        400
      );
      setIsVisible(true);
      setSnapIndex(1);
      Animated.spring(modalHeight, {
        toValue: height * SNAP_POINTS[1],
        useNativeDriver: false,
      }).start();
    }
  };

  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;

    mapRef.current.getCamera?.()?.then((camera) => {
      if (!camera?.center) return;

      let newLat = camera.center.latitude;

      if (snapIndex === 1) newLat = camera.center.latitude + 0.008; // Đẩy map lên khi modal nửa màn
      if (snapIndex === 0 || snapIndex === 2) newLat = camera.center.latitude - 0.008; // Trả lại vị trí bình thường

      mapRef.current?.animateCamera({
        center: { latitude: newLat, longitude: camera.center.longitude },
        zoom: camera.zoom,
      });
    });
  }, [snapIndex, isMapReady]);

  return (
    <View className="flex-1 bg-white">
      <MapView
        ref={mapRef}
        provider={undefined}
        style={styles.map}
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

        {rooms.map((room, i) => {
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

      {isVisible && (
        <Animated.View
          style={{
            height: modalHeight,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "white",
            overflow: "hidden",
          }}
        >
          <Animated.View
            {...panResponder.panHandlers}
            className="h-6 justify-center items-center active:opacity-70"
          >
            <View className="h-1.5 w-10 bg-gray-300 rounded-full" />
          </Animated.View>

          <View className="px-5 flex-row justify-between items-center mb-2">
            <Text className="text-[#3F72AF] font-semibold text-base">
              {rooms.length} chỗ ở trong khu vực này
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSnapIndex(0);
                Animated.spring(modalHeight, {
                  toValue: height * SNAP_POINTS[0],
                  useNativeDriver: false,
                }).start();
              }}
            >
              <Text className="text-red-500 font-semibold">Thu gọn</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={rooms}
            keyExtractor={(item) => item._id}
            onViewableItemsChanged={onViewableItemsChanged}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 150 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => scrollToCard(item._id)}
                className={`border rounded-2xl mb-4 mx-4 shadow-sm ${
                  selectedRoom === item._id
                    ? "border-[#3F72AF] bg-[#F9FAFB]"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Image source={{ uri: item.images[0] }} className="w-full h-40 rounded-t-2xl" />
                <View className="p-3">
                  <Text className="text-lg font-semibold text-[#112D4E]">{item.name}</Text>
                  <Text className="text-gray-500 text-sm mt-1">{item.address}</Text>
                  <View className="flex-row items-center mt-2">
                    <Star size={16} color="#FACC15" fill="#FACC15" />
                    <Text className="ml-1 text-sm text-gray-700">
                      {item.avgRating} ({item.totalRatings})
                    </Text>
                  </View>
                  <Text className="text-[#3F72AF] font-semibold mt-2">
                    {item.price.toLocaleString("vi-VN")}đ / tháng
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
