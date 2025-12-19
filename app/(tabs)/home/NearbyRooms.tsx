import { roomApi } from "@/services/roomApi";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CARD_WIDTH = 180;
const CARD_HEIGHT = 200;
const SPACING = 12;

export default function NearbyRooms() {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError(" Vui lòng bật quyền truy cập vị trí để xem phòng gần bạn");
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Gọi API lấy phòng gần đây
        const res = await roomApi.getNearbyRooms(latitude, longitude, 15000);

        if (Array.isArray(res) && res.length > 0) {
          setRooms(res.slice(0, 8));
        } else {
          setRooms([]);
        }
      } catch (err) {
        setError("Đã có lỗi xảy ra khi tải dữ liệu phòng gần đây");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  //  Loading UI
  if (loading) {
    return (
      <View className="py-10 items-center">
        <ActivityIndicator size="small" color="#999" />
        <Text className="text-gray-400 mt-2 text-sm">Đang tìm phòng gần bạn...</Text>
      </View>
    );
  }

  //  Lỗi định vị hoặc API
  if (error) {
    return (
      <View className="py-10 items-center">
        <Ionicons name="location-outline" size={28} color="#999" />
        <Text className="text-red-500 text-sm mt-2 text-center px-10">{error}</Text>
      </View>
    );
  }

  //  Không có phòng nào gần đây
  if (!rooms.length) {
    return (
      <View className="py-10 items-center">
        <Ionicons name="home-outline" size={28} color="#999" />
        <Text className="text-gray-400 text-sm mt-2">Không có phòng nào gần bạn.</Text>
      </View>
    );
  }

  //  Hiển thị danh sách phòng
  return (
    <View className="mt-2">
      <Animated.FlatList
        data={rooms}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + SPACING}
        snapToAlignment="center"
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        ItemSeparatorComponent={() => <View style={{ width: SPACING }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            className="rounded-2xl overflow-hidden shadow-md"
            onPress={() => router.push(`/room/${item.slug || item._id}` as any)}
          >
            <ImageBackground
              source={{
                uri: item.images?.[0] || "/logodoc.svg",
              }}
              resizeMode="cover"
              className="w-[180px] h-[200px] justify-end"
            >
              {/* overlay tối nhẹ */}
              <View className="absolute bottom-0 left-0 right-0 h-[80px] bg-black/35" />

              {/* Nội dung thẻ */}
              <View className="p-3 flex-col space-y-1">
                <Text
                  className="text-white font-semibold text-[16px] leading-tight drop-shadow-md"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>

                <Text className="text-gray-200 text-[13px]" numberOfLines={1}>
                  {item.address || item.ward?.name || "—"}
                </Text>

                {/*  Khoảng cách */}
                {item.distance && (
                  <Text className="text-gray-300 text-[13px]">
                    {(item.distance / 1000).toFixed(1)} km
                  </Text>
                )}

                {/*  Tim 👁 */}
                <View className="flex-row items-center mt-1">
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text className="text-gray-100 text-[13px] ml-1">
                    {item.avgRating?.toFixed(1) || 0}
                  </Text>

                  <Ionicons
                    name="heart"
                    size={14}
                    color="#ff9eb3"
                    style={{ marginLeft: 8 }}
                  />
                  <Text className="text-gray-100 text-[13px] ml-1">
                    {item.totalLikes || 0}
                  </Text>

                  <Ionicons
                    name="eye-outline"
                    size={14}
                    color="#9ca3af"
                    style={{ marginLeft: 8 }}
                  />
                  <Text className="text-gray-100 text-[13px] ml-1">
                    {item.viewCount || 0}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
