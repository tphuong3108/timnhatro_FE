import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api", // đổi lại IP nếu test trên thiết bị thật
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config: { headers: { Authorization: string; }; }) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
