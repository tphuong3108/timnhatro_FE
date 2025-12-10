import apiClient from "./apiClient";
import { socket } from "../utils/socket"; // nhớ import socket.io client

export interface Participant {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface MessagePreview {
  content: string;
  createdAt: string;
}

export interface Chat {
  _id: string;
  participants: Participant[];
  lastMessage?: MessagePreview;
}

export const chatService = {
  // Lấy danh sách chat
  getUserChats: async (): Promise<Chat[]> => {
    const res = await apiClient.get("/chats");
    return res.data?.data || [];
  },

  // Tạo chat mới
  createChat: async (receiverId: string, roomId?: string): Promise<Chat> => {
    const res = await apiClient.post("/chats", { receiverId, roomId });
    if (!res.data?.success) throw new Error("Không thể tạo chat");
    return res.data.data;
  },

  // Xoá chat
  deleteChat: async (chatId: string): Promise<boolean> => {
    const res = await apiClient.delete(`/chats/${chatId}`);
    return res.data?.success || false;
  },

  /**
   lắng nghe socket real-time cho Chat  
    callback sẽ dùng để update UI từ FE
   */
  onChatCreated: (callback: (chat: Chat) => void) => {
    socket.on("chat:created", callback);
  },

  onChatDeleted: (callback: (chatId: string) => void) => {
    socket.on("chat:deleted", callback);
  },

  onLastMessageUpdate: (
    callback: (data: { chatId: string; message: MessagePreview }) => void
  ) => {
    socket.on("chat:lastMessage", callback);
  },

  // clear listener để tránh memory leak
  removeListeners: () => {
    socket.off("chat:created");
    socket.off("chat:deleted");
    socket.off("chat:lastMessage");
  },
};
