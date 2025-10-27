import apiClient from "./apiClient";

export async function getAllWards() {
  const res = await apiClient.get("/wards");
  return res.data;
}

export async function getWardById(id: string) {
  const res = await apiClient.get(`/wards/${id}`);
  return res.data;
}

export async function getWardByName(name: string) {
  const res = await apiClient.get(`/wards/name/${name}`);
  return res.data;
}

export async function getNearbyWards(coords: {
  longitude: number;
  latitude: number;
  radius?: number;
}) {
  const res = await apiClient.get("/wards/nearby", { params: coords });
  return res.data;
}
