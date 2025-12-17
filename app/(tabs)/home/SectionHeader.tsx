import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
  hideViewAll?: boolean;
  viewAllText?: string;
}

export default function SectionHeader({ 
  title, 
  onViewAll, 
  hideViewAll = false,
  viewAllText = "Xem tất cả"
}: SectionHeaderProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      router.push("/room" as any);
    }
  };

  return (
    <View className="flex-row justify-between items-center mb-2 px-1">
      <Text
        className="font-bold text-[#3F72AF]"
        style={{ fontSize: width > 400 ? 18 : 16 }}
      >
        {title}
      </Text>

      {!hideViewAll && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handlePress}
        >
          <Text
            className="text-[#3F72AF] font-medium"
            style={{ fontSize: width > 400 ? 14 : 12 }}
          >
            {viewAllText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

