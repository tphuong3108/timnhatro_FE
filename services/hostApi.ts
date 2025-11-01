import apiClient from "./apiClient";

export const hostApi = {
  getOverviewStats: async () => {
    const res = await apiClient.get("/hosts/stats/overview");
    return res.data.data || res.data;
  },

  getDailyStats: async () => {
    const res = await apiClient.get("/hosts/stats/daily");
    return res.data.data || res.data;
  },

  getTopViewedRooms: async () => {
    const res = await apiClient.get("/hosts/stats/topViewedRooms");
    return res.data.data || res.data;
  },

  getMyReviews: async (page = 1, limit = 5) => {
    const res = await apiClient.get(`/hosts/reviews?page=${page}&limit=${limit}`);
    return res.data.data || res.data;
  },

  getMe: async () => {
    const res = await apiClient.get("/hosts/me");
    return res.data.data || res.data;
  },
};
