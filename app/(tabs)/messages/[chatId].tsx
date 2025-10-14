import React, { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Image,TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { Ionicons } from "@expo/vector-icons";

export default function ChatScreen() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams();

  const [messages, setMessages] = useState([
    { id: 1, text: "Chào bạn, phòng này còn trống không ạ?", isUser: true },
    { id: 2, text: "Chào bạn, hiện tại phòng vẫn còn nha!", isUser: false },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), text: input, isUser: true }]);
    setInput("");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-[#E8F0FE] py-4 px-5 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={22} color="#3F72AF" />
        </TouchableOpacity>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
          }}
          className="w-9 h-9 rounded-full mr-3"
        />
        <Text className="text-lg font-semibold text-[#3F72AF]">
          Chủ trọ #{chatId}
        </Text>
      </View>

      {/* Nội dung chat */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          className="flex-1 px-5 pt-5 pb-3"
          showsVerticalScrollIndicator={false}
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

        {/* Input */}
        <MessageInput value={input} onChangeText={setInput} onSend={handleSend} />
      </KeyboardAvoidingView>
    </View>
  );
}
