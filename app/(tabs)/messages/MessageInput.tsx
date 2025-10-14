import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export default function MessageInput({ value, onChangeText, onSend }: Props) {
  return (
    <View className="flex-row items-center border-t border-gray-200 px-3 py-2 bg-white">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Nhập tin nhắn..."
        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-[14px]"
      />
      <TouchableOpacity
        onPress={onSend}
        disabled={!value.trim()}
        className="ml-2 bg-[#3F72AF] p-2 rounded-full"
      >
        <Ionicons name="send" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
