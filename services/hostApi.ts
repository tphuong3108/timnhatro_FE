import apiClient from "./apiClient";

export async function getHostOverview() {
  const res = await apiClient.get("/hosts/overview");
  return res.data;
}

export async function getHostRooms(params?: any) {
  const res = await apiClient.get("/hosts/rooms", { params });
  return res.data;
}

export async function getTopViewedRooms() {
  const res = await apiClient.get("/hosts/top-rooms");
  return res.data;
}

export async function getMyReviews(params?: any) {
  const res = await apiClient.get("/hosts/reviews", { params });
  return res.data;
}
