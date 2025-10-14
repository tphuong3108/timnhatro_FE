import React from "react";
import { View, Text, Image } from "react-native";

interface Props {
  text: string;
  isUser: boolean;
  avatar?: string;
}

export default function MessageBubble({ text, isUser, avatar }: Props) {
  return (
    <View
      className={`flex-row mb-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && avatar && (
        <Image source={{ uri: avatar }} className="w-8 h-8 rounded-full mr-2 self-end" />
      )}

      <View
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser ? "bg-[#3F72AF] rounded-br-none" : "bg-gray-200 rounded-bl-none"
        }`}
      >
        <Text className={`${isUser ? "text-white" : "text-gray-800"} text-[14px]`}>
          {text}
        </Text>
      </View>

      {isUser && avatar && (
        <Image source={{ uri: avatar }} className="w-8 h-8 rounded-full ml-2 self-end" />
      )}
    </View>
  );
}
