import React, { useEffect, useState, useCallback, useRef } from "react";
import { View, FlatList, Text, ActivityIndicator,Image,Pressable  } from "react-native";
import { useLocalSearchParams,router } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";
import { socket } from "../../../utils/socket";
import { messageService } from "../../../services/messageService";
import MessageInput from "./components/MessageInput";
import MessageBubble from "./components/MessageBubble";

export default function ChatRoomScreen() {
  const { chatId, receiverId, receiverName } =
    useLocalSearchParams<{
      chatId?: string;
      receiverId?: string;
      receiverName?: string;
    }>();
    const [room, setRoom] = useState<any>(null);

  const { user } = useAuth();
  const currentChatId = chatId;

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);

  const joinedRef = useRef<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const loadMessages = useCallback(async () => {
    if (!currentChatId) return;

    try {
      const res = await messageService.getMessages(currentChatId);
      const data = res.messages || [];
       setRoom(res.room || null);

      setMessages(
        data
          .map((msg: any) => ({
            _id: msg._id,
            text: msg.content,
            createdAt: new Date(msg.createdAt),
            user: {
              _id: msg.sender._id,
              name: `${msg.sender.firstName ?? ""} ${
                msg.sender.lastName ?? ""
              }`,
              avatar: msg.sender.avatar,
            },
          }))
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      );
    } catch (err) {
      console.error("❌ loadMessages error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentChatId]);
  useEffect(() => {
    if (!currentChatId) return;

    if (joinedRef.current !== currentChatId) {
      joinedRef.current = currentChatId;
      socket.emit("joinChat", currentChatId);
      loadMessages();
    }

    return () => {
      socket.emit("leaveChat", currentChatId);
      joinedRef.current = null;
    };
  }, [currentChatId, loadMessages]);
  useEffect(() => {
    const handleReceive = (msg: any) => {
      // Chỉ xử lý tin nhắn đúng chat
      if (msg.chatId !== currentChatId) return;

      const newMsg = {
        _id: msg._id || Math.random().toString(),
        text: msg.content,
        createdAt: new Date(msg.createdAt),
        user: {
          _id: msg.sender._id,
          name: `${msg.sender.firstName ?? ""} ${
            msg.sender.lastName ?? ""
          }`,
          avatar: msg.sender.avatar,
        },
      };

      setMessages((prev) =>
        [...prev, newMsg].sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        )
      );
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [currentChatId]);
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);
  const handleSendMessage = useCallback(
    async (msgText: string) => {
      if (!msgText.trim()) return;
      if (!receiverId || !currentChatId) return;

      try {
        await messageService.sendMessage({
          chatId: currentChatId,
          content: msgText.trim(),
          images: [],
        });

        socket.emit("sendMessage", {
          chatId: currentChatId,
          senderId: user?._id,
          receiverId,
          content: msgText.trim(),
        });
      } catch (err) {
        console.error("sendMessage error:", err);
      }
    },
    [currentChatId, receiverId, user]
  );
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6B9AC4" />
        <Text className="mt-2 text-gray-600">Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#BFD7ED] px-4 py-3 flex-row items-center justify-center border-b border-gray-200">
        <Text className="text-[16px] font-semibold text-gray-800">
          {receiverName}
        </Text>
      </View>
   {room && (
  <Pressable
   onPress={() => router.push(`/room/${room._id}`)}

    className="p-3 border-b border-gray-300 bg-white flex-row"
  >
    {/* Ảnh phòng */}
    <View className="w-[90px] h-[70px] rounded-lg overflow-hidden bg-gray-200">
      <Image
        source={{ uri: room.images?.[0] }}
        style={{ width: "100%", height: "100%" }}
        resizeMode="cover"
      />
    </View>

    {/* Thông tin */}
    <View className="flex-1 ml-3 justify-center">
      <Text className="text-[15px] font-semibold text-gray-900">
        {room.name}
      </Text>

      <Text className="text-[12px] text-gray-600 mt-0.5" numberOfLines={1}>
        📍 {room.address}
      </Text>

      {room.price && (
        <Text className="text-[14px] font-bold text-[#3B82F6] mt-1">
          💰 {room.price.toLocaleString()} VNĐ / tháng
        </Text>
      )}
    </View>
  </Pressable>
)}

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MessageBubble
            text={item.text}
            isUser={item.user._id === user?._id}
            avatar={item.user.avatar}
            createdAt={item.createdAt}
          />
        )}
        contentContainerStyle={{ padding: 10, paddingBottom: 80 }}
      />

      {/* Input */}
      <MessageInput
        receiverId={receiverId || ""}
        onMessageSent={handleSendMessage}
      />
    </View>
  );
}
