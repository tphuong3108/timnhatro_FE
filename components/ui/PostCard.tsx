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
}

export default function PostCard({ item, onDeleted }: RoomCardProps) {
  const router = useRouter();
  const imageUri = item.image || item.images?.[0];
  const roomId = item._id || item.id;
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwner = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("⚠️ Không có token, không xác định được chủ sở hữu.");
          return;
        }
        const decoded: any = jwtDecode(token);
        const createdById =
          typeof item.createdBy === "object"
            ? item.createdBy._id
            : item.createdBy;

        console.log("🧩 Kiểm tra quyền sở hữu:");
        console.log("   - decoded:", decoded);
        console.log("   - createdById:", createdById);

        if (decoded.id === createdById || decoded._id === createdById) {
          console.log("✅ Đây là bài đăng của chính user");
          setIsOwner(true);
        } else {
          console.log("🚫 Không phải chủ bài đăng này");
        }
      } catch (err) {
        console.log("❌ Lỗi decode token:", err);
      }
    };
    checkOwner();
  }, [item]);

  const handleEdit = () => {
    console.log("🟢 Bấm SỬA phòng:", roomId);
    router.push(`/room/edit/${roomId}` as any);
  };

  const handleDelete = async () => {
    console.log("🟠 Bấm XÓA phòng:", roomId);

    Alert.alert("🗑️ Xóa phòng", "Bạn có chắc muốn xóa phòng này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
              console.log("❌ Không có token khi xóa phòng");
              Alert.alert("Lỗi", "Bạn cần đăng nhập lại để xóa phòng.");
              return;
            }

            const res = await apiClient.delete(`/hosts/rooms/${roomId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Đã xóa phòng:", res.data);
            Alert.alert("✅ Thành công", "Phòng đã được xóa!");
            onDeleted?.();
          } catch (err: any) {
            console.log("❌ Lỗi khi xóa phòng:", err?.response?.data || err);
            Alert.alert("❌ Lỗi", "Không thể xóa phòng, vui lòng thử lại.");
          }
        },
      },
    ]);
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
      {/* Xem chi tiết phòng */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          console.log("📍 Bấm xem chi tiết:", item.slug);
          router.push(`/room/${item.slug}` as any);
        }}
      >
        <ImageBackground
          source={{ uri: imageUri }}
          resizeMode="cover"
          style={{ height: 220, justifyContent: "flex-end" }}
        >
          <View style={{ backgroundColor: "rgba(0,0,0,0.45)", padding: 8 }}>
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
                {item.name || item.title}
              </Text>

              {isOwner && (
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {/* Sửa */}
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

                  {/* Xóa */}
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

            <Text
              style={{
                color: "#ddd",
                fontSize: 12,
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {item.address || item.distance}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}
