import React from "react";
import { View, Text, Image, FlatList, useWindowDimensions } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import ChartCardWrapper from "@/components/admin/ChartCardWrapper";

interface Host {
  userId: string;
  fullName: string;
  avatar: string;
  totalRooms: number;
  totalViews: number;
}

export default function TopHostsCard({ data }: { data: Host[] }) {
  const { width } = useWindowDimensions();
  const isSmall = width < 360;

  const displayedData =
    data.length < 5
      ? [
          ...data,
          ...Array(5 - data.length).fill({
            userId: Math.random().toString(),
            fullName: "Chưa có",
            avatar: "https://via.placeholder.com/60x60.png?text=?",
            totalRooms: 0,
            totalViews: 0,
          }),
        ]
      : data.slice(0, 5);

  return (
    <ChartCardWrapper height={isSmall ? 110 : 150} style={{ padding: 15 }}>
      <Text className="text-[16px] font-semibold text-[#112D4E] mb-2">
        Top 5 chủ phòng hoạt động tích cực
      </Text>

      <FlatList
        horizontal
        data={displayedData}
        keyExtractor={(item) => item.userId}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 4,
          paddingHorizontal: 4,
        }}
        renderItem={({ item }) => (
          <View
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
              {item.fullName}
            </Text>

            {/* Nhà + Mắt (phòng + lượt xem) */}
            <View className="flex-row items-center mt-[2px]">
              <Ionicons name="home" size={11} color="#3F72AF" />
              <Text className="text-gray-500 text-[11px] ml-[2px]">
                {item.totalRooms}
              </Text>

              <MaterialCommunityIcons
                name="eye-outline"
                size={11}
                color="#3F72AF"
                style={{ marginLeft: 8 }}
              />
              <Text className="text-gray-400 text-[11px] ml-[2px]">
                {item.totalViews}
              </Text>
            </View>
          </View>
        )}
      />
    </ChartCardWrapper>
  );
}
