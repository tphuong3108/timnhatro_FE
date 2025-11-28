// src/api/bookingApi.ts
import apiClient from "./apiClient";

export interface CreateBookingDto {
  roomId: string;
  hostId: string;
  date: string;    // yyyy-mm-dd
  time: string;    // HH:mm
  note?: string;
}
export interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  email?: string;
}

export interface Booking {
  _id: string;
  roomId: any;
  hostId: string;
  userId: string | User;
  date: string;
  time: string;
  note: string;
  status: "pending" | "approved" | "declined" | "canceled" | "completed";
  createdAt: string;
}

export const bookingApi = {
  // 👉 Tạo lịch xem phòng
  createBooking: (data: CreateBookingDto) =>
    apiClient.post("/bookings", data),

  // 👉 Kiểm tra user đã đặt lịch phòng này chưa
  checkUserBookedRoom: (roomId: string) =>
    apiClient.get(`/bookings/check?roomId=${roomId}`),

  // 👉 Lịch đã đặt của user (tenant)
  getUserBookings: () =>
    apiClient.get<Booking[]>("/bookings/me"),

  // 👉 Lịch cần duyệt của host
  getHostBookings: () =>
    apiClient.get<Booking[]>("/bookings/host"),

  // 👉 Approve, decline, cancel
  approveBooking: (id: string) =>
    apiClient.put(`/bookings/${id}/approve`),

  declineBooking: (id: string) =>
    apiClient.put(`/bookings/${id}/decline`),
  completeBooking: (id: string) => 
    apiClient.put(`bookings/${id}/complete`),

  cancelBooking: (id: string) =>
    apiClient.put(`/bookings/${id}/cancel`),
};
