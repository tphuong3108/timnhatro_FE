import { useRef, useState, useEffect } from "react";
import { Animated, Dimensions, PanResponder } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import rooms from "@/constants/data/rooms";

const { height } = Dimensions.get("window");
export const SNAP_POINTS = [0.15, 0.5, 0.95];

export function useRoomMapLogic() {
  const insets = useSafeAreaInsets(); // 👈 lấy chiều cao header / status bar
  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [snapIndex, setSnapIndex] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);

  // 👇 chiều cao khả dụng = chiều cao thật - header - padding top
  const availableHeight = height - insets.top - 60; // 60 là chiều cao header thực tế (bạn chỉnh cho phù hợp)
  const modalHeight = useRef(new Animated.Value(availableHeight * SNAP_POINTS[snapIndex])).current;

  const markersAnim = useRef(rooms.map(() => new Animated.Value(0))).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
      onPanResponderMove: (_, g) => {
        const newHeight = availableHeight * SNAP_POINTS[snapIndex] - g.dy;
        if (newHeight >= availableHeight * 0.15 && newHeight <= availableHeight * 0.95) {
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
          toValue: availableHeight * SNAP_POINTS[newIndex],
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
        toValue: availableHeight * SNAP_POINTS[1],
        useNativeDriver: false,
      }).start();
    }
  };

  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;
    mapRef.current.getCamera?.()?.then((camera) => {
      if (!camera?.center) return;
      let newLat = camera.center.latitude;
      if (snapIndex === 1) newLat += 0.008;
      if (snapIndex === 0 || snapIndex === 2) newLat -= 0.008;
      mapRef.current?.animateCamera({
        center: { latitude: newLat, longitude: camera.center.longitude },
        zoom: camera.zoom,
      });
    });
  }, [snapIndex, isMapReady]);

  return {
    rooms,
    mapRef,
    flatListRef,
    selectedRoom,
    isVisible,
    setIsVisible,
    isMapReady,
    setIsMapReady,
    markersAnim,
    modalHeight,
    panResponder,
    onViewableItemsChanged,
    scrollToCard,
  };
}
