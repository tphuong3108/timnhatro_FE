import { useState, useEffect, useRef, useCallback } from "react";
import apiClient from "@/services/apiClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { roomApi } from "@/services/roomApi";
export default function useEditRoomLogic(roomId: string) {
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const didFetchRef = useRef(false);

  const fetchRoomData = useCallback(async () => {
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
      setError("Không thể tải dữ liệu phòng");
    } finally {
      setLoading(false);
    }
  }, [roomId])

  useEffect(() => {
    didFetchRef.current = false;
    fetchRoomData();
  }, [fetchRoomData]);;
  
  const handleUpdateRoom = async (updatedData: any) => {
  try {
    const payload = {
      name: updatedData.name,
      price: Number(updatedData.price),
      address: updatedData.address,
      description: updatedData.description,
      amenities: selectedAmenities,
      ward: roomData?.ward,

      location: updatedData.location
        ? updatedData.location
        : roomData?.location,
    };
    const res = await roomApi.updateRoom(roomId, payload);
    return { success: true, data: res };
  } catch (err: any) {
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
