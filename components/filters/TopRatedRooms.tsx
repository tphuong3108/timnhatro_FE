import PostCard from "@/components/ui/PostCard";
import { roomApi } from "@/services/roomApi";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
} from "react-native";

export default function TopRatedRooms() {
  const [topRooms, setTopRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await roomApi.getAllRooms();

      const rooms =
        res?.rooms ||
        res?.data?.rooms ||
        res?.data?.data?.rooms ||
        res?.data?.data ||
        res?.data ||
        [];

      if (!Array.isArray(rooms)) {
        setTopRooms([]);
        return;
      }

      const top = rooms
        .filter((r: any) => r.avgRating >= 4 || r.totalLikes > 3)
        .sort((a: any, b: any) => b.avgRating - a.avgRating)
        .slice(0, 6);

      setTopRooms(top);
    } catch (error) {
      setTopRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopRooms();

    const interval = setInterval(() => {
      fetchTopRooms();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchTopRooms]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-10">
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text className="text-gray-500 mt-2">Đang tải phòng nổi bật...</Text>
      </View>
    );
  }

  if (!topRooms || topRooms.length === 0) {
    return (
      <View className="px-5 items-center">
        <Text className="text-gray-500 text-sm italic mb-3">
          Hiện chưa có phòng nổi bật nào.
        </Text>
      </View>
    );
  }

  // Chia thành các hàng 2 cột
  const rows = [];
  for (let i = 0; i < topRooms.length; i += 2) {
    rows.push(topRooms.slice(i, i + 2));
  }

  return (
    <View>
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          className="flex-row justify-between mb-2"
        >
          {row.map((item) => (
            <PostCard key={item._id} item={item} />
          ))}
          {row.length === 1 && <View style={{ width: '48%' }} />}
        </View>
      ))}
    </View>
  );
}

