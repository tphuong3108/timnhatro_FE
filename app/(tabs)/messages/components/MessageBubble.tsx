import React from "react";
import { View, Text, Image } from "react-native";
import {clsx} from "clsx";

interface Props {
  text: string;
  isMe: boolean;
  avatar?: string;
}

export default function MessageBubble({ text, isMe, avatar }: Props) {
  return (
    <View
      className={clsx(
        "flex-row items-end px-3 my-1",
        isMe ? "justify-end" : "justify-start"
      )}
    >
      {/* Avatar bên trái nếu không phải mình */}
      {!isMe && avatar && (
        <Image
          source={{ uri: avatar }}
          className="w-8 h-8 rounded-full mr-2"
        />
      )}

      <View
        className={clsx(
          "max-w-[75%] px-3 py-2 rounded-2xl",
          isMe
            ? "bg-[#3F72AF] rounded-br-none"
            : "bg-gray-200 rounded-bl-none"
        )}
      >
        <Text className={clsx(isMe ? "text-white" : "text-gray-900")}>
          {text}
        </Text>
      </View>
    </View>
  );
}
