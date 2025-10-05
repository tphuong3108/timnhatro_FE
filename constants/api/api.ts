// constants/api.ts
const API_BASE_URL = "http://localhost:5000/api"; 

export const API = {
  REGISTER: `${API_BASE_URL}/users/register`,
  LOGIN: `${API_BASE_URL}/users/login`,
  SEND_OTP: `${API_BASE_URL}/users/send-otp`,
  VERIFY_OTP: `${API_BASE_URL}/users/verify-otp`,
  PROFILE: `${API_BASE_URL}/users/profile`,
};
