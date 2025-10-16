import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PostCard from "@/components/ui/PostCard";

export default function MyPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
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
      <View className="py-6 items-center">
        <Text className="text-gray-500">Đang tải...</Text>
      </View>
    );

  if (posts.length === 0)
    return (
      <View className="py-10 items-center">
        <Ionicons name="document-text-outline" size={60} color="#3F72AF" />
        <Text className="text-gray-500 mt-3">Bạn chưa đăng bài nào</Text>
      </View>
    );

  return (
    <View className="px-4 mt-2">
      <FlatList
        data={posts}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostCard item={item} />}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
}
