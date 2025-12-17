import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 380;

export default function SloganSection() {
  return (
    <View 
      className="items-center bg-[#E8F0FE] -mx-6 -mb-8"
      style={{ paddingVertical: 40, paddingHorizontal: 24 }}
    >
      <Ionicons name="heart" size={36} color="#3F72AF" />
      <Text 
        className="text-[#112D4E] font-bold text-center mt-4"
        style={{ fontSize: isSmallScreen ? 20 : 24 }}
      >
        Tìm phòng dễ dàng{"\n"}An cư lạc nghiệp
      </Text>
      <Text 
        className="text-gray-600 text-center mt-3"
        style={{ fontSize: isSmallScreen ? 14 : 15 }}
      >
        Chúng tôi giúp bạn tìm được nơi ở lý tưởng{"\n"}với chi phí hợp lý nhất
      </Text>
    </View>
  );
}
