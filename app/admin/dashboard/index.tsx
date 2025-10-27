import React from "react";
import { ScrollView, View } from "react-native";
import LineChartCard from "./LineChartCard";
import PieChartCard from "./PieChartCard";
import StatCard from "./StatCard";
import TopHostsCard from "./TopHostsCard";
import TopView from "./TopView";
import TopRating from "./TopRating";
import WardBarChartCard from "./WardBarChart";
import WardBarChart from "./WardBarChart";

export default function AdminDashboard() {
  const overview = {
    users: 156,
    rooms: 7265,
    views: 3671,
    logins: 5890,
    growth: { users: 15.03, rooms: 11.01, views: -0.03, logins: 0.36},
  };

  const monthlyUsers = {
    labels: ["1", "5", "10", "15", "20", "25", "30"],
    datasets: [
      { data: [10, 25, 40, 35, 60, 80, 95], color: () => "#80afe8ff" },
      { data: [5, 15, 30, 28, 50, 65, 70], color: () => "#e2b0c1ff" },
    ],
  };
  const dailyStats = {
    daily: 8,
    weekly: 42,
    monthly: 180,
  };

  const topHosts = [
    {
      userId: "1",
      fullName: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/60",
      totalRooms: 12,
      totalLikes: 230,
      totalViews: 1230,
    },
    {
      userId: "2",
      fullName: "Nguyễn Văn B",
      avatar: "https://i.pravatar.cc/61",
      totalRooms: 10,
      totalLikes: 150,
      totalViews: 890,
    },
  ];

  const popularRooms = [
    {
      name: "Phòng Q.1",
      image: "https://picsum.photos/300",
      address: "TP. HCM",
    },
    {
      name: "Phòng Thủ Đức",
      image: "https://picsum.photos/301",
      address: "TP. HCM",
    },
    {
      name: "Phòng Bình Thạnh",
      image: "https://picsum.photos/302",
      address: "TP. HCM",
    },
    {
      name: "Phòng Gò Vấp",
      image: "https://picsum.photos/303",
      address: "TP. HCM",
    },
    {
      name: "Phòng Tân Bình",
      image: "https://picsum.photos/304",
      address: "TP. HCM",
    },
  ];

  const amenities = [
    { name: "Wifi", value: 87 },
    { name: "Máy lạnh", value: 72 },
    { name: "Giặt đồ", value: 58 },
    { name: "Nhà bếp", value: 41 },
    { name: "Chỗ đậu xe", value: 36 },
  ];


  return (
    <ScrollView
      className="flex-1 bg-[#F9FAFB] px-3 pt-10"
      showsVerticalScrollIndicator={false}
    >
      {/* StatCards */}
      <View className="flex-row flex-wrap justify-between mb-6">
        <StatCard
          icon="person-add"
          label="Người dùng (tuần)"
          value={overview.users}
          change={overview.growth.users}
        />
        <StatCard
          icon="home"
          label="Phòng mới (tuần)"
          value={overview.rooms}
          change={overview.growth.rooms}
        />
        <StatCard icon="log-in" label="Lượt truy cập" value={overview.logins} />
        <StatCard
          icon="eye"
          label="Lượt xem (phòng mới)"
          value={overview.views}
          change={overview.growth.views}
        />
      </View>

      {/* Charts */}
      <LineChartCard title="Số liệu người dùng" data={monthlyUsers} />
      <TopHostsCard data={topHosts} />
      <TopView data={popularRooms} />
      <TopRating data={popularRooms} />
      <PieChartCard title="Top 5 tiện ích phổ biến" data={amenities} />
      <WardBarChart/>
    </ScrollView>
  );
}
