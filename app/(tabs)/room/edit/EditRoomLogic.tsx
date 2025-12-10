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

      const res = await apiClient.get(`/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.data;

      let marker;
      if (data.location?.coordinates?.length === 2) {
        marker = {
          latitude: data.location.coordinates[1],
          longitude: data.location.coordinates[0],
        };
      }

      setRoomData({
        ...data,
        ward: data.ward?._id || data.ward || null,
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
    didFetchRef.current = false;
    fetchRoomData();
  }, [roomId]);

  // 💾 Cập nhật phòng
  const handleUpdateRoom = async (updatedData: any) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("Bạn cần đăng nhập lại.");
        return { success: false };
      }
    console.log("WARD TRƯỚC KHI GỬI:", updatedData.ward, roomData?.ward);
      const payload: any = {
        ...updatedData,
        amenities: selectedAmenities,
        location: updatedData.location || roomData?.location,
      };

      // ⭐ Luôn gửi ward nếu có
      if (roomData?.ward) {
        payload.ward = roomData.ward;
      }

      console.log("⬆ PAYLOAD UPDATE:", payload);

      const res = await apiClient.patch(`/rooms/${roomId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { success: true, data: res.data };
    } catch (err) {
      console.log("❌ Lỗi update phòng:", err);
      return { success: false };
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

  const removeMedia = (uri: string) => {
    setRoomData((prev: any) => ({
      ...prev,
      images: prev?.images?.filter((img: string) => img !== uri),
    }));
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setRoomData((prev: any) => ({
      ...prev,
      marker: { latitude, longitude },
      location: { coordinates: [longitude, latitude] },
    }));
  };

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
        location: { coordinates: [longitude, latitude] },
      }));
    } catch (err) {
      console.log("❌ Lỗi lấy vị trí:", err);
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
