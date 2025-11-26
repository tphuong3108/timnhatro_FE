import apiClient from "./apiClient";

export interface Message {
  _id: string;
  content: string;
  chatId: string;
  createdAt: string;
  sender: { _id: string; firstName: string; lastName: string; avatar?: string };
}

export interface ChatMessagesResponse {
  messages: Message[];
  room?: any;
}

export const messageService = {
  getMessages: async (chatId: string): Promise<ChatMessagesResponse> => {
    const res = await apiClient.get(`/messages/${chatId}`);
    return res.data?.data || { messages: [], room: null };
  },

  // FE phải gửi chatId (BE không tạo chat trong sendMessage)
  sendMessage: async (params: { chatId: string; content: string; images?: string[] }) => {
    const { chatId, content, images = [] } = params;
    const res = await apiClient.post("/messages", { chatId, content, images });
    return res.data?.data;
  }, 
};
