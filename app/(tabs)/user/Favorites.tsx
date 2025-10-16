import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PostCard from "@/components/ui/PostCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const mockFavorites = [
        {
          _id: "f1",
          title: "Phòng mini Q3, có gác lửng",
          address: "22 CMT8, Quận 3",
          images: ["https://picsum.photos/200/200?7"],
          content: "Phòng 20m², nội thất cơ bản, giá 3.5 triệu/tháng.",
        },
        {
          _id: "f2",
          title: "Phòng cao cấp view Landmark",
          address: "Vinhome Central Park, Bình Thạnh",
          images: ["https://picsum.photos/200/200?8"],
          content: "Phòng 35m², full tiện nghi, giá 8 triệu/tháng.",
        },
      ];
      setFavorites(mockFavorites);
    } catch {
      Alert.alert("Lỗi", "Không thể tải phòng yêu thích.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading)
    return (
      <View className="py-6 items-center">
        <Text className="text-gray-500">Đang tải...</Text>
      </View>
    );

  if (favorites.length === 0)
    return (
      <View className="py-10 items-center">
        <Ionicons name="heart-outline" size={60} color="#3F72AF" />
        <Text className="text-gray-500 mt-3">Bạn chưa lưu phòng nào</Text>
      </View>
    );

  return (
    <View className="px-4 mt-2">
      <FlatList
        data={favorites}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostCard item={item} isFavorite />}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
}
