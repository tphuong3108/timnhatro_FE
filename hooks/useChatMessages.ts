import { useState, useEffect, useCallback, useRef } from "react";
import { messageService } from "../services/messageService";
import { socket } from "../utils/socket";

export interface ChatUser {
  _id: string;
  name: string;
  avatar?: string;
}

export interface ChatMessage {
  _id: string;
  text: string;
  createdAt: Date;
  user: ChatUser;
}

export interface RoomData {
  _id: string;
  name: string;
  images?: string[];
  address?: string;
  price?: number;
}

export function useChatMessages(
  chatId: string | string[] | undefined,
  receiverId: string | string[] | undefined,
  user: { _id: string } | null
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [room, setRoom] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef<any>(null);
  const joinedRef = useRef<string | null>(null);
  // LOAD MESSAGES
  const loadMessages = useCallback(async () => {
    if (!chatId || typeof chatId !== "string") return;

    try {
      const res = await messageService.getMessages(chatId);

      setRoom(res.room || null);

      const formatted: ChatMessage[] = res.messages
        .map((msg: any) => ({
          _id: msg._id,
          text: msg.content,
          createdAt: new Date(msg.createdAt),
          user: {
            _id: msg.sender._id,
            name: `${msg.sender.firstName ?? ""} ${msg.sender.lastName ?? ""}`,
            avatar: msg.sender.avatar,
          },
        }))
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

      setMessages(formatted);
    } finally {
      setLoading(false);
    }
  }, [chatId]);
  // JOIN ROOM
  useEffect(() => {
    if (!chatId || typeof chatId !== "string") return;

    if (joinedRef.current !== chatId) {
      joinedRef.current = chatId;
      void socket.emit("joinChat", chatId); // đảm bảo không return socket
      loadMessages();
    }

    return () => {
      if (typeof chatId === "string") {
        void socket.emit("leaveChat", chatId); 
      }
      joinedRef.current = null;
    };
  }, [chatId, loadMessages]);
  // SOCKET RECEIVE
  useEffect(() => {
    const receive = (msg: any) => {
      if (msg.chatId !== chatId) return;

      const newMsg: ChatMessage = {
        _id: msg._id,
        text: msg.content,
        createdAt: new Date(msg.createdAt),
        user: {
          _id: msg.sender._id,
          name: `${msg.sender.firstName ?? ""} ${msg.sender.lastName ?? ""}`,
          avatar: msg.sender.avatar,
        },
      };

      setMessages((prev) =>
        [...prev, newMsg].sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        )
      );
    };

    socket.on("receiveMessage", receive);

    return () => {
      socket.off("receiveMessage", receive);
    };
  }, [chatId]);

  // ----------------------
  // AUTO SCROLL
  // ----------------------
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // ----------------------
  // SEND MESSAGE
  // ----------------------
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    if (!chatId || typeof chatId !== "string") return;

    await messageService.sendMessage({
      chatId,
      content: text.trim(),
      images: [],
    });

    void socket.emit("sendMessage", {
      chatId,
      senderId: user?._id,
      receiverId,
      content: text.trim(),
    });
  };

  return { room, messages, loading, flatListRef, handleSendMessage };
}
