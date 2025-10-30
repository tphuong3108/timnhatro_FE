import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";

export function SheetHeader({
  total,
  panHandlers,
  onCollapse,
}: {
  total: number;
  panHandlers: any;
  onCollapse: () => void;
}) {
  return (
    <>
      <Animated.View {...panHandlers} className="h-6 justify-center items-center">
        <View className="h-1.5 w-10 bg-gray-300 rounded-full" />
      </Animated.View>

      <View className="px-5 flex-row justify-between items-center mb-3">
        <Text className="text-[#3F72AF] font-semibold text-lg">
          {total} chỗ ở trong khu vực này
        </Text>
      </View>
    </>
  );
}
