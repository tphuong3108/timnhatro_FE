import { ChatMessage } from "@/hooks/useChatMessages";
import React from "react";
import { FlatList } from "react-native";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: ChatMessage[];
  flatListRef: any;
  userId: string;
}

export default function MessageList({ messages, flatListRef, userId }: Props) {
  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <MessageBubble
          text={item.text}
          isMe={item.user._id === userId}
          avatar={item.user.avatar}
        />
      )}
      contentContainerStyle={{ paddingVertical: 10 }}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() =>
        flatListRef?.current?.scrollToEnd({ animated: true })
      }
    />
  );
}
