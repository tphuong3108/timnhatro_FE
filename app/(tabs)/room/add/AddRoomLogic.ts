import { useState } from "react";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

export const useAddRoomLogic = () => {
  const [roomName, setRoomName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [media, setMedia] = useState<string[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  //  Khi chạm bản đồ → cập nhật marker và địa chỉ
  const handleMapPress = async (event: any) => {
    try {
      const coord = event?.nativeEvent?.coordinate;
      if (!coord) return;
      setMarker(coord);
      const addr = await Location.reverseGeocodeAsync(coord);
      if (addr.length > 0) {
        const a = addr[0];
        setLocation(`${a.name || ""} ${a.street || ""}, ${a.district || ""}, ${a.city || ""}`);
      }
    } catch (e) {
      console.log(" Lỗi lấy địa chỉ từ bản đồ:", e);
    }
  };

  //  Dùng vị trí hiện tại
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

      const addr = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addr.length > 0) {
        const a = addr[0];
        setLocation(`${a.name || ""} ${a.street || ""}, ${a.district || ""}, ${a.city || ""}`);
      }
    } finally {
      setLoadingLocation(false);
    }
  };

  //  Chọn ảnh
  const pickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Cần quyền truy cập ảnh!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setMedia((prev) => [...prev, ...uris]);
    }
  };

  const removeMedia = (i: number) => {
    setMedia((prev) => prev.filter((_, idx) => idx !== i));
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
    selectedAmenities,
    setSelectedAmenities,
    marker,
    setMarker,
    media,
    pickMedia,
    removeMedia,
    handleMapPress,
    getCurrentLocation,
    loadingLocation,
  };
};
