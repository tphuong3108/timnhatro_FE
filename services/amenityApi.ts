import apiClient from "./apiClient";

export async function getAllAmenities() {
  const res = await apiClient.get("/amenities");
  return res.data;
}

export async function createAmenity(data: any) {
  const res = await apiClient.post("/amenities", data);
  return res.data;
}

export async function updateAmenity(id: string, data: any) {
  const res = await apiClient.put(`/amenities/${id}`, data);
  return res.data;
}

export async function deleteAmenity(id: string) {
  const res = await apiClient.delete(`/amenities/${id}`);
  return res.data;
}
