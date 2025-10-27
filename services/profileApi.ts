import apiClient from "./apiClient";

export async function getProfile() {
  const res = await apiClient.get("/me");
  return res.data;
}

export async function updateProfile(data: any) {
  const res = await apiClient.put("/me", data);
  return res.data;
}

export async function changePassword(data: any) {
  const res = await apiClient.put("/me/change-password", data);
  return res.data;
}

export async function deleteAccount() {
  const res = await apiClient.delete("/me");
  return res.data;
}
