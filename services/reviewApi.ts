import apiClient from "./apiClient";

export async function getReviewsByRoom(roomId: string, params?: any) {
  const res = await apiClient.get("/reviews", { params: { roomId, ...params } });
  return res.data;
}

export async function createReview(roomId: string, data: any) {
  const res = await apiClient.post(`/reviews/${roomId}`, data);
  return res.data;
}

export async function updateReview(id: string, data: any) {
  const res = await apiClient.put(`/reviews/${id}`, data);
  return res.data;
}

export async function deleteReview(id: string) {
  const res = await apiClient.delete(`/reviews/${id}`);
  return res.data;
}

export async function likeReview(id: string) {
  const res = await apiClient.post(`/reviews/${id}/like`);
  return res.data;
}

export async function reportReview(id: string, reason: string) {
  const res = await apiClient.post(`/reviews/${id}/report`, { reason });
  return res.data;
}
