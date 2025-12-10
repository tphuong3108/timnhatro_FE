import { io } from "socket.io-client";
// no Platform import needed here

// ⚙️ Dùng chung IP & PORT như apiClient

// NOTE: ensure there is NO trailing space in the IP string (was causing invalid URL)
const LOCAL_IP = "192.168.1.156";
const PORT = 5050;

const SOCKET_URL = `http://${LOCAL_IP}:${PORT}`;

// Helpful log when debugging connection issues in development
if (__DEV__) {
  console.log("[socket] connecting to:", SOCKET_URL);
}

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});
