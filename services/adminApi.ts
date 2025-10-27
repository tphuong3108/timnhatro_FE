import apiClient from "./apiClient";

export async function getOverview() {
  const res = await apiClient.get("/admin/overview");
  return res.data;
}

export async function getTopHosts() {
  const res = await apiClient.get("/admin/top-hosts");
  return res.data;
}

export async function getTopRooms() {
  const res = await apiClient.get("/admin/top-rooms");
  return res.data;
}

export async function getLoginStats() {
  const res = await apiClient.get("/admin/logins");
  return res.data;
}

export async function getReviews(params?: any) {
  const res = await apiClient.get("/admin/reviews", { params });
  return res.data;
}

export async function hideReview(id: string) {
  const res = await apiClient.put(`/admin/reviews/${id}/hide`);
  return res.data;
}

export async function deleteReview(id: string) {
  const res = await apiClient.delete(`/admin/reviews/${id}`);
  return res.data;
}

export async function approveRoom(id: string) {
  const res = await apiClient.put(`/admin/rooms/${id}/approve`);
  return res.data;
}
