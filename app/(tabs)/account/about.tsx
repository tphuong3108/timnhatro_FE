import React from "react";
import { ScrollView, View, Text } from "react-native";

export default function AboutScreen() {
  return (
    <ScrollView className="flex-1 bg-white px-5 py-6">
      <Text className="text-xl text-center font-semibold text-[#3F72AF] mb-4">
        Giới thiệu ứng dụng
      </Text>

      <Text className="text-gray-600 leading-6">
        Ứng dụng <Text className="font-semibold text-[#3F72AF]">Tìm Nhà Trọ</Text>{" "}
        giúp bạn tìm kiếm, đăng tin và quản lý phòng trọ một cách nhanh chóng,
        tiện lợi và chính xác.
      </Text>

      <Text className="text-gray-600 leading-6 mt-3">
        Với giao diện thân thiện, dễ sử dụng và hệ thống lọc thông minh, chúng
        tôi mong muốn mang lại trải nghiệm tốt nhất cho người thuê trọ và chủ
        trọ.
      </Text>

      <Text className="text-gray-600 leading-6 mt-3">
        Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi qua email{" "}
        <Text className="font-semibold text-[#3F72AF]">
          timnhatro@gmail.com
        </Text>{" "}
        hoặc fanpage chính thức.
      </Text>
    </ScrollView>
  );
}
