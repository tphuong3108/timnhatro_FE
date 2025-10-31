import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";

// IP máy tính 
const LOCAL_IP = "192.168.1.9";
const PORT = 5050;

//  Cấu hình chính xác cho mọi môi trường
const API_BASE_URL =
  Platform.OS === "android"
    ? `http://10.0.2.2:${PORT}/api` // Android
    : `http://${LOCAL_IP}:${PORT}/api`; // iOS & Web dùng IP LAN


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
