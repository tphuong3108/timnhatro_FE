import apiClient from "./apiClient";

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
  // 🧩 Lấy danh sách chat của user hiện tại
  getUserChats: async (): Promise<Chat[]> => {
    try {
      const res = await apiClient.get("/chats");

      // ✅ Nếu BE trả về success: true và có data thì dùng
      if (res.data && Array.isArray(res.data.data)) {
        return res.data.data;
      }

      // ⚠️ Nếu không có data hoặc không đúng định dạng thì trả mảng rỗng
      return [];
    } catch (error: any) {
      console.error(
        "❌ Lỗi chatService.getUserChats:",
        error?.response?.data || error.message
      );
      return []; // ✅ Tránh crash
    }
  },

  // 🧩 Tạo hoặc lấy chat giữa 2 người
  createChat: async (receiverId: string): Promise<Chat> => {
    try {
      const res = await apiClient.post("/chats", { receiverId });

      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }

      throw new Error("Không thể tạo hoặc lấy cuộc chat");
    } catch (error: any) {
      console.error(
        "❌ Lỗi chatService.createChat:",
        error?.response?.data || error.message
      );
      throw error;
    }
  },
};
