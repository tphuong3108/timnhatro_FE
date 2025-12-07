import { useEffect, useState, useCallback } from "react";
import { AppState } from "react-native";
import { paymentApi } from "../services/paymentApi";

export function useCheckPaymentStatus() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "pending" | "success" | "failed"
  >("idle");
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  const checkStatus = useCallback(async (oid?: string) => {
    const targetId = oid || orderId;
    if (!targetId) return;

    setPaymentStatus("pending");

    try {
      const res = await paymentApi.checkPaymentStatus(targetId);
      const status = res.data?.status;

      setPaymentInfo(res.data);

      if (status === "success") setPaymentStatus("success");
      else if (status === "failed") setPaymentStatus("failed");
      else setPaymentStatus("pending");
    } catch (err) {
      console.error("[HOOK] checkStatus error:", err);
      setPaymentStatus("failed");
    }
  }, [orderId]); 

  // Khi qua lại app khởi động lại, tự check trạng thái
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active" && orderId) {
        checkStatus(orderId);
      }
    });

    return () => subscription.remove();
  }, [orderId, checkStatus]);

  return { orderId, setOrderId, paymentStatus, paymentInfo, checkStatus };
}
