import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Edit3, Trash2 } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import apiClient from "@/services/apiClient";

interface RoomCardProps {
  item: {
    slug?: string;
    id?: string;
    _id?: string;
    title?: string;
    name?: string;
    address?: string;
    distance?: string;
    image?: string;
    images?: string[];
    createdBy?: { _id: string } | string;
  };
  onDeleted?: () => void;
  showActions?: boolean;
}

export default function PostCard({ item, onDeleted }: RoomCardProps) {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);

  // 🧠 Xác định ảnh hiển thị và ID phòng
  const imageUri =
    item.image ||
    item.images?.[0] ||
    "https://placehold.co/300x200?text=No+Image";
  const roomId = item._id || item.id;
  const slugOrId = item.slug || roomId;

  // 🧩 Kiểm tra quyền sở hữu phòng
  useEffect(() => {
    const checkOwner = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const decoded: any = jwtDecode(token);
        const createdById =
          typeof item.createdBy === "object"
            ? item.createdBy._id
            : item.createdBy;

        if (decoded.id === createdById || decoded._id === createdById) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      } catch (err) {
        console.log("❌ Lỗi decode token:", err);
      }
    };
    checkOwner();
  }, [item]);

  // ✏️ Xử lý khi bấm sửa
  const handleEdit = () => {
    if (!roomId)
      return Alert.alert("Lỗi", "Không tìm thấy ID phòng để chỉnh sửa.");
    router.push(`/(tabs)/room/edit/${roomId}`);
  };

  // 🗑️ Xử lý khi bấm xóa
  const handleDelete = async () => {
    if (!roomId)
      return Alert.alert("Lỗi", "Không tìm thấy ID phòng để xóa.");

    Alert.alert("🗑️ Xóa phòng", "Bạn có chắc muốn xóa phòng này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
              Alert.alert("Lỗi", "Vui lòng đăng nhập lại để xóa phòng.");
              return;
            }

            await apiClient.delete(`/hosts/rooms/${roomId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            Alert.alert("✅ Thành công", "Phòng đã được xóa!");
            onDeleted?.();
          } catch (err: any) {
            console.log("❌ Lỗi xóa phòng:", err?.response?.data || err);
            Alert.alert("Lỗi", "Không thể xóa phòng, vui lòng thử lại.");
          }
        },
      },
    ]);
  };

  // 🧭 Xử lý khi bấm xem chi tiết
  const handleViewDetail = () => {
    if (!slugOrId)
      return Alert.alert("Lỗi", "Không tìm thấy phòng để xem chi tiết.");
    router.push(`/room/${slugOrId}`);
  };

  return (
    <View
      style={{
        width: "48%",
        borderRadius: 16,
        marginBottom: 14,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: "hidden",
      }}
    >
      {/* 🖼️ Xem chi tiết phòng */}
      <TouchableOpacity activeOpacity={0.9} onPress={handleViewDetail}>
        <ImageBackground
          source={{ uri: imageUri }}
          resizeMode="cover"
          style={{ height: 220, justifyContent: "flex-end" }}
        >
          <View style={{ backgroundColor: "rgba(0,0,0,0.45)", padding: 8 }}>
            {/* 🌟 Tên & nút hành động */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: 14,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {item.name || item.title || "Phòng chưa có tên"}
              </Text>

              {isOwner && (
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {/* ✏️ Sửa */}
                  <TouchableOpacity
                    onPress={handleEdit}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.25)",
                      padding: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Edit3 size={16} color="#fff" />
                  </TouchableOpacity>

                  {/* 🗑️ Xóa */}
                  <TouchableOpacity
                    onPress={handleDelete}
                    style={{
                      backgroundColor: "rgba(255,0,0,0.35)",
                      padding: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Trash2 size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* 📍 Địa chỉ */}
            <Text
              style={{
                color: "#ddd",
                fontSize: 12,
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {item.address || item.distance || "Chưa có địa chỉ"}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}
