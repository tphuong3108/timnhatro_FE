import apiClient from "./apiClient";

export const notificationApi = {
  getMyNotifications: async () => {
    const res = await apiClient.get("/notifications/me");
    return res.data.data;
  },

  markAsRead: async (id: string) => {
    const res = await apiClient.patch(`/notifications/${id}/read`);
    return res.data.data;
  },

  deleteNotification: async (id: string) => {
    const res = await apiClient.delete(`/notifications/${id}`);
    return res.data.data;
  },

  createNotification: async (data: any) => {
    const res = await apiClient.post("/notifications", data);
    return res.data.data;
  },
  getAdminNotifications: async () => {
    const res = await apiClient.get("/notifications/admin");
    return res.data.data;   // trả về array
  },

  getAdminUnreadCount: async () => {
    const res = await apiClient.get("/notifications/admin");
    const arr = res.data.data || [];
    return arr.filter((x: any) => !x.isRead).length;
  },

  getUnreadCount: async () => {
    const res = await apiClient.get("/notifications/me");
    const arr = res.data.data || [];
    return arr.filter((x: any) => !x.isRead).length;
  }
};
