import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Alert } from "react-native";

export function useAddRoomLogic() {
  const [roomName, setRoomName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // 📍 Lấy vị trí hiện tại
  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Quyền bị từ chối", "Vui lòng cấp quyền truy cập vị trí.");
        setLoadingLocation(false);
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
      setLoadingLocation(false);
    } catch {
      setLoadingLocation(false);
      Alert.alert("Lỗi", "Không thể lấy vị trí hiện tại.");
    }
  };

  // 🎞️ Chọn ảnh / video
  const pickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Không có quyền truy cập", "Vui lòng cấp quyền truy cập thư viện ảnh.");
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

  // 🗺️ Chọn vị trí trên map
  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
    const addr = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (addr.length > 0) {
      const a = addr[0];
      setLocation(`${a.name || ""} ${a.street || ""}, ${a.district || ""}, ${a.city || ""}`);
    }
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
    media,
    setMedia,
    pickMedia,
    selectedAmenities,
    setSelectedAmenities,
    marker,
    setMarker,
    handleMapPress,
    getCurrentLocation,
    loadingLocation,
  };
}
