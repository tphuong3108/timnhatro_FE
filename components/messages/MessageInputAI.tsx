import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View } from "react-native";

type MessageInputAIProps = {
  onSend: (text: string) => void;
  bottomInset?: number;
};

export default function MessageInputAI({ onSend , bottomInset = 0 }: MessageInputAIProps) {
  const [value, setValue] = useState("");

  const send = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  };

  return (
     <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "position"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View
        className="flex-row items-center border-t border-gray-200 px-3 py-2 bg-white"
        style={{
          paddingBottom: 30,
        }}
      >
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="Hỏi AI điều gì đó..."
          placeholderTextColor="#6B7280"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-[14px] text-black"
          style={{ minHeight: 40 }}
        />

        <TouchableOpacity
          onPress={send}
          disabled={!value.trim()}
          className={`ml-2 p-2 rounded-full ${
            value.trim() ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <Ionicons name="sparkles-outline" size={20} color="#fff" />
        </TouchableOpacity>
      
      </View>
    </KeyboardAvoidingView>
  );
}
