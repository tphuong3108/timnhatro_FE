import apiClient from "@/utils/apiClient";

export const profileApi = {
  getProfile: () => apiClient.get("/users/profile"),
  updateProfile: (data: any) => apiClient.put("/users/profile", data),
  changePassword: (data: any) => apiClient.put("/users/change-password", data),
  banAccount: () => apiClient.put("/users/me/ban"),
  logout: () => apiClient.post("/users/logout"),
};
