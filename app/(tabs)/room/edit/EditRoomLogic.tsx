import apiClient from "@/services/apiClient";
import { roomApi } from "@/services/roomApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
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
      console.log("❌ Lỗi fetch room:", err);
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
      const formData = new FormData();

      formData.append("name", updatedData.name || "");
      formData.append("price", String(Number(updatedData.price || 0)));
      formData.append("address", updatedData.address || "");
      formData.append("description", updatedData.description || "");
      // Append amenities as repeated fields so backend can receive array
      if (selectedAmenities && selectedAmenities.length > 0) {
        selectedAmenities.forEach((id) => formData.append("amenities[]", id));
      }
      formData.append("ward", roomData?.ward || "");

      const locationValue = updatedData.location || roomData?.location || null;
      if (locationValue) {
        // send as nested form fields so body-parser can create an object
        const coords = locationValue.coordinates || locationValue;
        // coords expected as [lng, lat]
        formData.append("location[type]", "Point");
        formData.append("location[coordinates][0]", String(coords[0]));
        formData.append("location[coordinates][1]", String(coords[1]));
      }

      // Separate existing remote images and new local images
      const allImages: string[] = roomData?.images || [];
      const existingImages: string[] = allImages.filter((u) => typeof u === "string" && u.startsWith("http"));
      const newImages: string[] = allImages.filter((u) => typeof u === "string" && !u.startsWith("http"));

      if (existingImages.length > 0) {
        // send each existing image url as existingImages[] so backend receives array
        existingImages.forEach((url) => formData.append("existingImages[]", url));
      }

      // Append local files (from Expo ImagePicker) to 'images' field
      for (let i = 0; i < newImages.length; i++) {
        const uri = newImages[i];
        // Derive filename and type
        const uriParts = uri.split("/");
        const filename = uriParts[uriParts.length - 1] || `image_${i}.jpg`;
        const match = filename.match(/\.(\w+)$/);
        const ext = match ? match[1].toLowerCase() : "jpg";
        const mimeType = ext === "mov" || ext === "mp4" ? `video/${ext}` : `image/${ext === "jpg" ? "jpeg" : ext}`;

        // For React Native FormData, append file objects with { uri, name, type }
        // @ts-ignore
        formData.append("images", {
          uri,
          name: filename,
          type: mimeType,
        });
      }

      const res = await roomApi.updateRoom(roomId, formData);
      return { success: true, data: res };
    } catch (err: any) {
      console.log(
        "❌ Lỗi update phòng:",
        err?.response?.data || err
      );
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
      location: { type: "Point", coordinates: [longitude, latitude] },
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
        location: { type: "Point", coordinates: [longitude, latitude] },
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
