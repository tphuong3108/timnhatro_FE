import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

import { usePaymentPremium } from "./PaymentPremium";
import { usePaymentBooking } from "./PaymentBookingRoom";
import { useCheckPaymentStatus } from "../../../hooks/useCheckPaymentStatus";

export default function PaymentContainer() {
  const params = useLocalSearchParams();
  const isPremium = params.isPremium === "true";
  const roomId = params.roomId as string;

  const [loading, setLoading] = useState(false);

  // ========== HOOK CHECK PAYMENT (NEW VERSION) ==========
  const { orderId, setOrderId } = useCheckPaymentStatus();

  // ========== PREMIUM & BOOKING HOOKS ==========
  const premium = usePaymentPremium(roomId);
  const booking = usePaymentBooking();

  const handleSubmit = async () => {
  setLoading(true);

  let oid: string | null = null;

  if (isPremium) {
    oid = await premium.handlePremiumPayment();
  } else {
    oid = await booking.handleNormalPayment();
  }

  if (oid) setOrderId(oid);   // OK vì oid giờ là string | null

  setLoading(false);
};

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      <View className="px-5 py-4">
        <Text className="text-2xl font-semibold text-[#3F72AF] text-center">
          {isPremium ? "Thanh toán Premium" : "Thanh toán đơn hàng"}
        </Text>

        <View className="bg-gray-50 rounded-2xl p-4 mt-6 mb-6">
          {!isPremium && (
            <>
              <Text className="text-[#3F72AF] font-semibold mb-2">Mã đơn hàng</Text>
              <TextInput
                value={booking.orderId}
                onChangeText={booking.setOrderId}
                placeholder="VD: ORD-2024-001"
                className="border border-gray-300 rounded-xl px-4 py-3 mb-4 bg-white"
              />
            </>
          )}

          {isPremium && (
            <>
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
            </>
          )}

          {/* Amount */}
          <Text className="text-[#3F72AF] font-semibold mb-2 mt-4">
            {isPremium ? "Giá gói" : "Số tiền (VNĐ)"}
          </Text>

          <TextInput
            value={isPremium ? premium.paymentAmount : booking.paymentAmount}
            onChangeText={!isPremium ? booking.setPaymentAmount : undefined}
            editable={!isPremium}
            keyboardType="numeric"
            className="border border-gray-300 rounded-xl px-4 py-3 bg-white"
            placeholder={isPremium ? "Tự động theo gói" : "Nhập số tiền"}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className={`rounded-2xl py-4 flex-row items-center justify-center ${
            loading ? "bg-gray-400" : "bg-[#3F72AF]"}`
          }
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="card-outline" size={20} color="white" />
              <Text className="text-white font-semibold text-[16px] ml-2">
                {isPremium ? "Thanh toán Premium" : "Thanh toán"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
