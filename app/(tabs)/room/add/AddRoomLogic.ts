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
    } catch (err) {
      console.log("❌ Lỗi lấy vị trí:", err);
      Toast.show({ type: "error", text1: "Không thể lấy vị trí hiện tại!" });
    } finally {
      setLoadingLocation(false);
    }
  };

  // 📸 Chọn ảnh hoặc video
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
        console.log("🖼️ Chọn media thành công:", uris);
      }
    } catch (err) {
      console.log("❌ Lỗi chọn media:", err);
      Toast.show({ type: "error", text1: "Không thể chọn ảnh hoặc video!" });
    }
  };

  const removeMedia = (uri: string) => {
    setMedia((prev) => prev.filter((m) => m !== uri));
  };

  // 🗺️ Chọn vị trí thủ công
  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
  };

  // 🔍 Lấy wardId theo tên
  const fetchWardIdByName = async (wardName: string): Promise<string | null> => {
    try {
      const res = await apiClient.get(`/wards/name/${name}`)
      return res.data.data?._id || null;
    } catch {
      console.log("⚠️ Không tìm thấy ward:", wardName);
      return null;
    }
  };

  // 🧠 Tự động nâng quyền Host khi mở màn
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
      } catch (err) {
        console.log("⚠️ Không thể nâng role:", err);
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
          console.log("📍 Địa chỉ tự động:", address);
        }
      } catch (error) {
        console.log("❌ Lỗi reverse geocoding:", error);
      }
    };
    updateAddressFromMarker();
  }, [marker]);



  const handleSubmit = async () => {
    console.log("🚀 handleSubmit được gọi!");
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
        } catch (err) {
          console.log("❌ Lỗi đọc file:", err);
        }
      }

      const body = {
        name: roomName,
        address: location,
        price,
        description,
        ward: "68fece1de79afdce26641857",
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
      console.log("✅ Phản hồi BE:", data);
      if (res.ok) {
        const roomId = data.data?._id;
        Alert.alert(
          "🎉 Thành công",
          "Phòng đã được gửi duyệt.\nBạn có muốn nâng cấp phòng để được ưu tiên hiển thị không?",
          [
            {
              text: "Không",
              style: "cancel",
              onPress: () => {
                Alert.alert(
                  "🎉 Thành công",
                  "Phòng của bạn đã được gửi, vui lòng chờ admin duyệt.",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        setRoomName("");
                        setPrice("");
                        setDescription("");
                        setMedia([]);
                        setSelectedAmenities([]);
                        setMarker(null);
                        setLocation("");
                        router.push("/(tabs)/home");
                      },
                    },
                  ]
                );
              },
            },
            {
              text: "Có, nâng cấp ngay",
              onPress: () => {
                router.push(`/(tabs)/payments/PaymentContainer?roomId=${roomId}&isPremium=true`);
              },
            },
          ]
        );
      }
    } catch (err: any) {
      console.log("❌ Lỗi đăng phòng:", err.message);
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
    loadingSubmit,
    handleSubmit,
    handleMapPress,
  };
};
