import React, { useEffect, useState } from "react";
import { Alert, ScrollView, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import apiClient from "@/services/apiClient";
import MyPosts from "@/components/user/MyPosts";
import { useRouter } from "expo-router";

export default function MyPostsScreen() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchMyRooms = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${apiClient.defaults.baseURL}/hosts/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRooms(data.data?.rooms || []);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Không thể tải danh sách phòng!",
      });
    }
  };

  useEffect(() => {
    fetchMyRooms();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/room/edit/${id}`);
  };

  // 🗑️ Xóa phòng
  const handleDelete = (id: string) => {
    Alert.alert("Xóa phòng", "Bạn có chắc muốn xóa phòng này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${apiClient.defaults.baseURL}/hosts/rooms/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (res.ok) {
              setRooms((prev) => prev.filter((r) => r._id !== id));
              Toast.show({
                type: "success",
                text1: "✅ Đã xóa phòng thành công!",
              });
            } else {
              Toast.show({
                type: "error",
                text1: "Lỗi xóa phòng!",
                text2: data.message,
              });
            }
          } catch (err) {
            Toast.show({
              type: "error",
              text1: "Không thể xóa phòng!",
            });
          }
        },
      },
    ]);
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchMyRooms} />
      }
    >
      <MyPosts
        rooms={rooms}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </ScrollView>
  );
}
