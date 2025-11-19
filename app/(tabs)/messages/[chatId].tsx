import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import { socket } from "../../../utils/socket";
import { messageService } from "../../../services/messageService";
import MessageInput from "./components/MessageInput";
import MessageBubble from "./components/MessageBubble";

export default function ChatRoomScreen() {
  const { receiverId: paramReceiverId, chatId: paramChatId,receiverName } =
    useLocalSearchParams<{ receiverId?: string; chatId?: string,receiverName?: string; }>();

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(
    paramChatId
  );
  
  const joinedRef = useRef<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Load messages từ server
  const loadMessages = useCallback(async () => {
    if (!currentChatId) return;
    setLoading(true);
    try {
      const data = await messageService.getMessages(currentChatId);
      setMessages(
        data
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
          // Sắp xếp tin nhắn cũ trên mới dưới
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      );
    } catch (err) {
      console.error("❌ loadMessages error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentChatId]);

  // Join/Leave chat room
  useEffect(() => {
    if (!currentChatId) return;
    if (joinedRef.current === currentChatId) return;

    joinedRef.current = currentChatId;
    socket.emit("joinChat", currentChatId);
    loadMessages();

    return () => {
      socket.emit("leaveChat", currentChatId);
      joinedRef.current = null;
    };
  }, [currentChatId, loadMessages]);

  // Lắng nghe tin nhắn realtime từ server
  useEffect(() => {
    if (!currentChatId) return;

    const handleReceiveMessage = (msg: any) => {
      if (msg.chatId !== currentChatId) return;

      setMessages(prev => {
        const newMsg = {
          _id: msg._id || Math.random().toString(),
          text: msg.content,
          createdAt: new Date(msg.createdAt),
          user: {
            _id: msg.sender._id,
            name: msg.sender.firstName
              ? `${msg.sender.firstName} ${msg.sender.lastName ?? ""}`
              : "Người dùng",
            avatar: msg.sender.avatar,
          },
        };
        const updated = [...prev, newMsg].sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        );
        return updated;
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [currentChatId]);
  // tự động kéo xuống khi có tin nhắn mới
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Gửi tin nhắn
  const handleSendMessage = useCallback(async (msgText: string) => {
  if (!msgText || !paramReceiverId || !user?._id) return;
  const content = msgText.trim();

  try {
    // Gửi API để lưu DB
    const newMsg = await messageService.sendMessage(paramReceiverId, content);

    const activeChatId = newMsg.chatId || currentChatId;
    if (!currentChatId && newMsg.chatId) setCurrentChatId(newMsg.chatId);

    // Gửi socket
    if (activeChatId) {
      socket.emit("sendMessage", {
        chatId: activeChatId,
        senderId: user._id,
        receiverId: paramReceiverId,
        content,
      });
    }
   
  } catch (err) {
    console.error(err);
  }
}, [paramReceiverId, currentChatId, user]);


  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6B9AC4" />
        <Text className="mt-2 text-gray-600">Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (!user?._id) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-600">Không tìm thấy thông tin người dùng.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="bg-[#BFD7ED] px-4 py-3 flex-row items-center justify-center border-b border-gray-200">
        <Text className="text-[16px] font-semibold text-gray-800">
          {receiverName}
        </Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MessageBubble
            text={item.text}
            isUser={item.user._id === user._id}
            avatar={item.user.avatar}
            createdAt={item.createdAt}
          />
        )}
        contentContainerStyle={{ padding: 10, paddingBottom: 80 }}
      />

     
      <MessageInput receiverId={paramReceiverId || ""} onMessageSent={handleSendMessage} />
    </View>
  );
}
