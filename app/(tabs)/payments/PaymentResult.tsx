import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useCheckPaymentStatus } from "../../../hooks/useCheckPaymentStatus";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentResultScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const { paymentStatus, paymentInfo, checkStatus } = useCheckPaymentStatus();

  useEffect(() => {
    if (orderId) checkStatus(orderId.toString());
  }, [orderId,checkStatus]);

  const renderContent = () => {
    if (paymentStatus === "idle")
      return <Text className="text-lg text-gray-600">Đang chờ thanh toán...</Text>;

    if (paymentStatus === "pending")
      return <ActivityIndicator size="large" />;

    if (paymentStatus === "success") {
      return (
        <Animated.View
          entering={FadeIn}
          className="items-center bg-white p-6 rounded-2xl shadow-lg w-11/12"
        >
          <Animated.View entering={ZoomIn.delay(100)}>
            <Ionicons name="checkmark-circle" size={90} color="#2ecc71" />
          </Animated.View>

          <Text className="text-2xl font-bold text-green-600 mt-4">
            Thanh toán thành công!
          </Text>

          <View className="mt-4 space-y-1">
            <Text className="text-gray-700">
              Số tiền:{" "}
              <Text className="font-semibold">
                {paymentInfo?.amount.toLocaleString()} VND
              </Text>
            </Text>
            <Text className="text-gray-700">
              Loại: <Text className="font-semibold">{paymentInfo?.type}</Text>
            </Text>
            
          </View>

          <TouchableOpacity
            onPress={() => router.push("/home")}
            className="mt-6 bg-green-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold text-lg">
              Quay về trang chủ
            </Text>
          </TouchableOpacity>
        </Animated.View>
      );
    }

    if (paymentStatus === "failed") {
      return (
        <Animated.View
          entering={FadeIn}
          className="items-center bg-white p-6 rounded-2xl shadow-lg w-11/12"
        >
          <Animated.View entering={ZoomIn.delay(100)}>
            <Ionicons name="close-circle" size={90} color="#e74c3c" />
          </Animated.View>

          <Text className="text-2xl font-bold text-red-600 mt-4">
            Thanh toán thất bại
          </Text>

          <Text className="text-gray-700 mt-2">
            Vui lòng thử lại hoặc kiểm tra thông tin thanh toán.
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/")}
            className="mt-6 bg-red-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold text-lg">
              Quay về trang chủ
            </Text>
          </TouchableOpacity>
        </Animated.View>
      );
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-4">
      {renderContent()}
    </View>
  );
}
