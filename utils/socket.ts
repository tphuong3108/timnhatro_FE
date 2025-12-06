import { io } from "socket.io-client";

const LOCAL_IP = "192.168.1.46";
const PORT = 5050;

const SOCKET_URL = `http://${LOCAL_IP}:${PORT}`;

if (__DEV__) {
  console.log("[socket] connecting to:", SOCKET_URL);
}

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
});
