import { useState, useEffect, useMemo } from "react";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import rooms from "@/constants/data/rooms";
import { Alert, Linking, Share } from "react-native";

export function useRoomLogic() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // 🏡 Lấy thông tin phòng
  const room = useMemo(() => rooms.find((r) => r._id === id) || rooms[0], [id]);

  // 🧠 State quản lý
  const [liked, setLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [currentImage, setCurrentImage] = useState(1);
  const [userLocation, setUserLocation] = useState<any>(null);

  // 📍 Lấy vị trí hiện tại
  useEffect(() => {
    (async () => {
      setLoadingLoc(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation(loc.coords);
      }
      setLoadingLoc(false);
    })();
  }, []);

  //  Theo dõi số ảnh khi lướt
  const handleScroll = (event: any) => {
    const width = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / width) + 1;
    setCurrentImage(index);
  };

  // Mở chỉ đường (Google Maps / OSM)
  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${room.latitude},${room.longitude}`;
    Linking.openURL(url);
  };

  //  Chia sẻ phòng
  const shareRoom = async () => {
    try {
      await Share.share({
        message: `✨ ${room.name} - ${room.address}\nGiá: ${room.price.toLocaleString(
          "vi-VN"
        )}đ/tháng\n📍 Xem vị trí: https://www.google.com/maps?q=${room.latitude},${room.longitude}`,
      });
    } catch {
      Alert.alert("Lỗi", "Không thể chia sẻ phòng này.");
    }
  };

  // Liên hệ chủ trọ
  const contactHost = (type: "email" | "call") => {
    if (type === "email" && room.host?.email) {
      Linking.openURL(`mailto:${room.host.email}`);
    } else {
      Linking.openURL(`tel:0123456789`);
    }
  };

  // Báo cáo phòng
  const reportRoom = () => {
    setShowMenu(false);
    router.push(`/room/ReportRoom?id=${room._id}`);
  };

  return {
    room,
    liked,
    setLiked,
    showMenu,
    setShowMenu,
    loadingLoc,
    currentImage,
    handleScroll,
    shareRoom,
    openDirections,
    contactHost,
    reportRoom,
    userLocation,
  };
}
