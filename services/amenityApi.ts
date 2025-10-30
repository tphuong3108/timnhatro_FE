import apiClient from "./apiClient";

// Lấy tất cả tiện ích
export async function getAllAmenities() {
  const res = await apiClient.get("/amenities");
  const amenities = Array.isArray(res.data)
    ? res.data
    : Array.isArray(res.data?.data)
    ? res.data.data
    : [];
  return amenities;
}
