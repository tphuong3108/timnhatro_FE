import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MessageBubble from "./components/MessageBubble";
import { useAuth } from "@/contexts/AuthContext";
import { aiService } from "../../../services/aiService";
import MessageInputAI from "./components/MessageInputAI";

export default function ChatAI() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const currentUser = user || {
    _id: "guest",
    avatar: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
  };

  const AI_BOT = useRef ({
    _id: "ai_bot",
    name: "AI Assistant",
    avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712100.png",
  }).current;

  useEffect(() => {
    setMessages([
      {
        _id: "intro",
        text: "🤖 Xin chào! Tôi có thể giúp gì cho bạn?",
        createdAt: new Date(),
        user: AI_BOT,
      },
    ]);
  }, [AI_BOT]);

  const handleSend = async (text: string) => {
    const userMsg = {
      _id: Date.now().toString(),
      text,
      createdAt: new Date(),
      user: currentUser,
    };

    setMessages((prev) => [...prev, userMsg]);

    const typingId = `typing_${Date.now()}`;
    const typingMsg = {
      _id: typingId,
      text: "Đang trả lời...",
      createdAt: new Date(),
      user: AI_BOT,
    };

    setMessages((prev) => [...prev, typingMsg]);

    try {
      const res = await aiService.chat(text);

      const aiReply = {
        _id: `ai_${Date.now()}`,
        text: res.data.reply,
        createdAt: new Date(),
        user: AI_BOT,
      };

      setMessages((prev) => prev.filter((m) => m._id !== typingId));
      setMessages((prev) => [...prev, aiReply]);
    } catch {
      setMessages((prev) => prev.filter((m) => m._id !== typingId));
      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now().toString(),
          text: "AI gặp lỗi, thử lại sau.",
          createdAt: new Date(),
          user: AI_BOT,
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View className="bg-[#BFD7ED] px-4 py-2 items-center border-b border-gray-200">
        <Text className="text-lg font-semibold">Chat với AI</Text>
      </View>

      {/* Chat */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={{
              width: "100%",
              alignItems:
                item.user._id === currentUser._id ? "flex-end" : "flex-start",
            }}
          >
            <View style={{ maxWidth: "85%" }}>
              <MessageBubble
                text={item.text}
                avatar={item.user.avatar}
                isMe={item.user._id === currentUser._id}
                createdAt={item.createdAt}
              />
            </View>
          </View>
        )}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 20 + insets.bottom,
        }}
      />

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.bottom + 70}
      >
        <MessageInputAI onSend={handleSend} bottomInset={insets.bottom} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
