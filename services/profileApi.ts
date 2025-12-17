// src/services/profileApi.ts
import apiClient from "./apiClient";

export const profileApi = {
  getMyProfile: async () => {
    const res = await apiClient.get("/me");
    return res.data.data; 
  },

  updateProfile: async (data: any) => {
    const res = await apiClient.patch("/me", data);
    return res.data.data;
  },

  uploadAvatar: async (imageUri: string) => {
    const formData = new FormData();
    
    // Tạo file object từ URI
    const filename = imageUri.split('/').pop() || 'avatar.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    
    formData.append('avatar', {
      uri: imageUri,
      name: filename,
      type: type,
    } as any);

    const res = await apiClient.patch("/me", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },

  getMyReviews: async () => {
    const res = await apiClient.get("/me/reviews");
    return res.data.data;
  },

  upgradeRole: async (payload: { revert: boolean }) => {
    const res = await apiClient.patch("/me/upgrade-role", payload);
    return res.data.data;
  },

  banAccount: async () => {
    const res = await apiClient.put("/users/me/ban");
    return res.data;
  },

  getPublicProfile: async (id: string) => {
    const res = await apiClient.get(`/me/${id}`);
    return res.data.data;
  },
};

