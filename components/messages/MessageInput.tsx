import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  receiverId: string;
  onMessageSent?: (text: string) => void;
}

export default function MessageInput({ receiverId, onMessageSent }: Props) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!value.trim() || !receiverId || loading) return;

    setLoading(true);

    // Gửi text cho ChatRoom
    onMessageSent?.(value.trim());

    setValue("");
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "position"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View
        className="flex-row items-center border-t border-gray-200 px-3 py-2 bg-white"
        style={{ paddingBottom: 30 }}
      >
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#6B7280"
          editable={!loading}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-[14px] text-black"
          style={{ minHeight: 40 }}
        />

        <TouchableOpacity
          onPress={handleSend}
          disabled={!value.trim() || loading}
          className={`ml-2 p-2 rounded-full ${
            value.trim() ? "bg-[#3F72AF]" : "bg-gray-300"
          }`}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}


