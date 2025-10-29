import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import apiClient from "@/services/apiClient";
import { profileApi } from "@/services/profileApi";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🌤 Cloudinary config (theo BE bạn)
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dmt9ffefy/upload";
const CLOUDINARY_PRESET = "timnhatro_uploads"; // ⚠️ đổi nếu preset khác trong Cloudinary

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
    } finally {
      setLoadingLocation(false);
    }
  };

  // 📸 Chọn ảnh/video
  const pickMedia = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.All,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const uris = result.assets.map((a) => a.uri);
        setMedia((prev) => [...prev, ...uris]);
      }
    } catch (err) {
      console.log("❌ Lỗi chọn media:", err);
    }
  };

  const removeMedia = (uri: string) => {
    setMedia((prev) => prev.filter((m) => m !== uri));
  };

  // 📤 Upload file lên Cloudinary
  const uploadToCloudinary = async (uri: string): Promise<string> => {
    try {
      const formData = new FormData();
      const fileType = uri.endsWith(".mp4") ? "video/mp4" : "image/jpeg";
      formData.append("file", { uri, type: fileType, name: "upload" } as any);
      formData.append("upload_preset", CLOUDINARY_PRESET);

      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.log("❌ Upload lỗi:", error);
      return uri;
    }
  };

  // 🗺️ Chọn marker từ bản đồ
  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
  };

  // 🔍 Lấy wardId từ BE
  const fetchWardIdByName = async (wardName: string): Promise<string | null> => {
    try {
      const res = await apiClient.get(`/wards/name/${encodeURIComponent(wardName)}`);
      return res.data.data._id;
    } catch {
      console.log("⚠️ Không tìm thấy ward:", wardName);
      return null;
    }
  };

  // 🧠 Nâng quyền khi vào trang
  useEffect(() => {
    const upgradeRole = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("⚠️ Chưa có token, không thể nâng role");
          return;
        }

        const profile = await profileApi.getMyProfile();
        console.log("👤 Role hiện tại:", profile.role);

        if (profile.role === "tenant") {
          const res = await profileApi.upgradeRole({ revert: false });
          console.log("✅ Nâng quyền thành host:", res);
          setIsHost(true);
          Toast.show({ type: "info", text1: "Đã đổi quyền sang Host" });
        } else {
          setIsHost(true);
        }
      } catch (err) {
        console.log("⚠️ Không thể nâng role:", err);
      }
    };

    upgradeRole();

    // Khi rời màn hình → revert lại
    return () => {
      if (isHost) {
        profileApi.upgradeRole({ revert: true }).then(() => {
          console.log("↩️ Revert về tenant");
          Toast.show({ type: "info", text1: "Đã trở lại quyền Tenant" });
        });
      }
    };
  }, [isHost]);

  // 🚀 Gửi dữ liệu đăng phòng
  const handleSubmit = async () => {
    if (!roomName || !price || !location || !marker) {
      Toast.show({ type: "error", text1: "Vui lòng nhập đầy đủ thông tin!" });
      return;
    }

    // Tìm phường
    let wardId: string | null = null;
    const matchWard = location.match(/Phường\s*([^,]+)/i) || location.match(/P\.\s*([^,]+)/i);
    if (matchWard && matchWard[1]) {
      wardId = await fetchWardIdByName(matchWard[1].trim());
    }

    if (!wardId) {
      Toast.show({
        type: "error",
        text1: "Không tìm thấy phường!",
        text2: "Hãy nhập đúng định dạng: P. Linh Trung, TP. Thủ Đức",
      });
      return;
    }

    try {
      setLoadingSubmit(true);

      // Upload media lên Cloudinary
      const uploadedUrls = await Promise.all(media.map(uploadToCloudinary));

      const payload = {
        name: roomName,
        address: location,
        price: Number(price),
        description,
        amenities: selectedAmenities,
        ward: wardId,
        location: {
          type: "Point",
          coordinates: [marker.longitude, marker.latitude],
        },
        images: uploadedUrls.filter((u) => !u.endsWith(".mp4")),
        videos: uploadedUrls.filter((u) => u.endsWith(".mp4")),
      };

      console.log("📦 Dữ liệu đăng phòng:", JSON.stringify(payload, null, 2));

      const res = await apiClient.post("/hosts/rooms", payload);
      console.log("✅ Kết quả:", res.data);
      Toast.show({
        type: "success",
        text1: "🎉 Đăng phòng thành công!",
      });
    } catch (err: any) {
      console.log("❌ Lỗi đăng phòng:", err.response?.data || err.message);
      Toast.show({
        type: "error",
        text1: "Đăng phòng thất bại!",
        text2: err.response?.data?.message || "Vui lòng thử lại sau.",
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
