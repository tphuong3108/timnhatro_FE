import React from "react";
import { View, Text, ScrollView } from "react-native";

export default function PolicyScreen() {
  return (
    <ScrollView className="flex-1 bg-white px-5 py-6">
      <Text className="text-xl font-semibold text-[#3F72AF] mb-4">
        Chính sách và điều khoản
      </Text>
      <Text className="text-gray-600 leading-6">
        Chúng tôi cam kết bảo mật thông tin người dùng. Khi sử dụng ứng dụng,
        bạn đồng ý với các điều khoản về quyền riêng tư, nội dung đăng tải và
        xử lý dữ liệu theo quy định của chúng tôi.
      </Text>

      <Text className="text-gray-600 leading-6 mt-3">
        Nếu bạn có thắc mắc, vui lòng liên hệ qua email{" "}
        <Text className="font-semibold text-[#3F72AF]">
          hotro@timnhatro.vn
        </Text>.
      </Text>
    </ScrollView>
  );
}
