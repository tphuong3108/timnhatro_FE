import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ImageBackground, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import apiClient from "@/utils/apiClient";

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
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingBottom: 30,
          paddingTop: 6,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            className="bg-white rounded-2xl mb-4 shadow-md flex-row overflow-hidden"
            style={{
              elevation: 2,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 5,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            {/* Ảnh phòng */}
            <ImageBackground
              source={{ uri: item.images?.[0] }}
              resizeMode="cover"
              className="w-[100px] h-[100px] justify-end"
              imageStyle={{ borderRadius: 16 }}
            >
              <View className="absolute inset-0 bg-black/10 rounded-2xl" />
            </ImageBackground>

            {/* Thông tin phòng */}
            <View className="flex-1 p-3 justify-center">
              <Text
                className="text-gray-800 font-semibold"
                numberOfLines={1}
                style={{ fontSize: 15, lineHeight: 20 }}
              >
                {item.title}
              </Text>
              <Text
                className="text-gray-500 mt-1"
                numberOfLines={2}
                style={{ fontSize: 13, lineHeight: 18 }}
              >
                {item.address || item.content}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
