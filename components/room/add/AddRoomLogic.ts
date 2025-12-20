import apiClient from "@/services/apiClient";
import { profileApi } from "@/services/profileApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

export const useAddRoomLogic = () => {
  const [roomName, setRoomName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [description, setDescription] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [media, setMedia] = useState<string[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [isPremiumPost, setIsPremiumPost] = useState(false);
  const resetForm = () => {
    setRoomName("");
    setPrice("");
    setLocation("");
    setDescription("");
    setMedia([]);
    setSelectedAmenities([]);
    setMarker(null);
    setSelectedWard("");
  };


  // 🧭 Lấy vị trí hiện tại
  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({ type: "error", text1: "Cần quyền truy cập vị trí!" });
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setMarker({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      Toast.show({ type: "info", text1: "Đã chọn vị trí hiện tại!" });
    } catch {
      Toast.show({ type: "error", text1: "Không thể lấy vị trí hiện tại!" });
    } finally {
      setLoadingLocation(false);
    }
  };

  //  Chọn ảnh hoặc video
  const pickMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const uris = result.assets.map((a) => a.uri);
        setMedia((prev) => [...prev, ...uris]);
      }
    } catch {
      Toast.show({ type: "error", text1: "Không thể chọn ảnh hoặc video!" });
    }
  };

  const removeMedia = (uri: string) => {
    setMedia((prev) => prev.filter((m) => m !== uri));
  };

  //  Chọn vị trí thủ công
  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
  };
  //  Lấy wardId theo tên
  const fetchWardIdByName = async (wardName: string): Promise<string | null> => {
    try {
      const res = await apiClient.get(`/wards/name/${name}`)
      return res.data.data?._id || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const loadWards = async () => {
      try {
        const res = await apiClient.get("/wards");
        setWards(res.data);
      } catch {
      }
    };

    loadWards();
  }, []);


  useEffect(() => {
    const upgradeRole = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const profile = await profileApi.getMyProfile();
        if (profile.role === "tenant") {
          await profileApi.upgradeRole({ revert: false });
          Toast.show({ type: "info", text1: "Đã đổi quyền sang Host" });
        }
        setIsHost(true);
      } catch {
      }
    };

    upgradeRole();

    return () => {
      if (isHost) {
        profileApi.upgradeRole({ revert: true }).then(() => {
          Toast.show({ type: "info", text1: "Đã trở lại quyền Tenant" });
        });
      }
    };
  }, [isHost]);

  useEffect(() => {
    const updateAddressFromMarker = async () => {
      if (!marker) return;
      try {
        const [geo] = await Location.reverseGeocodeAsync({
          latitude: marker.latitude,
          longitude: marker.longitude,
        });
        if (geo) {
          const ward = geo.subregion || geo.district || "";
          const city = geo.city || geo.region || "";
          const street = geo.name || geo.street || "";
          const address = `${street} ${ward ? ward + ", " : ""}${city}`;
          setLocation(address);
        }
      } catch {
      }
    };
    updateAddressFromMarker();
  }, [marker]);



  const handleSubmit = async () => {
    if (!roomName || !price || !location || !marker) {
      Toast.show({ type: "error", text1: "Vui lòng nhập đầy đủ thông tin!" });
      return;
    }

    try {
      setLoadingSubmit(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Toast.show({ type: "error", text1: "Chưa đăng nhập!" });
        return;
      }

      const uploadUrl = `${apiClient.defaults.baseURL}/hosts/rooms`;

      // 📸 Chuyển ảnh sang base64
      const base64Images: string[] = [];
      for (const uri of media) {
        try {
          const base64 = await FileSystem.readAsStringAsync(uri, { encoding: "base64" });
          base64Images.push(`data:image/jpeg;base64,${base64}`);
        } catch {
        }
      }


      const body = {
        name: roomName,
        address: location,
        price,
        description,
        ward: selectedWard,
        amenities: selectedAmenities,
        location: {
          type: "Point",
          coordinates: [marker.longitude, marker.latitude],
        },
        images: base64Images,
      };

      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        Toast.show({
          type: "error",
          text1: "Đăng phòng thất bại!",
          text2: data.message || "Vui lòng thử lại sau.",
        });
        return;
      }

      const roomId = data.data?._id;

      // Kiểm tra roomId hợp lệ trước khi redirect
      if (!roomId) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Không thể lấy ID phòng",
        });
        return;
      }

      if (!isPremiumPost) {
        Alert.alert("🎉 Thành công",
          "Phòng của bạn đã được gửi, vui lòng chờ admin duyệt.");
        resetForm();
        router.push("/(tabs)/home");
        return;
      }

      router.push(`/(tabs)/payments/PaymentContainer?roomId=${roomId}&isPremium=true`);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Đăng phòng thất bại!",
        text2: err.message || "Vui lòng thử lại sau.",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };
  return {
    roomName,
    setRoomName,
    price,
    setPrice,
    location,
    setLocation,
    marker,
    setMarker,
    description,
    setDescription,
    selectedAmenities,
    setSelectedAmenities,
    media,
    pickMedia,
    removeMedia,
    loadingLocation,
    getCurrentLocation,
    wards,
    selectedWard,
    setSelectedWard,
    loadingSubmit,
    handleSubmit,
    handleMapPress,
    isPremiumPost,
    setIsPremiumPost
  };
};
