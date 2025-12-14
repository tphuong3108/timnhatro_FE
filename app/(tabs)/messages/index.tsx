import { useRouter } from "expo-router";
import React, {useState,useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,Alert
} from "react-native";
import { useAuth } from "../../../contexts/AuthContext";
import { chatService } from "../../../services/chatService";
import { useFocusEffect } from "@react-navigation/native";

export default function ChatListScreen() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  // Load list
  const loadChats = async () => {
    try {
      setLoading(true);
      const chatsData = await chatService.getUserChats();
      setChats(Array.isArray(chatsData) ? chatsData : []);
    } catch (error) {
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadChats();
    }, [])
  );

  const handleDeleteChat = (chatId: string) => {
    Alert.alert(
      "Xóa đoạn chat",
      "Bạn có chắc chắn muốn xóa đoạn chat này?\nToàn bộ tin nhắn sẽ bị xóa.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            const success = await chatService.deleteChat(chatId);
            if (success) {
              setChats((prev) => prev.filter((c) => c._id !== chatId));
            }
          },
        },
      ]
    );
  };

  if (loading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3F72AF" />
      </View>
    );

  if (!user?._id)
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500 text-lg">Không tìm thấy người dùng</Text>
      </View>
    );

  return (
    <View className="flex-1 bg-white">
      <TouchableOpacity
        onPress={() => router.push("/messages/ai")}
        className="flex-row items-center px-4 py-4 border-b border-gray-200 bg-white"
      >
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/4712/4712100.png",
          }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View>
          <Text className="font-semibold text-[16px] text-gray-800">
            Trợ lý AI
          </Text>
          <Text className="text-gray-500 text-[13px]">Hỏi tôi bất cứ điều gì...</Text>
        </View>
      </TouchableOpacity>

      <FlatList
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const partner =
            item.participants.find((p: any) => p._id !== user._id) ||
            item.participants[0];

          return (
            <TouchableOpacity
             onLongPress={() => handleDeleteChat(item._id)} 
              onPress={() => {
                router.push({
                  pathname: "/messages/[chatId]",
                  params: {
                    chatId: item._id,
                    receiverId: partner._id,
                    receiverName: `${partner.firstName} ${partner.lastName}`,
                    roomId: item.roomId?._id,
                  },
                });
              }}
              className="flex-row items-center px-4 py-3 border-b border-gray-200 active:bg-gray-100"
            >
              <Image
                source={{
                  uri:
                    partner.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                }}
                className="w-12 h-12 rounded-full mr-3 border border-gray-300"
              />
              <View className="flex-1">
                <Text className="font-semibold text-[16px] text-gray-800">
                  {partner.firstName} {partner.lastName}
                </Text>
                <Text className="text-gray-500 text-[14px] mt-1">
                  {item.lastMessage?.content || "Chưa có tin nhắn"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}