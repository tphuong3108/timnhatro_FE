import apiClient from "./apiClient";

export const hostApi = {
getHostById: async (id: string) => {
  const res = await apiClient.get(`/users/${id}`);
  return res.data?.data;
},
}