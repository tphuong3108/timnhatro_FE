// src/api/bookingApi.ts
import apiClient from "./apiClient";

export interface CreateBookingDto {
  roomId: string;
  hostId: string;
  date: string;    
  time: string;    
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

  createBooking: (data: CreateBookingDto) =>
    apiClient.post("/bookings", data),


  checkUserBookedRoom: (roomId: string) =>
    apiClient.get(`/bookings/check?roomId=${roomId}`),

  getUserBookings: () =>
    apiClient.get<Booking[]>("/bookings/me"),


  getHostBookings: () =>
    apiClient.get<Booking[]>("/bookings/host"),

  approveBooking: (id: string) =>
    apiClient.put(`/bookings/${id}/approve`),

  declineBooking: (id: string) =>
    apiClient.put(`/bookings/${id}/decline`),
  completeBooking: (id: string) => 
    apiClient.put(`bookings/${id}/complete`),

  cancelBooking: (id: string) =>
    apiClient.put(`/bookings/${id}/cancel`),
};
