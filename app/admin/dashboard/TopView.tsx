import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import ChartCardWrapper from "@/components/admin/ChartCardWrapper";
import RoomCarousel from "@/app/(tabs)/home/RoomCarousel";

export default function TopView({ data }: any) {
  const { width } = useWindowDimensions();
  const isSmall = width < 360;

  return (
    <ChartCardWrapper
      height={isSmall ? 230 : 270}
      style={{ paddingHorizontal: 12, paddingVertical: 18 }}
    >
      <View className="flex-col">
        <Text className="text-[16px] font-semibold text-[#112D4E] mb-3">
          Phòng có lượt xem cao
        </Text>

        <RoomCarousel />
      </View>
    </ChartCardWrapper>
  );
}
