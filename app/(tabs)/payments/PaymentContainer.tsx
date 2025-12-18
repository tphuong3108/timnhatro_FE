import { usePaymentPremium } from "@/components/payments/PaymentPremium";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useCheckPaymentStatus } from "../../../hooks/useCheckPaymentStatus";

export default function PaymentContainer() {
  const params = useLocalSearchParams();
  const roomId = params.roomId as string;

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { orderId, setOrderId, paymentStatus, checkStatus } = useCheckPaymentStatus();

  const premium = usePaymentPremium(roomId);
  
  useEffect(() => {
    if ((paymentStatus === "success" || paymentStatus === "failed") && orderId) {
      router.push({
        pathname: "./PaymentResult",
        params: { orderId },
      });
    }
  }, [paymentStatus, orderId, router]);

  const handleSubmit = async () => {
    setLoading(true);

    // handlePremiumPayment sẽ mở browser và đợi user đóng, sau đó return orderId
    const oid = await premium.handlePremiumPayment();
    
    if (oid) {
      setOrderId(oid);
      // Check status ngay sau khi browser đóng
      await checkStatus(oid);
    }

    setLoading(false);
  };

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <View className="px-5 py-4">
        <Text className="text-2xl font-semibold text-[#3F72AF] text-center">
          Thanh toán Premium
        </Text>
        <View className="bg-gray-50 rounded-2xl p-4 mt-6 mb-6">
          <Text className="text-[#3F72AF] font-semibold mb-2">Chọn gói Premium</Text>
          {premium.premiumPackages.map((pkg) => (
            <TouchableOpacity
              key={pkg.days}
              onPress={() => premium.setSelectedPackage(pkg.days)}
              className={`p-4 rounded-xl mb-3 border ${
                premium.selectedPackage === pkg.days
                  ? "border-[#3F72AF] bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <Text className="text-gray-800 font-semibold">Gói {pkg.days} ngày</Text>
              <Text className="text-gray-600 text-sm">
                Giá: {pkg.price.toLocaleString()}đ
              </Text>
            </TouchableOpacity>
          ))}

          {/* Giá tiền */}
          <Text className="text-[#3F72AF] font-semibold mb-2 mt-4">Giá gói</Text>
          <TextInput
            value={String(premium.paymentAmount ?? "")}
            editable={false}
            className="border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-600"
          />
        </View>

        {/* Button thanh toán */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className={`rounded-2xl py-4 flex-row items-center justify-center ${
            loading ? "bg-gray-400" : "bg-[#3F72AF]"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="card-outline" size={20} color="white" />
              <Text className="text-white font-semibold text-[16px] ml-2">
                Thanh toán Premium
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
