import { useState, useEffect, useRef } from "react";
import apiClient from "@/services/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

export default function useEditRoomLogic(roomId: string) {
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const didFetchRef = useRef(false);

  const fetchRoomData = async () => {
    if (didFetchRef.current || !roomId) return;
    didFetchRef.current = true;

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await apiClient.get(`/hosts/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.data;

      let marker = undefined;
      if (data.location) {
        if (data.location.latitude && data.location.longitude) {
          marker = {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
          };
        } else if (
          Array.isArray(data.location.coordinates) &&
          data.location.coordinates.length === 2
        ) {
          marker = {
            latitude: data.location.coordinates[1],
            longitude: data.location.coordinates[0],
          };
        }
      }

      setRoomData({
        ...data,
        marker,
      });

      setSelectedAmenities(data.amenities?.map((a: any) => a._id || a) || []);
    } catch (err) {
      console.log("❌ Lỗi fetch room:", err);
      setError("Không thể tải dữ liệu phòng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // 💾 Cập nhật phòng
  const handleUpdateRoom = async (updatedData: any) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("Bạn cần đăng nhập lại.");
        return { success: false, error: "No token" };
      }

      const payload = {
        ...updatedData,
        amenities: selectedAmenities,
        location: updatedData.location || roomData?.location,
      };

      const res = await apiClient.patch(`/hosts/rooms/${roomId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { success: true, data: res.data };
    } catch (err) {
      console.log("❌ Lỗi update phòng:", err);
      return { success: false, error: err };
    }
  };

  const pickMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => asset.uri);

        setRoomData((prev: any) => ({
          ...prev,
          images: Array.from(new Set([...(prev?.images || []), ...newImages])),
        }));
      }
    } catch (err) {
      console.log("❌ Lỗi chọn ảnh:", err);
    }
  };

  // 🗑️ Xóa ảnh
  const removeMedia = (uri: string) => {
    setRoomData((prev: any) => ({
      ...prev,
      images: prev?.images?.filter((img: string) => img !== uri),
    }));
  };

  // 🗺️ Khi bấm trên bản đồ
  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setRoomData((prev: any) => ({
      ...prev,
      marker: { latitude, longitude },
      location: { latitude, longitude },
    }));
  };

  // 📍 Lấy vị trí hiện tại
  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Quyền truy cập vị trí bị từ chối");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setRoomData((prev: any) => ({
        ...prev,
        marker: { latitude, longitude },
        location: { latitude, longitude },
      }));
    } catch (err) {
      console.log("❌ Lỗi lấy vị trí:", err);
      setError("Không thể lấy vị trí hiện tại");
    } finally {
      setLoadingLocation(false);
    }
  };

  return {
    roomData,
    setRoomData,
    loading,
    error,
    handleUpdateRoom,
    selectedAmenities,
    setSelectedAmenities,
    pickMedia,
    removeMedia,
    handleMapPress,
    getCurrentLocation,
    loadingLocation,
  };
}
