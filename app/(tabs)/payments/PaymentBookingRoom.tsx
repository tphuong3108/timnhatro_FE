import { useState } from "react";
import { Alert, Linking } from "react-native";
import { paymentApi } from "../../../services/paymentApi";

export function usePaymentBooking() {
  const [orderId, setOrderId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const handleNormalPayment = async () => {
  if (!orderId.trim()) {
    Alert.alert("Lỗi", "Vui lòng nhập mã đơn hàng");
    return null;
  }

  if (!paymentAmount.trim() || isNaN(Number(paymentAmount))) {
    Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
    return null;
  }

  try {
    const response = await paymentApi.createPayment({
      orderId: orderId.trim(),
      amount: Number(paymentAmount),
    });

    const url = response.data?.data?.paymentUrl;

    if (url) await Linking.openURL(url);

    return orderId.trim();   // ← TRẢ VỀ ORDER ID
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message;
    Alert.alert("Lỗi thanh toán", msg);
    return null;
  }
};

  return {
    orderId,
    setOrderId,
    paymentAmount,
    setPaymentAmount,
    handleNormalPayment,
  };
}
