import { paymentApi } from "@/services/paymentApi";
import { useEffect, useState } from "react";
import { Alert, Linking } from "react-native";

export const PREMIUM_PACKAGES = [
  { days: 30, price: 10000 },
  { days: 60, price: 90000 },
  { days: 90, price: 120000 },
];

export function usePaymentPremium(roomId: string) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [premiumOrderId, setPremiumOrderId] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPackage) {
      const pkg = PREMIUM_PACKAGES.find((p) => p.days === selectedPackage);
      if (pkg) setPaymentAmount(pkg.price.toString());
    }
  }, [selectedPackage]);

  // Hàm thanh toán Premium
  const handlePremiumPayment = async (): Promise<string | null> => {
    if (!selectedPackage) {
      Alert.alert("Lỗi", "Vui lòng chọn gói Premium");
      return null;
    }

    try {
      const response = await paymentApi.createPremiumPayment({
        roomId,
        durationDays: selectedPackage,
      });

      const url = response.data?.paymentUrl;
      const orderId = response.data?.orderId;

      if (orderId) setPremiumOrderId(orderId);
      if (url) setPaymentUrl(url); 

      if (url) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Lỗi", "Không nhận được link thanh toán");
      }

      return orderId || null;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      Alert.alert("Lỗi thanh toán Premium", msg);
      return null;
    }
  };

  return {
    selectedPackage,
    setSelectedPackage,
    paymentAmount,
    handlePremiumPayment,
    premiumPackages: PREMIUM_PACKAGES,
    premiumOrderId,
    paymentUrl,
  };
}
