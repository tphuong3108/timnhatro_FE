import { useState } from "react";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

export default function useAddRoom() {
  const [roomName, setRoomName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [media, setMedia] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // 📍 Lấy vị trí hiện tại
  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Cần quyền truy cập vị trí!");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setMarker({ latitude, longitude });

      // 🏠 Lấy địa chỉ dạng text
      const addr = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addr.length > 0) {
        const a = addr[0];
        setLocation(`${a.name || ""} ${a.street || ""}, ${a.district || ""}, ${a.city || ""}`);
      }
    } catch (error) {
      console.error("Lỗi khi lấy vị trí:", error);
      alert("Không thể lấy vị trí hiện tại!");
    } finally {
      setLoadingLocation(false);
    }
  };

  // 🗺️ Khi chạm bản đồ → cập nhật marker + địa chỉ
  const handleMapPress = async (event: any) => {
    const coord = event?.nativeEvent?.coordinate;
    if (!coord) return;
    setMarker(coord);
    try {
      const addr = await Location.reverseGeocodeAsync(coord);
      if (addr.length > 0) {
        const a = addr[0];
        setLocation(`${a.name || ""} ${a.street || ""}, ${a.district || ""}, ${a.city || ""}`);
      }
    } catch (error) {
      console.error("Reverse geocode error:", error);
    }
  };

  // 📸 Chọn ảnh / video
  const pickMedia = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Cần quyền truy cập thư viện ảnh!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const uris = result.assets.map((asset) => asset.uri);
        setMedia((prev) => [...prev, ...uris]);
      }
    } catch (error) {
      console.error("Lỗi khi chọn ảnh/video:", error);
      alert("Không thể chọn tệp phương tiện!");
    }
  };

  // ❌ Xóa ảnh/video
  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    roomName,
    setRoomName,
    price,
    setPrice,
    location,
    setLocation,
    description,
    setDescription,
    marker,
    setMarker,
    media,
    pickMedia,
    removeMedia,
    selectedAmenities,
    setSelectedAmenities,
    handleMapPress,
    getCurrentLocation,
    loadingLocation,
  };
}
