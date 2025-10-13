import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator, Alert } from "react-native";
import CoverSection from "./CoverSection";
import InfoSection from "./InfoSection";
import MyPosts from "./MyPosts";
import AccountActions from "./AccountActions";
import apiClient from "@/utils/apiClient";
import ActionButtons from "./ActionButtons";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // const fetchProfile = async () => {
  //   try {
  //     const res = await apiClient.get("/users/profile");
  //     setUser(res.data.user || res.data);
  //   } catch {
  //     Alert.alert("Lỗi", "Không thể tải hồ sơ người dùng.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const fetchProfile = async () => {
  try {
    const mockUser = {
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0987654321",
      avatar: "https://i.pravatar.cc/150?img=3",
      role: "Người thuê trọ",
      sharedRooms: [
        {
          _id: "r1",
          title: "Phòng trọ trung tâm Q1, gần Bùi Viện",
          address: "123 Nguyễn Thái Học, Quận 1, TP.HCM",
          images: ["https://picsum.photos/200/200?1"],
          content: "Phòng sạch sẽ, có máy lạnh, toilet riêng.",
        },
        {
          _id: "r2",
          title: "Phòng giá rẻ Q7, full nội thất",
          address: "88 Lê Văn Lương, Quận 7",
          images: ["https://picsum.photos/200/200?2"],
          content: "Có máy giặt, wifi miễn phí, gần ĐH Tôn Đức Thắng.",
        },
      ],
      favorites: [
        {
          _id: "f1",
          title: "Phòng mini Q3, có gác lửng",
          address: "22 Cách Mạng Tháng 8, Quận 3",
          images: ["https://picsum.photos/200/200?3"],
          content: "Phòng 20m², nội thất cơ bản, giá 3.5 triệu/tháng.",
        },
        {
          _id: "f2",
          title: "Phòng cao cấp view Landmark",
          address: "Vinhome Central Park, Bình Thạnh",
          images: ["https://picsum.photos/200/200?4"],
          content: "Phòng 35m², full tiện nghi, giá 8 triệu/tháng.",
        },
      ],
    };
    setUser(mockUser);
  } catch {
    Alert.alert("Lỗi", "Không thể tải hồ sơ người dùng.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3F72AF" />
      </View>
    );

  return (
    <ScrollView
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
    <CoverSection user={user} />
      <View className="w-full max-w-[700px] self-center px-5">
        <InfoSection user={user} />
        <View className="mt-6">
          <ActionButtons />
        </View>
        <View className="mt-6">
          <MyPosts />
        </View>
        <View className="mt-8">
          <AccountActions />
        </View>
      </View>
    </ScrollView>
  );
}
