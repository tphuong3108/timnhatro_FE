import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Linking, Share } from "react-native";
import { roomApi } from "@/services/roomApi";
import apiClient from "@/services/apiClient";
import { useAuth } from "@/constants/auth/AuthContext";

export function useRoomLogic() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [room, setRoom] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [currentImage, setCurrentImage] = useState(1);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [loadingRoom, setLoadingRoom] = useState(true);

  // 🔹 Fetch chi tiết phòng theo SLUG
  useEffect(() => {
    const fetchRoom = async () => {
      if (!id) return;
      try {
        setLoadingRoom(true);
        console.log("🧭 Đang tải phòng theo slug:", id);

        const data = await roomApi.getRoomBySlug(id);

        // 🧩 Chuẩn hóa dữ liệu chủ trọ
        const normalizedRoom = {
          ...data,
          host: {
            _id: data.createdBy?._id,
            fullName:
              (data.createdBy?.firstName || "") +
              (data.createdBy?.lastName ? ` ${data.createdBy.lastName}` : ""),
            email: data.createdBy?.email || "",
            avatar:
              data.createdBy?.avatar ||
              "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
            bio: data.createdBy?.bio || "Chủ trọ thân thiện và nhiệt tình.",
          },
        };
        setRoom(normalizedRoom);

        // ❤️ Kiểm tra đã like
        const isLiked = data.likeBy?.some(
          (u: any) => u._id?.toString() === user?._id?.toString()
        );
        setLiked(isLiked);

        // 📘 Kiểm tra phòng đã lưu
        if (user?._id) {
          const userRes = await apiClient.get("/me");
          const favorites = userRes.data?.data?.favorites || [];
          const isFavorited = favorites.some(
            (fav: any) => fav._id?.toString() === data._id?.toString()
          );
          setFavorited(isFavorited);
        } else {
          setFavorited(false);
        }
      } catch (err) {
        console.warn("❌ Lỗi khi tải phòng:", err);
        Alert.alert("Lỗi", "Không thể tải thông tin phòng này.");
        router.back();
      } finally {
        setLoadingRoom(false);
      }
    };

    fetchRoom();
  }, [id, user?._id]);

  // 🔁 Làm mới trạng thái like/lưu
  const refreshRoomStatus = async () => {
    if (!id) return;
    try {
      const data = await roomApi.getRoomBySlug(id);

      const isLiked = data.likeBy?.some(
        (u: any) => u._id?.toString() === user?._id?.toString()
      );
      setLiked(isLiked);

      if (user?._id) {
        const userRes = await apiClient.get("/me");
        const favorites = userRes.data?.data?.favorites || [];
        const isFavorited = favorites.some(
          (fav: any) => fav._id?.toString() === data._id?.toString()
        );
        setFavorited(isFavorited);
      }
    } catch (err) {
      console.warn("⚠️ Không thể refresh trạng thái phòng:", err);
    }
  };

  // 📍 Lấy vị trí người dùng
  useEffect(() => {
    (async () => {
      try {
        setLoadingLoc(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({});
          setUserLocation(loc.coords);
        }
      } catch (error) {
        console.warn("⚠️ Không thể lấy vị trí người dùng:", error);
      } finally {
        setLoadingLoc(false);
      }
    })();
  }, []);

  const handleScroll = (event: any) => {
    const width = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / width) + 1;
    setCurrentImage(index);
  };

  const openDirections = () => {
    if (!room?.location?.coordinates) return;
    const [lon, lat] = room.location.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
    Linking.openURL(url);
  };

  const shareRoom = async () => {
    if (!room) return;
    try {
      await Share.share({
        message: `✨ ${room.name}\n🏠 ${room.address}\n💰 ${room.price?.toLocaleString(
          "vi-VN"
        )}₫/tháng\n📍 https://www.google.com/maps?q=${room.location?.coordinates[1]},${room.location?.coordinates[0]}`,
      });
    } catch {
      Alert.alert("Lỗi", "Không thể chia sẻ phòng này.");
    }
  };

  const contactHost = (type: "email" | "call") => {
    if (!room?.host) return;
    if (type === "email" && room.host.email) {
      Linking.openURL(`mailto:${room.host.email}`);
    } else {
      Linking.openURL(`tel:0123456789`);
    }
  };

  const reportRoom = () => {
    setShowMenu(false);
    if (room?._id) router.push(`/room/ReportRoom?id=${room._id}`);
  };

  return {
    room,
    setRoom,
    liked,
    setLiked,
    favorited,
    setFavorited,
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
    loadingRoom,
    refreshRoomStatus,
  };
}

export default useRoomLogic;
