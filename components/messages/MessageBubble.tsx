import { clsx } from "clsx";
import React from "react";
import { Image, Text, View } from "react-native";
import AIMessageParser, { containsRoomData } from "./AIMessageParser";
import { RoomData } from "./RoomCard";

interface Props {
  text: string;
  isMe: boolean;
  avatar?: string;
  createdAt?: Date;
  rooms?: RoomData[];
}

export default function MessageBubble({ text, isMe, avatar, rooms = [] }: Props) {
  // Check if AI message has room data (either from rooms array or text)
  const hasRoomData = !isMe && (rooms.length > 0 || containsRoomData(text));

  return (
    <View
      className={clsx(
        "flex-row items-start px-3 my-1",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar bên trái nếu không phải mình */}
      {!isMe && avatar && (
        <Image
          source={{ uri: avatar }}
          className="w-8 h-8 rounded-full mr-2 mt-1"
        />
      )}

      {hasRoomData ? (
        // Render room cards for AI room listing
        <View className="max-w-[90%] p-3 rounded-2xl bg-gray-50 rounded-bl-none">
          <AIMessageParser text={text} rooms={rooms} />
        </View>
      ) : (
        // Regular message bubble
        <View
          className={clsx(
            "max-w-[75%] px-3 py-2 rounded-2xl",
            isMe
              ? "bg-[#3F72AF] rounded-br-none"
              : "bg-gray-200 rounded-bl-none"
          )}
        >
          <Text className={clsx("text-[15px]", isMe ? "text-white" : "text-gray-900")}>
            {text}
          </Text>
        </View>
      )}
    </View>
  );
}
