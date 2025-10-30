import apiClient from "./apiClient";

export const adminApi = {
  getMe: async () => {
    const res = await apiClient.get("/admin/me");
    return res.data.data || res.data;
  },
  getAllUsers: async () => {
    const res = await apiClient.get("/admin/users");
    return res.data.data || res.data;
  },

  getUserDetails: async (id: string) => {
    const res = await apiClient.get(`/admin/users/${id}`);
    return res.data.data || res.data;
  },

  toggleUserActive: async (id: string) => {
    const res = await apiClient.put(`/admin/users/${id}`);
    return res.data.data || res.data;
  },

  deleteUser: async (id: string) => {
    const res = await apiClient.delete(`/admin/users/${id}`);
    return res.data.data || res.data;
  },

  getOverviewStats: async () => {
    const res = await apiClient.get("/admin/stats/overview");
    return res.data.data || res.data;
  },

  getDailyStats: async () => {
    const res = await apiClient.get("/admin/stats/daily");
    return res.data.data || res.data;
  },

  getUserMonthlyStats: async () => {
    const res = await apiClient.get("/admin/stats/monthlyUsers");
    return res.data.data || res.data;
  },

  getPopularRooms: async () => {
    const res = await apiClient.get("/admin/stats/popular");
    return res.data.data?.popularRooms || [];
  },

  getTopViewedRooms: async () => {
    const res = await apiClient.get("/admin/stats/topViewedRooms");
    return res.data.data || res.data;
  },

  getTopHosts: async () => {
    const res = await apiClient.get("/admin/stats/topHosts");
    return res.data.data || res.data;
  },

  getLoginStats: async () => {
    const res = await apiClient.get("/admin/stats/logins");
    return res.data.data || res.data;
  },

  getTopAmenities: async () => {
    const res = await apiClient.get("/admin/stats/top-amenities");
    return res.data.data || res.data;
  },
  getTopWards: async () => {
  const res = await apiClient.get("/admin/stats/top-wards");
  return res.data.data || res.data;
},
  getAllRooms: async (params?: any) => {
    const res = await apiClient.get("/admin/rooms", { params });
    return res.data.data || res.data;
  },

  approveRoom: async (id: string, status: "approved" | "rejected") => {
    const res = await apiClient.patch(`/admin/rooms/${id}/approve`, { status });
    return res.data.data || res.data;
  },

  deleteRoom: async (id: string) => {
    const res = await apiClient.delete(`/admin/rooms/${id}`);
    return res.data.data || res.data;
  },
  getReportStats: async () => {
    const res = await apiClient.get("/admin/stats/reports");
    return res.data.data || res.data;
  },
  processReports: async () => {
    const res = await apiClient.post("/admin/stats/processReports");
    return res.data.data || res.data;
  },

};