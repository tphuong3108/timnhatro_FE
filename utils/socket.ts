import { io } from "socket.io-client";
import { Platform } from "react-native";

// ⚙️ Dùng chung IP & PORT như apiClient
const LOCAL_IP = "192.168.1.177 ";
const PORT = 5050; 

const SOCKET_URL =
  Platform.OS === "android"
    ? `http://${LOCAL_IP}:${PORT}` // Android emulator
    : `http://${LOCAL_IP}:${PORT}`; // iOS / thiết bị thật

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});
