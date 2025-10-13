import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ImageBackground, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import apiClient from "@/utils/apiClient";
import PostCard from "@/components/ui/PostCard";

export default function MyPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      // Dữ liệu mẫu
      const mockPosts = [
        {
          _id: "p1",
          title: "Phòng trọ Q5, gần ĐH Khoa học Tự nhiên",
          address: "45 Trần Phú, Quận 5",
          images: ["https://picsum.photos/300/300?5"],
          content: "Phòng rộng 25m², có ban công, giá 4 triệu/tháng.",
        },
        {
          _id: "p2",
          title: "Phòng mới xây, sạch đẹp, full nội thất",
          address: "Nguyễn Văn Cừ, Quận 1",
          images: ["https://picsum.photos/300/300?6"],
          content: "Có chỗ để xe, free wifi, an ninh tốt.",
        },
      ];
      setPosts(mockPosts);
    } catch {
      Alert.alert("Lỗi", "Không thể tải bài viết của bạn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white py-6">
        <Text className="text-gray-500">Đang tải...</Text>
      </View>
    );

  if (posts.length === 0)
    return (
      <View className="flex-1 justify-center items-center bg-white py-8">
        <Ionicons name="document-text-outline" size={60} color="#3F72AF" />
        <Text className="text-gray-500 mt-3">Bạn chưa đăng bài nào</Text>
      </View>
    );

    return (
      <View className="w-full bg-[#f9fafb] py-2">
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <PostCard item={item} />}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10, paddingBottom: 50 }}
        />
      </View>
    );
}
