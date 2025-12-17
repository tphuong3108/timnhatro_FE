import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { useAuth } from "../../../contexts/AuthContext";

import ChatHeader from "@/components/messages/ChatHeader";
import MessageInput from "@/components/messages/MessageInput";
import MessagesList from "@/components/messages/MessagesList";
import RoomHeader from "@/components/messages/RoomHeader";
import { useChatMessages } from "../../../hooks/useChatMessages";

export default function ChatRoomScreen() {
  const { chatId, receiverId, receiverName, receiverAvatar } = useLocalSearchParams();
  const { user } = useAuth();

  const safeChatId = Array.isArray(chatId) ? chatId[0] : chatId || "";
  const safeReceiverId = Array.isArray(receiverId) ? receiverId[0] : receiverId || "";
  const safeReceiverName = Array.isArray(receiverName) ? receiverName[0] : receiverName || "";
  const safeReceiverAvatar = Array.isArray(receiverAvatar) ? receiverAvatar[0] : receiverAvatar || "";

  const {
    room,
    messages,
    loading,
    flatListRef,
    handleSendMessage,
  } = useChatMessages(safeChatId, safeReceiverId, user?._id ? { _id: user._id } : null);

  if (loading) return null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
       keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View className="flex-1 bg-white">
        <ChatHeader name={safeReceiverName} avatar={safeReceiverAvatar} hostId={safeReceiverId} />

        {room && <RoomHeader room={room} />}

        <MessagesList
          messages={messages}
          flatListRef={flatListRef}
          userId={user?._id ?? ""}
        />

       
        <MessageInput
          receiverId={safeReceiverId}
          onMessageSent={handleSendMessage}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
