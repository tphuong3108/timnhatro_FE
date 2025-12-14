import React, { useEffect, useState, useRef } from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { roomApi } from "@/services/roomApi";

const CARD_WIDTH = 180;
const CARD_HEIGHT = 200;
const SPACING = 12;

export default function RoomCarousel({ rooms: propRooms = [] }: any) {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [rooms, setRooms] = useState<any[]>(propRooms);
  const [loading, setLoading] = useState(!propRooms || propRooms.length === 0);

  useEffect(() => {
    if (propRooms && propRooms.length > 0) {
      setRooms(propRooms);
      setLoading(false);
      return;
    }

    const fetchHotRooms = async () => {
      try {
        const res = await roomApi.getHotRooms();
        setRooms((res || []).slice(0, 10));
      } catch (error) {
        console.error("❌ Lỗi khi tải phòng nổi bật:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHotRooms();
  }, [propRooms]);

  if (loading) {
    return (
      <View className="py-8 items-center">
        <Text className="text-gray-400 text-sm">Đang tải phòng...</Text>
      </View>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <View className="py-8 items-center">
        <Text className="text-gray-400 text-sm">Không có phòng hiển thị.</Text>
      </View>
    );
  }

  return (
    <View className="mt-2">
      <Animated.FlatList
        data={rooms}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + SPACING}
        snapToAlignment="center"
        keyExtractor={(item) => item._id || item.roomId}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ItemSeparatorComponent={() => <View style={{ width: SPACING }} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + SPACING),
            index * (CARD_WIDTH + SPACING),
            (index + 1) * (CARD_WIDTH + SPACING),
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.95, 1, 0.95],
            extrapolate: "clamp",
          });

          const imageUri = item.image || item.images?.[0] || "/logodoc.svg";
            // "https://via.placeholder.com/300x200.png?text=No+Image";

          return (
            <Animated.View
              className="rounded-2xl overflow-hidden"
              style={{
                transform: [{ scale }],
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                className="flex-1 rounded-2xl overflow-hidden shadow-md"
                onPress={() =>
                  router.push(`/room/${item.slug || item.roomId || item._id}`)
                }
              >
                <ImageBackground
                  source={{ uri: imageUri }}
                  resizeMode="cover"
                  className="flex-1 justify-end"
                >
                  {/* Overlay mờ dưới */}
                  <View className="absolute bottom-0 left-0 right-0 h-[80px] bg-black/35" />

                  <View className="p-3 flex-col space-y-1">
                    {/* 🔹 Tên phòng */}
                    <Text
                      className="text-white font-semibold text-[15px] leading-tight drop-shadow-md"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.name}
                    </Text>

                    {/* 🔹 Địa chỉ */}
                    <Text
                      className="text-gray-200 text-[12px]"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.address || "—"}
                    </Text>

                    {/* 🔹 Thông tin thống kê */}
                    <View className="flex-row items-center justify-start mt-1">
                      <View className="flex-row items-center mr-3">
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text className="text-gray-100 text-[12px] ml-1">
                          {item.avgRating?.toFixed(1) || 0}
                        </Text>
                      </View>

                      <View className="flex-row items-center mr-3">
                        <Ionicons name="heart-outline" size={14} color="#ff9eb3" />
                        <Text className="text-gray-100 text-[12px] ml-1">
                          {item.totalLikes || 0}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <Ionicons name="eye-outline" size={14} color="#9ca3af" />
                        <Text className="text-gray-100 text-[12px] ml-1">
                          {item.viewCount || 0}
                        </Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}
