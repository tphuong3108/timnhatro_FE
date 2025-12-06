import { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import { Alert } from "react-native";
import { paymentApi } from "../services/paymentApi";

export function useCheckPaymentStatus() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState("idle");

  console.log("[HOOK] Mounted. orderId =", orderId);

  // ===== CHECK STATUS =====
  const checkStatus = async (oid?: string | null) => {
    const targetId = oid || orderId;
    if (!targetId) {
      console.log("[HOOK] No orderId → SKIP checkStatus");
      return;
    }

    console.log("[HOOK] Checking status for:", targetId);

    try {
      const res = await paymentApi.checkPaymentStatus(targetId);
      console.log("[HOOK] API result:", res.data);

      const status = res.data?.status;

      if (status === "success") {
        setPaymentStatus("success");
        Alert.alert("Thành công", "Thanh toán thành công!");
      } else if (status === "failed") {
        setPaymentStatus("failed");
        Alert.alert("Thất bại", "Thanh toán thất bại.");
      } else {
        setPaymentStatus("pending");
      }
    } catch (e) {
      console.log("[HOOK] Check status error:", e);
    }
  };

  // ===== HANDLE DEEP LINK =====
  const handleDeepLink = (event: { url: string }) => {
    console.log("[HOOK] DeepLink received:", event.url);

    const parsed = Linking.parse(event.url);
    const query = parsed.queryParams || {};
  let returnedOrderId = query.orderId || query.vnp_TxnRef || query.vnp_txnref;

// Fix type string | string[] → string
if (Array.isArray(returnedOrderId)) {
  returnedOrderId = returnedOrderId[0];
}


    console.log("[HOOK] parsed orderId =", returnedOrderId);

    if (returnedOrderId) {
      setOrderId(returnedOrderId);
      checkStatus(returnedOrderId);
    } else {
      console.log("[HOOK] No orderId found in deeplink");
    }
  };

  // ===== REGISTER DEEPLINK LISTENER =====
  useEffect(() => {
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);

  return {
    orderId,
    setOrderId,
    paymentStatus,
    checkStatus,
  };
}
