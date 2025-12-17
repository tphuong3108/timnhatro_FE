import PieChartCard from "@/app/admin/dashboard/PieChartCard";
import StatCard from "@/app/admin/dashboard/StatCard";
import TopView from "@/app/admin/dashboard/TopView";
import WardBarChart from "@/app/admin/dashboard/WardBarChart";
import { hostApi } from "@/services/hostApi";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function HostStatsScreen() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [dailyStats, setDailyStats] = useState<any>(null);
  const [topRooms, setTopRooms] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [overviewRes, dailyRes, topRoomsRes] = await Promise.all([
          hostApi.getOverviewStats(),
          hostApi.getDailyStats(),
          hostApi.getTopViewedRooms(),
        ]);
        setOverview(overviewRes);
        setDailyStats(dailyRes);
        
        // Chuẩn hóa dữ liệu topRooms (xử lý cấu trúc lồng nhau)
        const normalizedRooms = (topRoomsRes || []).map((item: any) => {
          // Nếu dữ liệu có cấu trúc { room: {...}, viewCount: ... }
          if (item.room) {
            return {
              ...item.room,
              viewCount: item.viewCount || item.room.viewCount || 0,
            };
          }
          // Nếu dữ liệu là phòng trực tiếp
          return item;
        });
        setTopRooms(normalizedRooms);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text className="text-[#112D4E] mt-3">Đang tải dữ liệu...</Text>
      </View>
    );

  return (
    <ScrollView
      className="flex-1 bg-[#F9FAFB] px-3 pt-10"
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-2xl font-bold text-center text-[#112D4E] mb-5">
        Bảng thống kê chủ trọ
      </Text>

      {/* ==== Tổng quan ==== */}
      {overview && (
        <View className="flex-row flex-wrap justify-between mb-6">
          <StatCard
            icon="home"
            label="Tổng số phòng"
            value={overview.totalRooms || 0}
          />
          <StatCard
            icon="eye"
            label="Tổng lượt xem"
            value={overview.totalViews || 0}
            change={overview.growth?.views}
          />
          <StatCard
            icon="chatbox-ellipses"
            label="Đánh giá"
            value={overview.totalReviews || 0}
          />
          <StatCard
            icon="calendar"
            label="Phòng trong tuần"
            value={overview.thisWeek?.rooms || 0}
          />
        </View>
      )}

      {/* ==== Biểu đồ tăng trưởng phòng / lượt xem ==== */}
      {overview?.growth && (
        <PieChartCard
          title="Tăng trưởng trong tuần"
          data={[
            { name: "Phòng mới", value: overview.growth.rooms },
            { name: "Lượt xem", value: overview.growth.views },
          ]}
        />
      )}

      {/* ==== Biểu đồ khu vực nếu có ==== */}
      {overview?.topWards && <WardBarChart data={overview.topWards} />}

      {/* ==== Top phòng được xem nhiều ==== */}
      {topRooms && topRooms.length > 0 && <TopView data={topRooms} />}
    </ScrollView>
  );
}
