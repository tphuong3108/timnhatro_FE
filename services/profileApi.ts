// src/services/profileApi.ts
import apiClient from "./apiClient";

export const profileApi = {
  getMyProfile: async () => {
    const res = await apiClient.get("/me");
    return res.data.data; 
  },

  updateProfile: async (data: any) => {
    const res = await apiClient.patch("/me", data);
    return res.data.data;
  },

  getMyReviews: async () => {
    const res = await apiClient.get("/me/reviews");
    return res.data.data;
  },

  upgradeRole: async () => {
    const res = await apiClient.patch("/me/upgrade-role");
    return res.data.data;
  },
    banAccount: async () => {
    const res = await apiClient.put("/users/me/ban");
    return res.data;
  },
};
