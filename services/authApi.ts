import apiClient from "./apiClient";

export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post("/users/login", data),

  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => apiClient.post("/users/register", data),

  sendOtp: (email: string) => apiClient.post("/users/send-otp", { email }),
  
};
