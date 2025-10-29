import apiClient from "./apiClient";

// Lấy toàn bộ danh sách phường/xã
export async function getAllWards() {
  const res = await apiClient.get("/wards");
  const wards = Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.data?.data)
    ? res.data.data
    : [];
  return wards;
}

// Lấy phường theo id
export async function getWardById(id: string) {
  const res = await apiClient.get(`/wards/id/${id}`);
  return res.data?.data ?? res.data;
}

// Lấy phường theo tên
export async function getWardByName(name: string) {
  const res = await apiClient.get(`/wards/name/${name}`);
  return res.data?.data ?? res.data;
}
