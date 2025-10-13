import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from "react-native";
import apiClient from "@/utils/apiClient";
import { Ionicons } from "@expo/vector-icons";

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
    <View className="w-full mt-2">
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => item._id || item.id || `fav-${index}`}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            className="bg-white border border-gray-200 rounded-2xl mb-4 p-3 flex-row shadow-sm"
          >
            <Image
              source={
                item.images && item.images[0]
                  ? { uri: item.images[0] }
                  : require("@/assets/images/user.png")
              }
              className="w-[90px] h-[90px] rounded-xl mr-3"
            />
            <View className="flex-1 justify-center">
              <Text className="text-gray-800 font-semibold text-base" numberOfLines={1}>
                {item.title || "Phòng chưa có tiêu đề"}
              </Text>
              <Text className="text-gray-500 text-sm mt-1" numberOfLines={2}>
                {item.address || item.content}
              </Text>
            </View>
            <Ionicons name="heart" size={20} color="#ef4444" className="ml-2" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
