import apiClient from "./apiClient";

export async function getAllRooms(params?: any) {
  const res = await apiClient.get("/rooms", { params });
  return res.data;
}

export async function getRoomById(id: string) {
  const res = await apiClient.get(`/rooms/${id}`);
  return res.data;
}

export async function createRoom(data: any) {
  const res = await apiClient.post("/rooms", data);
  return res.data;
}

export async function updateRoom(id: string, data: any) {
  const res = await apiClient.put(`/rooms/${id}`, data);
  return res.data;
}

export async function deleteRoom(id: string) {
  const res = await apiClient.delete(`/rooms/${id}`);
  return res.data;
}

export async function likeRoom(id: string) {
  const res = await apiClient.post(`/rooms/${id}/like`);
  return res.data;
}

export async function getFavorites() {
  const res = await apiClient.get("/rooms/favorites");
  return res.data;
}

export async function addFavorite(id: string) {
  const res = await apiClient.post(`/rooms/${id}/favorite`);
  return res.data;
}

export async function removeFavorite(id: string) {
  const res = await apiClient.delete(`/rooms/${id}/favorite`);
  return res.data;
}
