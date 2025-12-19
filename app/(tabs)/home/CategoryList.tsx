import { roomApi } from "@/services/roomApi";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, ImageBackground, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 4.5;

export default function CategoryList() {
  const router = useRouter();
  const [topRooms, setTopRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopRooms = useCallback(async () => {
    try {
      setLoading(true);
      // Dùng getHotRooms giống RoomCarousel
      const res = await roomApi.getHotRooms();
      setTopRooms((res || []).slice(0, 7));
    } catch (error) {
      setTopRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopRooms();
  }, [fetchTopRooms]);

  const handleRoomPress = (item: any) => {
    const roomId = item.slug || item._id;
    router.push(`/(tabs)/room/${roomId}`);
  };

  if (loading) {
    return (
      <View className="flex-row justify-center items-center py-4">
        <ActivityIndicator size="small" color="#3F72AF" />
      </View>
    );
  }

  if (!topRooms || topRooms.length === 0) {
    return (
      <View className="px-5 items-center py-4">
        <Text className="text-gray-500 text-sm italic">
          Chưa có phòng xu hướng
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={topRooms}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => `${item._id || item.roomId || 'room'}-${index}`}
      contentContainerStyle={{
        paddingVertical: 8,
      }}
      renderItem={({ item }) => {
        // Giống RoomCarousel: check cả image và images
        const imageUrl = item.image || item.images?.[0] || "https://via.placeholder.com/150";
        const title = item.name || "Phòng trọ";

        return (
          <TouchableOpacity 
            onPress={() => handleRoomPress(item)}
            className="items-center mx-1.5" 
            style={{ width: CARD_WIDTH }}
          >
            <ImageBackground
              source={{ uri: imageUrl }}
              resizeMode="cover"
              className="w-[80px] h-[80px] rounded-2xl overflow-hidden shadow-sm justify-end"
              imageStyle={{ borderRadius: 16 }}
            >
              <View className="absolute inset-0 bg-black/10 rounded-2xl" />
            </ImageBackground>

            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-center text-gray-700 font-medium mt-1"
              style={{
                fontSize: width > 400 ? 14 : 13,
                lineHeight: 18,
                maxWidth: CARD_WIDTH * 0.95,
              }}
            >
              {title}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}
