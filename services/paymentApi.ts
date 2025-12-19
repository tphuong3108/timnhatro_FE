import apiClient from "./apiClient";

export interface NormalPaymentPayload {
  amount: number;
  orderId: string;
}

export interface PremiumPaymentPayload {
  roomId: string;
  durationDays: number;
}
export interface PaymentFilter {
  status?: "" |  "pending" | "success" | "failed";
}
const buildQueryString = (params: Record<string, any>) => {
  const query = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");

  return query ? `?${query}` : "";
};


// Loại dữ liệu query trả về từ VNPay
export type PaymentReturnQuery = string; 
// "?vnp_Amount=1000&vnp_ResponseCode=00"

export const paymentApi = {
  createPayment: async (payload: NormalPaymentPayload) => {
    return apiClient.post("/payment/create", payload);
  },

  getReturnPayment: async (query: PaymentReturnQuery) => {
    return apiClient.get(`/payment/premium/return${query}`);
  },

  // Tạo thanh toán Premium dành cho chủ phòng
  createPremiumPayment: async (payload: PremiumPaymentPayload) => {
    return apiClient.post("/payment/premium/create-payment-url", payload);
  },
  checkPaymentStatus: async (orderId: string) => {
  return apiClient.get(`/payment/check-status?orderId=${orderId}`);
},
  getHostPaymentHistory: async (filter?: PaymentFilter) => {
    const query = buildQueryString(filter || {});
    return apiClient.get(`/payment/history/host${query}`);
  },

  getAdminPaymentHistory: async (filter?: PaymentFilter) => {
    const query = buildQueryString(filter || {});
    return apiClient.get(`/payment/history/admin${query}`);
  },
  // Lấy chi tiết thanh toán (Host)
  getHostPaymentDetail: async (paymentId: string) => {
    return apiClient.get(`/payment/premium/${paymentId}`);
  },

  // Lấy chi tiết thanh toán (Admin)
  getAdminPaymentDetail: async (paymentId: string) => {
    return apiClient.get(`/payment/admin/${paymentId}`);
  }

};
