import apiClient from "./apiClient";

export const notificationApi = {

  // Lấy thông báo của user đang đăng nhập
  getMyNotifications: async () => {
    const res = await apiClient.get("/notifications/me");
    return res.data; // BE trả trực tiếp array -> return nguyên array
  },

  // Đánh dấu thông báo đã đọc
  markAsRead: async (id: string) => {
    const res = await apiClient.patch(`/notifications/${id}/read`);
    return res.data;
  },

  // Xóa mềm thông báo
  deleteNotification: async (id: string) => {
    const res = await apiClient.delete(`/notifications/${id}`);
    return res.data;
  },

  // Tạo thông báo mới
  createNotification: async (data: any) => {
    const res = await apiClient.post("/notifications", data);
    return res.data;
  },

  // Admin xem thông báo chung
  getAdminNotifications: async () => {
    const res = await apiClient.get("/notifications/admin");
    return res.data;
  },
  getUnreadCount: async () => {
    const res = await apiClient.get("/notifications/me");
    return res.data.filter((x: any) => !x.isRead).length;
    }
};
