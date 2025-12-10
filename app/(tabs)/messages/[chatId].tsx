import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../../../contexts/AuthContext";

import ChatHeader from "./components/ChatHeader";
import RoomHeader from "./components/RoomHeader";
import MessagesList from "./components/MessagesList";
import MessageInput from "./components/MessageInput";
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
  } = useChatMessages(safeChatId, safeReceiverId, user);

  if (loading) return null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
       keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View className="flex-1 bg-white">
        <ChatHeader name={safeReceiverName} avatar={safeReceiverAvatar} />

        {room && <RoomHeader room={room} />}

        <MessagesList
          messages={messages}
          flatListRef={flatListRef}
          userId={user?._id ?? ""}
        />

       
        <View className="pb-6">
          <MessageInput
            receiverId={safeReceiverId}
            onMessageSent={handleSendMessage}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
