import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "@/services/apiClient";

export default function useEditRoomLogic(roomId: string) {
  const [roomData, setRoomData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy dữ liệu phòng theo ID
  const fetchRoomData = async () => {
    try {
      console.log("📡 Gọi API lấy dữ liệu phòng:", roomId);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("⚠️ Không có token, không thể fetch room.");
        setError("Bạn cần đăng nhập lại.");
        return;
      }

      const res = await apiClient.get(`/hosts/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data || res.data;
      console.log("✅ API trả về:", data);

      if (!data) {
        console.log("⚠️ Không có dữ liệu phòng trả về từ API");
        setRoomData(null);
        return;
      }

      // 🔧 Chuẩn hóa dữ liệu để tránh lỗi .map(undefined)
      const normalizedData = {
        ...data,
        images: Array.isArray(data.images) ? data.images : [],
        videos: Array.isArray(data.videos) ? data.videos : [],
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        coordinates:
          data.coordinates ||
          data.location?.coordinates || { latitude: 0, longitude: 0 },
      };

      console.log("🧩 Dữ liệu sau chuẩn hóa:", normalizedData);

      setRoomData(normalizedData);
      setError(null);
    } catch (err: any) {
      console.log("❌ Lỗi khi fetch room:", err?.response?.data || err);
      setError("Không thể tải dữ liệu phòng.");
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetch khi roomId thay đổi
  useEffect(() => {
    if (roomId) {
      console.log("🚀 useEffect chạy với roomId:", roomId);
      fetchRoomData();
    } else {
      console.log("⚠️ roomId rỗng, không fetch.");
    }
  }, [roomId]);

  // Hàm cập nhật phòng
  const handleUpdateRoom = async (updatedData: any) => {
    try {
      console.log("📤 Gửi dữ liệu cập nhật:", updatedData);
      const token = await AsyncStorage.getItem("token");

      if (!token) throw new Error("Chưa đăng nhập");

      const formData = new FormData();

      Object.entries(updatedData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v, index) => {
            if (typeof v === "object" && v?.uri) {
              formData.append(`${key}[${index}]`, {
                uri: v.uri,
                type: v.type || "image/jpeg",
                name: v.fileName || `media_${index}.jpg`,
              } as any);
            } else {
              formData.append(`${key}[${index}]`, v);
            }
          });
        } else {
          formData.append(key, String(value));
        }
      });

      const res = await apiClient.patch(`/hosts/rooms/${roomId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Cập nhật thành công:", res.data);
      return { success: true, data: res.data };
    } catch (err: any) {
      console.log("❌ Lỗi khi cập nhật phòng:", err?.response?.data || err);
      return { success: false, error: err };
    }
  };

  return { roomData, setRoomData, loading, error, handleUpdateRoom };
}
