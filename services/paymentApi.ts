import apiClient from "./apiClient";

export interface NormalPaymentPayload {
  amount: number;
  orderId: string;
}

export interface PremiumPaymentPayload {
  roomId: string;
  durationDays: number;
}

// Loại dữ liệu query trả về từ VNPay
export type PaymentReturnQuery = string; 
// "?vnp_Amount=1000&vnp_ResponseCode=00"

export const paymentApi = {
  createPayment: async (payload: NormalPaymentPayload) => {
    return apiClient.post("/payment/create", payload);
  },

  getReturnPayment: async (query: PaymentReturnQuery) => {
    return apiClient.get(`/payment/return${query}`);
  },

  // Tạo thanh toán Premium dành cho chủ phòng
  createPremiumPayment: async (payload: PremiumPaymentPayload) => {
    return apiClient.post("/payment/premium/create-payment-url", payload);
  },
  checkPaymentStatus: async (orderId: string) => {
  return apiClient.get(`/payment/check-status?orderId=${orderId}`);
},

};
