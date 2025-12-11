import apiClient from "./apiClient";

export interface Participant { _id: string; firstName: string; lastName: string; avatar?: string; }
export interface MessagePreview { content: string; createdAt: string; }
export interface Chat { _id: string; participants: Participant[]; lastMessage?: MessagePreview; }

export const chatService = {
  getUserChats: async (): Promise<Chat[]> => {
    const res = await apiClient.get("/chats");
    return res.data?.data || [];
  },

  createChat: async (receiverId: string, roomId?: string): Promise<Chat> => {
    const res = await apiClient.post("/chats", { receiverId, roomId });
    if (!res.data?.success) throw new Error("Không thể tạo chat");
    return res.data.data;
  },
};
