import ChartCardWrapper from "@/components/admin/ChartCardWrapper";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";

interface Host {
  userId: string;
  fullName: string;
  avatar?: string;
  totalRooms: number;
  totalViews: number;
}

export default function TopHostsCard({ data }: { data: Host[] }) {
  const { width } = useWindowDimensions();
  const isSmall = width < 360;
  const router = useRouter();

  //  Nếu không có data thì hiển thị "Chưa có dữ liệu"
  if (!data || data.length === 0) {
    return (
      <ChartCardWrapper height={110} style={{ padding: 15 }}>
        <Text className="text-[16px] font-semibold text-[#112D4E] mb-2">
          Top 5 chủ phòng hoạt động tích cực
        </Text>
        <Text className="text-gray-400 text-[13px]">Chưa có dữ liệu</Text>
      </ChartCardWrapper>
    );
  }

  //  Luôn hiển thị những host có sẵn (tối đa 5)
  const displayedData = data
    .slice(0, 5)
    .map((item) => ({
      ...item,
      avatar:
        item.avatar && item.avatar.trim() !== ""
          ? item.avatar
          : "https://cdn-icons-png.flaticon.com/512/149/149071.png", // avatar giả
    }));

  const handleHostPress = (userId: string) => {
    if (userId) {
      router.push(`/(tabs)/user/${userId}`);
    }
  };

  return (
    <ChartCardWrapper height={isSmall ? 110 : 150} style={{ padding: 15 }}>
      <Text className="text-[16px] font-semibold text-[#112D4E] mb-2">
        Top 5 chủ phòng hoạt động tích cực
      </Text>

      <FlatList
        horizontal
        data={displayedData}
        keyExtractor={(item, index) => item.userId || `host-${index}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 4,
          paddingHorizontal: 4,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleHostPress(item.userId)}
            className={`items-center ${
              isSmall ? "mr-[10px] w-[80px]" : "mr-[14px] w-[90px]"
            }`}
          >
            {/* Avatar */}
            <Image
              source={{ uri: item.avatar }}
              className={`rounded-full mb-1 ${
                isSmall ? "w-[46px] h-[46px]" : "w-[58px] h-[58px]"
              }`}
            />

            {/* Tên */}
            <Text
              className={`text-[#112D4E] font-semibold text-center ${
                isSmall ? "text-[12px]" : "text-[13px]"
              }`}
              numberOfLines={1}
            >
              {item.fullName || "Chưa có tên"}
            </Text>

            {/* Nhà + Mắt */}
            <View className="flex-row items-center mt-[2px]">
              <Ionicons name="home" size={11} color="#3F72AF" />
              <Text className="text-gray-500 text-[11px] ml-[2px]">
                {item.totalRooms || 0}
              </Text>

              <MaterialCommunityIcons
                name="eye-outline"
                size={11}
                color="#3F72AF"
                style={{ marginLeft: 8 }}
              />
              <Text className="text-gray-400 text-[11px] ml-[2px]">
                {item.totalViews || 0}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </ChartCardWrapper>
  );
}

