import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, ActivityIndicator, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { hostApi } from "@/services/hostApi";
import { BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function HostStatsScreen() {
  const [overview, setOverview] = useState<any>(null);
  const [dailyStats, setDailyStats] = useState<any>(null);
  const [topRooms, setTopRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        setTopRooms(topRoomsRes);
      } catch (err) {
        console.log("❌ Lỗi tải thống kê:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator color="#3F72AF" size="large" />
        <Text className="text-gray-500 mt-3">Đang tải thống kê...</Text>
      </View>
    );

  // ✅ Khai báo các biến để tránh lỗi
  const roomsGrowth = Math.max(overview?.growth?.rooms || 0, 0);
  const viewsGrowth = Math.max(overview?.growth?.views || 0, 0);
  const total = roomsGrowth + viewsGrowth;

  return (
    <ScrollView className="flex-1 bg-white px-5 py-6">
      <Text className="text-2xl font-bold text-center text-[#3F72AF] mb-5">
        Thống kê chủ trọ
      </Text>

      {/* Tổng quan */}
      {overview && (
        <View className="bg-[#E8F0FE] p-4 rounded-2xl mb-5">
          <Text className="font-semibold text-[#1E4F91] mb-2">📊 Tổng quan</Text>
          <Text className="text-gray-700">
            Tổng số phòng: {overview.totalRooms}
          </Text>
          <Text className="text-gray-700">
            Tổng số đánh giá: {overview.totalReviews}
          </Text>
          <Text className="mt-3 text-[#3F72AF] font-medium">
            Tuần này: {overview.thisWeek.rooms} phòng,{" "}
            {overview.thisWeek.views} lượt xem
          </Text>
        </View>
      )}

      {/* Biểu đồ số phòng đăng */}
      {dailyStats && (
        <View className="bg-[#F8FAFC] p-4 rounded-2xl mb-7">
          <Text className="font-semibold text-[#1E4F91] mb-3">
            📆 Số phòng đăng gần đây
          </Text>

          <BarChart
            data={{
              labels: ["Hôm nay", "7 ngày", "30 ngày"],
              datasets: [
                {
                  data: [
                    dailyStats.daily || 0,
                    dailyStats.weekly || 0,
                    dailyStats.monthly || 0,
                  ],
                },
              ],
            }}
            width={screenWidth - 40}
            height={200}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            chartConfig={{
              backgroundGradientFrom: "#E8F0FE",
              backgroundGradientTo: "#E8F0FE",
              color: (opacity = 1) => `rgba(63, 114, 175, ${opacity})`,
              labelColor: () => "#1E4F91",
              barPercentage: 0.6,
              propsForLabels: { fontSize: 12 },
            }}
            style={{
              borderRadius: 16,
              alignSelf: "center",
            }}
          />
        </View>
      )}

      {/* Biểu đồ tăng trưởng tuần */}
      {overview && (
        <View className="bg-[#E8F0FE] p-4 rounded-2xl mb-7">
          <Text className="font-semibold text-[#1E4F91] mb-3">
            📈 Tăng trưởng tuần này
          </Text>

          {total > 0 ? (
            <PieChart
              data={[
                {
                  name: "Phòng",
                  population: roomsGrowth,
                  color: "#3F72AF",
                  legendFontColor: "#333",
                  legendFontSize: 13,
                },
                {
                  name: "Lượt xem",
                  population: viewsGrowth,
                  color: "#F9A826",
                  legendFontColor: "#333",
                  legendFontSize: 13,
                },
              ]}
              width={screenWidth - 40}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(63, 114, 175, ${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
          ) : (
            <View className="h-[200px] items-center justify-center">
              <Ionicons name="pie-chart-outline" size={40} color="#3F72AF" />
              <Text className="text-gray-600 mt-2 text-[14px]">
                Chưa có dữ liệu tăng trưởng
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Top phòng được xem nhiều */}
      {topRooms.length > 0 && (
        <View className="bg-[#F0F7FF] p-4 rounded-2xl">
          <Text className="font-semibold text-[#1E4F91] mb-3">
            🔝 Top phòng được xem nhiều nhất
          </Text>
          {topRooms.map((r, i) => (
            <View
              key={r._id}
              className="mb-2 border-b border-gray-200 pb-2 flex-row items-center"
            >
              <Ionicons name="home-outline" size={18} color="#3F72AF" />
              <View className="ml-2">
                <Text className="font-medium text-[#3F72AF]">
                  {i + 1}. {r.name}
                </Text>
                <Text className="text-gray-600 text-[13px]">
                  👁️ {r.viewCount} lượt xem | ❤️ {r.totalLikes} lượt thích
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
