import apiClient from "./apiClient";

export const reviewApi = {
  createReview: async (roomId: string, data: { comment: string; rating: number }) => {
    const res = await apiClient.post(`/reviews/${roomId}`, data);
    return res.data.data;
  },

  getReviewsByRoom: async (roomId: string) => {
    const res = await apiClient.get(`/reviews`, { params: { roomId } });
    return res.data.data;
  },

  // Sửa đánh giá
  updateReview: async (reviewId: string, data: { comment: string; rating: number }) => {
    const res = await apiClient.patch(`/reviews/${reviewId}`, data);
    return res.data.data;
  },
};
