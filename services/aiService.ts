import api from "./apiClient";

export const aiService = {
  chat: (message: string) =>
    api.post("/ai/chat", { message }),
};
