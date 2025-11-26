import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { chatService } from "../../../services/chatService";
import { useAuth } from "../../../contexts/AuthContext";

export default function ChatListScreen() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const chatsData = await chatService.getUserChats();
        setChats(Array.isArray(chatsData) ? chatsData : []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách chat:", err);
        setChats([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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

  if (chats.length === 0)
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500 text-lg">Không có tin nhắn nào</Text>
      </View>
    );

  return (
    <FlatList
      data={chats}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => {
        const partner =
          item.participants.find((p: any) => p._id !== user._id) ||
          item.participants[0];

        return (
          <TouchableOpacity
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
  );
}
