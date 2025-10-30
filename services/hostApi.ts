import apiClient from "./apiClient";

export const hostApi = {
  getMyRooms: async () => {
    const res = await apiClient.get("/hosts/rooms");
    return res.data.data; 
  },

  getRoomDetails: async (id: string) => {
    const res = await apiClient.get(`/hosts/rooms/${id}`);
    return res.data.data;
  },

  createRoom: async (data: FormData) => {
    const res = await apiClient.post("/hosts/rooms", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  updateRoom: async (id: string, data: FormData) => {
    const res = await apiClient.patch(`/hosts/rooms/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  updateAvailability: async (id: string, availability: "available" | "unavailable") => {
    const res = await apiClient.patch(`/hosts/rooms/${id}/availability`, { availability });
    return res.data.data;
  },

  updateCoordinates: async (id: string, latitude: number, longitude: number) => {
    const res = await apiClient.put(`/hosts/rooms/${id}/coordinates`, {
      latitude,
      longitude,
    });
    return res.data.data;
  },

  deleteRoom: async (id: string) => {
    const res = await apiClient.delete(`/hosts/rooms/${id}`);
    return res.data.data;
  },

  getOverviewStats: async () => {
    const res = await apiClient.get("/hosts/stats/overview");
    return res.data.data;
  },

  getDailyStats: async () => {
    const res = await apiClient.get("/hosts/stats/daily");
    return res.data.data;
  },

  getTopViewedRooms: async () => {
    const res = await apiClient.get("/hosts/stats/topViewedRooms");
    return res.data.data;
  },

  getMyReviews: async (params?: any) => {
    const res = await apiClient.get("/hosts/reviews", { params });
    return res.data.data;
  },

  getMe: async () => {
    const res = await apiClient.get("/hosts/me");
    return res.data.data;
  },
};
