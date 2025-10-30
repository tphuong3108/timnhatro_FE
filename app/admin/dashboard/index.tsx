import React, { useEffect, useState } from "react";
import { ScrollView, View, ActivityIndicator, Text } from "react-native";
import LineChartCard from "./LineChartCard";
import PieChartCard from "./PieChartCard";
import StatCard from "./StatCard";
import TopHostsCard from "./TopHostsCard";
import TopView from "./TopView";
import TopRating from "./TopRating"; // ✅ dùng cho popularRooms
import WardBarChart from "./WardBarChart";
import { adminApi } from "@/services/adminApi";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<any>(null);
  const [monthlyUsers, setMonthlyUsers] = useState<any>(null);
  const [topHosts, setTopHosts] = useState<any[]>([]);
  const [topViewedRooms, setTopViewedRooms] = useState<any[]>([]);
  const [popularRooms, setPopularRooms] = useState<any[]>([]); // ✅ Top Rating chính là popularRooms
  const [topAmenities, setTopAmenities] = useState<any[]>([]);
  const [topWards, setTopWards] = useState<any[]>([]);
  const [loginStats, setLoginStats] = useState<any>(null); // ✅ thêm state cho lượt truy cập

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          overviewRes,
          monthlyRes,
          hostsRes,
          viewedRes,
          popularRes,
          amenitiesRes,
          wardsRes,
          loginRes, // ✅ thêm biến nhận kết quả login stats
        ] = await Promise.all([
          adminApi.getOverviewStats(),
          adminApi.getUserMonthlyStats(),
          adminApi.getTopHosts(),
          adminApi.getTopViewedRooms(),
          adminApi.getPopularRooms(), // ✅ dùng cho TopRating
          adminApi.getTopAmenities(),
          adminApi.getTopWards(),
          adminApi.getLoginStats(), // ✅ gọi API lượt truy cập
        ]);

        setOverview(overviewRes);
        setMonthlyUsers(monthlyRes);
        setTopHosts(hostsRes);
        setTopViewedRooms(viewedRes);
        setPopularRooms(popularRes);
        setTopAmenities(amenitiesRes);
        setTopWards(wardsRes);
        setLoginStats(loginRes); // ✅ lưu dữ liệu lượt truy cập
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu admin:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text className="text-[#112D4E] mt-3">Đang tải dữ liệu...</Text>
      </View>
    );

  return (
    <ScrollView
      className="flex-1 bg-[#F9FAFB] px-3 pt-10"
      showsVerticalScrollIndicator={false}
    >
      {/* === Thống kê tổng quan === */}
      {overview && (
        <View className="flex-row flex-wrap justify-between mb-6">
          <StatCard
            icon="person-add"
            label="Người dùng (tuần)"
            value={overview.users}
            change={overview.growth?.users}
          />
          <StatCard
            icon="home"
            label="Phòng mới (tuần)"
            value={overview.rooms}
            change={overview.growth?.rooms}
          />
          <StatCard
            icon="log-in"
            label="Lượt truy cập"
            value={loginStats?.totalLogins || 0} // ✅ hiển thị lượt truy cập
          />
          <StatCard
            icon="eye"
            label="Lượt xem (tuần)"
            value={overview.views}
            change={overview.growth?.views}
          />
        </View>
      )}

      {/* === Biểu đồ người dùng === */}
      {monthlyUsers && (
        <LineChartCard
          title="Tăng trưởng người dùng"
          data={{
            labels: monthlyUsers.thisMonth.map((d: any) => d._id),
            datasets: [
              {
                data: monthlyUsers.thisMonth.map((d: any) => d.count),
                color: () => "#80afe8ff",
              },
              {
                data: monthlyUsers.lastMonth.map((d: any) => d.count),
                color: () => "#e2b0c1ff",
              },
            ],
          }}
        />
      )}

      {/* === Các thống kê khác === */}
      <TopHostsCard data={topHosts} />
      <TopView data={topViewedRooms} />
      <TopRating data={popularRooms} />

      {/* === Top tiện ích === */}
      {topAmenities && topAmenities.length > 0 ? (
        <PieChartCard
          title="Top 5 tiện ích phổ biến"
          data={topAmenities.map((item: any) => ({
            name: item.name,
            value: item.usageCount,
          }))}
        />
      ) : (
        <PieChartCard title="Top 5 tiện ích phổ biến" />
      )}

      {/* === Top khu vực có nhiều phòng nhất === */}
      <WardBarChart data={topWards} />
    </ScrollView>
  );
}
