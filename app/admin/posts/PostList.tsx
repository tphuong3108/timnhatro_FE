import { roomApi } from "@/services/roomApi";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import PostCard from "./PostCard";

export default function PostList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingPosts = async () => {
      try {
        const res = await roomApi.getAllRooms({ status: "pending" });
        setPosts(res.rooms || []);
      } catch (error) {
        console.error("❌ Lỗi khi tải bài đăng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingPosts();
  }, []);

  // ✅ Duyệt bài đăng
  const handleApprove = async (id: string) => {
    try {
      await roomApi.approveRoom(id);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, status: "approved" } : p
        )
      );
    } catch (error) {
      console.error("❌ Lỗi khi duyệt bài:", error);
    }
  };

  // 🗑️ Xóa mềm bài đăng (hiển thị alert xác nhận)
  const handleDelete = async (id: string) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc muốn xóa bài đăng này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await roomApi.deleteRoom(id);
              setPosts((prev) => prev.filter((p) => p._id !== id));
            } catch (error) {
              console.error("❌ Lỗi khi xóa phòng:", error);
            }
          },
        },
      ]
    );
  };

  if (loading)
    return (
      <View className="flex-1 justify-center items-center py-20">
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text className="text-gray-500 mt-3">Đang tải bài đăng...</Text>
      </View>
    );

  const pendingPosts = posts.filter((p) => p.status === "pending");

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text className="text-[18px] font-semibold text-[#112D4E] mb-4">
        Bài đăng chờ duyệt ({pendingPosts.length})
      </Text>

      {pendingPosts.length === 0 ? (
        <Text className="text-gray-400 text-center mt-5">
          Không có bài đăng chờ duyệt.
        </Text>
      ) : (
        pendingPosts.map((post) => (
          <PostCard
            key={post._id}
            post={{
              id: post._id,
              name: post.name,
              address: post.address,
              image: post.images?.[0],
              createdAt: new Date(post.createdAt).toLocaleDateString("vi-VN"),
              host: {
                name: post.createdBy?.fullName || "Chủ phòng",
                avatar:
                  post.createdBy?.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              },
              status: post.status,
            }}
            onApprove={() => handleApprove(post._id)}
            onDelete={() => handleDelete(post._id)}
          />
        ))
      )}
    </ScrollView>
  );
}
