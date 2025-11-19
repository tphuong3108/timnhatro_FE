import React from "react";
import { View, Text, Image } from "react-native";

interface MessageBubbleProps {
  text: string;
  isUser: boolean;
  avatar?: string;
  createdAt: Date;
}

export default function MessageBubble({
  text,
  isUser,
  avatar,
  createdAt,
}: MessageBubbleProps) {
  const time = new Date(createdAt).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View
      className={`flex-row w-full mb-3 ${isUser ? "justify-end" : "justify-start"}`}
      >

      {/* Ảnh đại diện nếu là người khác */}
      {!isUser && (
        <Image
          source={{
            uri: avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          className="w-8 h-8 rounded-full mr-2"
        />
      )}

      <View
        className={`max-w-3/4 rounded-2xl px-3 py-2 ${
          isUser
            ? "bg-[#6B9AC4] rounded-br-none"
            : "bg-[#E9EFF6] rounded-bl-none"
        }`}
      >
        <Text
          className={`text-[15px] ${
            isUser ? "text-white" : "text-gray-800"
          }`}
        >
          {text}
        </Text>
        <Text
          className={`text-[11px] mt-1 ${
            isUser ? "text-gray-100" : "text-gray-500"
          } self-end`}
        >
          {time}
        </Text>
      </View>

      {/* Nếu là user, avatar nằm bên phải */}
      {isUser && (
        <Image
          source={{
            uri: avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          className="w-8 h-8 rounded-full ml-2"
        />
      )}
    </View>
  );
}
