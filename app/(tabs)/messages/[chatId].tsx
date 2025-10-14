import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { Ionicons } from "@expo/vector-icons";

export default function ChatScreen() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView | null>(null);

  const [messages, setMessages] = useState([
    { id: 1, text: "Chào bạn, phòng này còn trống không ạ?", isUser: true },
    { id: 2, text: "Chào bạn, hiện tại phòng vẫn còn nha!", isUser: false },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), text: input, isUser: true };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View className="flex-1 bg-white">
      <View className="py-3 px-3 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Ionicons name="arrow-back" size={22} color="#3F72AF" />
        </TouchableOpacity>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
          }}
          className="w-8 h-8 rounded-full mr-2"
        />
        <Text className="text-base font-semibold text-[#3F72AF]">
          Chủ trọ {chatId}
        </Text>
      </View>
        <KeyboardAvoidingView
          style={{ flex: 0.97 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 80}
        >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-3 pt-3 pb-2"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              isUser={msg.isUser}
              avatar={
                msg.isUser
                  ? "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  : "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
              }
            />
          ))}
        </ScrollView>

        <MessageInput
          value={input}
          onChangeText={setInput}
          onSend={handleSend}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
