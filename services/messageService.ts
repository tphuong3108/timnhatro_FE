import apiClient from "./apiClient";

export interface Message {
  _id: string;
  content: string;
  chatId: string; 
  createdAt: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export const messageService = {
  getMessages: async (chatId: string): Promise<Message[]> => {
    const res = await apiClient.get(`/messages/${chatId}`);
    
    return res.data.data || [];
  },

  // Chỉ cần receiverId và content, backend sẽ tự tìm/ tạo chat
  sendMessage: async (receiverId: string, content: string): Promise<Message> => {
    if (!receiverId || !content) throw new Error("Thiếu receiverId hoặc content");
    const res = await apiClient.post(`/messages`, { receiverId, content });
    return res.data.data;
  },
  
};

