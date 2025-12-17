import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Dimensions, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 380;

const services = [
  {
    icon: "search-outline",
    type: "Ionicons",
    title: "Tìm phòng nhanh",
    description: "Tìm kiếm phòng trọ phù hợp chỉ trong vài phút.",
  },
  {
    icon: "shield-checkmark-outline",
    type: "Ionicons",
    title: "Xác thực an toàn",
    description: "Thông tin được xác thực để bạn yên tâm.",
  },
  {
    icon: "chatbubbles-outline",
    type: "Ionicons",
    title: "Liên hệ trực tiếp",
    description: "Chat trực tiếp với chủ trọ nhanh chóng.",
  },
  {
    icon: "sparkles-outline",
    type: "Ionicons",
    title: "AI hỗ trợ",
    description: "Trợ lý AI giúp bạn tìm phòng thông minh.",
  },
];

export default function ServicesSection() {
  return (
    <View className="mt-2">
      {/* Header */}
      <View className="mb-4 px-1">
        <Text 
          className="text-[#3F72AF] font-bold mb-1"
          style={{ fontSize: width > 400 ? 18 : 16 }}
        >
          Dịch vụ của chúng tôi
        </Text>
        <Text 
          className="text-[#112D4E] font-bold"
          style={{ fontSize: isSmallScreen ? 20 : 24 }}
        >
          Khám phá, kết nối và trải nghiệm
        </Text>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {services.map((service, index) => (
          <View
            key={index}
            className="bg-[#F9FAFB] rounded-2xl p-4 mb-3"
            style={{
              width: "48%",
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            {/* Icon */}
            <View className="w-11 h-11 bg-[#E8F0FE] rounded-xl items-center justify-center mb-3">
              {service.type === "Ionicons" ? (
                <Ionicons name={service.icon as any} size={24} color="#3F72AF" />
              ) : (
                <MaterialCommunityIcons name={service.icon as any} size={24} color="#3F72AF" />
              )}
            </View>

            {/* Title */}
            <Text 
              className="text-[#112D4E] font-bold mb-1"
              style={{ fontSize: isSmallScreen ? 15 : 16 }}
            >
              {service.title}
            </Text>

            {/* Description */}
            <Text 
              className="text-gray-500 leading-5"
              style={{ fontSize: isSmallScreen ? 12 : 13 }}
            >
              {service.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

