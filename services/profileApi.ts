// src/services/profileApi.ts
import apiClient from "./apiClient";

export const profileApi = {
  getMyProfile: async () => {
    const res = await apiClient.get("/profile");
    return res.data;
  },

  updateProfile: async (data: any) => {
    const res = await apiClient.patch("/profile", data);
    return res.data;
  },

  changePassword: async (data: any) => {
    const res = await apiClient.put("/users/change-password", data);
    return res.data;
  },

  deleteAccount: async () => {
    const res = await apiClient.delete("/users/delete-account");
    return res.data;
  },
};
