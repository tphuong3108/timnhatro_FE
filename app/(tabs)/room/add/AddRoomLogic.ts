import apiClient from "@/services/apiClient";
import { profileApi } from "@/services/profileApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";
import ReactNativeBlobUtil from "react-native-blob-util";

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
      const res = await apiClient.get(`/wards/name/${encodeURIComponent(wardName)}`);
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

  // 🏠 Cập nhật địa chỉ khi marker thay đổi
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
  console.log("🖱️ Bấm nút đăng phòng");
  console.log("🚀 handleSubmit được gọi!");

  if (!roomName || !price || !location || !marker) {
    Toast.show({ type: "error", text1: "Vui lòng nhập đầy đủ thông tin!" });
    return;
  }

  try {
    setLoadingSubmit(true);
    let wardId: string | null = null;
    const matchWard =
      location.match(/Phường\s*([^,]+)/i) ||
      location.match(/P\.\s*([^,]+)/i) ||
      location.match(/X\.\s*([^,]+)/i) ||
      location.match(/Xã\s*([^,]+)/i);

    if (matchWard && matchWard[1]) {
      wardId = await fetchWardIdByName(matchWard[1].trim());
    }
    if (!wardId) {
      wardId = "68fece1de79afdce26641857";
      console.log("⚠️ Không tìm thấy ward, dùng mặc định:", wardId);
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Toast.show({ type: "error", text1: "Chưa đăng nhập!" });
      return;
    }

    const uploadUrl = `${apiClient.defaults.baseURL}/hosts/rooms`;
    console.log("📡 Gửi request tới:", uploadUrl);

    // Tạo FormData
    const formData = new FormData();
    formData.append("name", roomName);
    formData.append("address", location);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("ward", wardId || "");

    selectedAmenities.forEach((a) => formData.append("amenities", a));
    formData.append("location[type]", "Point");
    formData.append("location[coordinates][]", marker.longitude.toString());
    formData.append("location[coordinates][]", marker.latitude.toString());

    // Đảm bảo bạn gửi ảnh đúng cách
    console.log("📤 Thêm media:", media.length);
    media.forEach((uri, index) => {
      const isVideo = uri.endsWith(".mp4");
      const fileType = isVideo ? "video/mp4" : "image/jpeg";
      const fileName = uri.split("/").pop() || (isVideo ? `video_${index}.mp4` : `image_${index}.jpg`);

      formData.append(isVideo ? "videos" : "images", {
        uri,
        type: fileType,
        name: fileName,
      } as any);
    });

    console.log("📦 FormData đã tạo xong:", JSON.stringify(formData));

    // Gửi request tới backend
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    console.log("✅ Phản hồi BE:", data);

    if (res.ok) {
      Toast.show({ type: "success", text1: "🎉 Đăng phòng thành công!" });
    } else {
      Toast.show({
        type: "error",
        text1: "Lỗi đăng phòng!",
        text2: data.message || "Thử lại sau.",
      });
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
