import { useRef, useState, useEffect } from "react";
import { Animated, Dimensions, PanResponder } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import { roomApi } from "@/services/roomApi";
import roomsMock from "@/constants/data/rooms";

const { height } = Dimensions.get("window");
export const SNAP_POINTS = [0.15, 0.5, 0.85];

export function useRoomMapLogic() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const flatListRef = useRef<any>(null);

  const [rooms, setRooms] = useState<any[]>(roomsMock);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [snapIndex, setSnapIndex] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const [markersAnim, setMarkersAnim] = useState<Animated.Value[]>([]);

  // 🧭 Thêm state phân trang
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const availableHeight = height - insets.top - 60;
  const modalHeight = useRef(
    new Animated.Value(availableHeight * SNAP_POINTS[snapIndex])
  ).current;

  // ================================
  // 🧠 Fetch API (load trang đầu)
  // ================================
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await roomApi.getAllRooms({ limit: 10, page: 1 });
        const list = res?.rooms || [];
        const pagination = res?.pagination || {};

        const normalized = list.map((r: any) => ({
          ...r,
          host: {
            _id: r.createdBy?._id,
            fullName: r.createdBy
              ? `${r.createdBy.firstName || ""} ${r.createdBy.lastName || ""}`.trim()
              : "Không rõ",
            email: r.createdBy?.email || "",
            avatar:
              r.createdBy?.avatar ||
              "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
          },
          latitude: r.location?.coordinates?.[1],
          longitude: r.location?.coordinates?.[0],
          price: r.price || 0,
          avgRating: r.avgRating || 0,
          totalRatings: r.totalRatings || 0,
          images: r.images || [],
          videos: r.videos || [],
        }));

        setRooms(normalized);
        setPage(1);
        setHasMore(pagination.page < pagination.totalPages);
      } catch (err) {
        console.warn("⚠️ Không thể tải dữ liệu phòng:", err);
        setRooms(roomsMock);
      }
    };

    fetchRooms();
  }, []);

  // ================================
  // 🔁 Auto-load thêm khi cuộn tới cuối
  // ================================
  const loadMoreRooms = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await roomApi.getAllRooms({ limit: 10, page: page + 1 });
      const list = res?.rooms || [];
      const pagination = res?.pagination || {};

      const normalized = list.map((r: any) => ({
        ...r,
        host: {
          _id: r.createdBy?._id,
          fullName: r.createdBy
            ? `${r.createdBy.firstName || ""} ${r.createdBy.lastName || ""}`.trim()
            : "Không rõ",
          email: r.createdBy?.email || "",
          avatar:
            r.createdBy?.avatar ||
            "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
        },
        latitude: r.location?.coordinates?.[1],
        longitude: r.location?.coordinates?.[0],
        price: r.price || 0,
        avgRating: r.avgRating || 0,
        totalRatings: r.totalRatings || 0,
        images: r.images || [],
        videos: r.videos || [],
      }));

      setRooms((prev) => [...prev, ...normalized]);
      setPage(page + 1);
      setHasMore(pagination.page < pagination.totalPages);
    } catch (err) {
      console.warn("⚠️ Lỗi khi tải thêm phòng:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // ================================
  // Marker animation logic (giữ nguyên)
  // ================================
  useEffect(() => {
    if (rooms.length > 0) {
      setMarkersAnim(rooms.map(() => new Animated.Value(0)));
    }
  }, [rooms]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 10,
      onPanResponderMove: (_, g) => {
        const newHeight = availableHeight * SNAP_POINTS[snapIndex] - g.dy;
        if (
          newHeight >= availableHeight * 0.15 &&
          newHeight <= availableHeight * 0.95
        ) {
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

  const moveMarkerToVisibleCenter = async (latitude: number, longitude: number) => {
    if (!mapRef.current) return;

    try {
      const camera = await mapRef.current.getCamera();
      const screenHeight = Dimensions.get("window").height;

      const modalCurrentHeight =
        (await new Promise<number>((resolve) => {
          modalHeight.addListener(({ value }) => resolve(value));
          setTimeout(() => resolve(availableHeight * SNAP_POINTS[snapIndex]), 30);
        })) ?? availableHeight * SNAP_POINTS[snapIndex];

      const modalRatio = modalCurrentHeight / screenHeight;

      const latOffset = modalRatio * 0.04;

      mapRef.current.animateCamera(
        {
          center: {
            latitude: latitude + latOffset,
            longitude,
          },
          zoom: 15,
        },
        { duration: 500 }
      );
    } catch (err) {
      console.warn("⚠️ moveMarkerToVisibleCenter error:", err);
    }
  };

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

    if (current.latitude && current.longitude) {
      moveMarkerToVisibleCenter(current.latitude, current.longitude);
    }
  }).current;

  const scrollToCard = (id: string) => {
    const index = rooms.findIndex((r) => r._id === id);
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      setSelectedRoom(id);
      const room = rooms[index];
      if (room.latitude && room.longitude) {
        moveMarkerToVisibleCenter(room.latitude, room.longitude);
      }
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
    loadMoreRooms,
  };
}
