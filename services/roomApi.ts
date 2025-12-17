import apiClient from "./apiClient";

export const roomApi = {
  //  Lấy tất cả phòng (phân trang)
  getAllRooms: async (params?: any) => {
    const res = await apiClient.get("/rooms", { params });
    return res.data.data;
  },

  //  Lấy danh sách phòng được duyệt
  getApprovedRooms: async (params?: any) => {
    const res = await apiClient.get("/rooms", { params: { ...params, status: "approved" } });
    return res.data.data;
  },

  //  Lấy phòng nổi bật
  getHotRooms: async () => {
    const res = await apiClient.get("/rooms/hot");
    return res.data.data;
  },

  //  Tìm kiếm phòng
  searchRooms: async (params: any) => {
    const res = await apiClient.get("/rooms/search", { params });
    return res.data.data;
  },

  //  Lấy phòng gần đây
  getNearbyRooms: async (latitude: number, longitude: number, distance = 15000) => {
    const res = await apiClient.get("/rooms/nearby", {
      params: { latitude, longitude, distance },
    });
    return res.data?.data ?? res.data ?? [];
  },

  //  Lấy chi tiết phòng
  getRoomById: async (id: string) => {
    const res = await apiClient.get(`/rooms/${id}`);
    return res.data.data;
  },

  //  Lấy phòng bằng slug
  getRoomBySlug: async (slug: string) => {
    const res = await apiClient.get(`/rooms/slug/${slug}`);
    return res.data.data;
  },

  //  Like phòng (đúng route backend PATCH /rooms/:id)
  likeRoom: async (id: string) => {
    const res = await apiClient.patch(`/rooms/${id}/like`);
    return res.data.data;
  },

  updateRoomStatus: async (id: string, status: string) => {
    const res = await apiClient.patch(`/rooms/${id}/status`, { status });
    return res.data.data;
  },

  addToFavorites: async (slug: string) => {
    const res = await apiClient.post(`/rooms/slug/${slug}/favorite`);
    return res.data.data;
  },

  removeFromFavorites: async (slug: string) => {
    const res = await apiClient.delete(`/rooms/slug/${slug}/favorite`);
    return res.data.data;
  },

  createRoom: async (formData: FormData) => {
    const res = await apiClient.post("/hosts/rooms", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
      transformRequest: (data) => data,
    });
    return res.data;
  },
  //  Lấy dữ liệu phòng cho bản đồ
  getRoomsMapdata: async (params?: any) => {
    const res = await apiClient.get("/rooms/map-data", { params });
    return res.data.data;
  },

  approveRoom: async (id: string) => {
    const res = await apiClient.patch(`/rooms/${id}/approve`);
    return res.data.data;
  },
  //  Xóa phòng
  deleteRoom: async (id: string) => {
    const res = await apiClient.delete(`/rooms/${id}`);
    return res.data.data;
  },
  reportRoom: async (id: string, reason: string) => {
    const res = await apiClient.post(`/rooms/${id}/report`, { reason });
    return res.data;
  },
  reportReview: async (reviewId: string, reason: string) => {
    const res = await apiClient.post(`/reviews/${reviewId}/report`, { reason });
    return res.data;
  },

  deleteReview: async (reviewId: string) => {
    const res = await apiClient.delete(`/reviews/${reviewId}`);
    return res.data;
  },
  //lấy phòng đã thanh toán premium
  getPremiumStatus: async (id: string) => {
    const res = await apiClient.get(`/rooms/${id}/premium-status`);
    return res.data.data;
  },
  updateRoom: async (id: string, formDataOrObject: any) => {
    // Accept either a FormData (for file uploads) or a plain object (JSON).
    if (formDataOrObject instanceof FormData) {
      const res = await apiClient.patch(`/hosts/rooms/${id}`, formDataOrObject, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        transformRequest: (data) => data,
      });
      return res.data;
    } else {
      // send JSON body for simple updates
      const res = await apiClient.patch(`/hosts/rooms/${id}`, formDataOrObject);
      return res.data;
    }
  },



};
