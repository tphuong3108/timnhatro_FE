import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";

const chats = [
  {
    id: 1,
    name: "Chủ trọ Nguyễn Văn A",
    lastMessage: "Phòng vẫn còn trống nhé bạn!",
    avatar: "https://cdn-icons-png.flaticon.com/512/9131/9131529.png",
  },
  {
    id: 2,
    name: "Chủ trọ Trần Thị B",
    lastMessage: "Phòng có máy lạnh, toilet riêng nha!",
    avatar: "https://cdn-icons-png.flaticon.com/512/9131/9131530.png",
  },
  {
    id: 3,
    name: "Chủ trọ Lê Hữu C",
    lastMessage: "Giá có thể thương lượng chút nha bạn ^^",
    avatar: "https://cdn-icons-png.flaticon.com/512/9131/9131527.png",
  },
];

export default function InboxScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="bg-[#E8F0FE] py-4 px-5 border-b border-gray-200">
        <Text className="text-lg font-semibold text-[#3F72AF] text-center">
          Tin nhắn
        </Text>
      </View>

      <ScrollView
        className="px-5 pt-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {chats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            className="flex-row items-center py-3 border-b border-gray-100"
            onPress={() =>
              router.push({
                pathname: "../messages/[chatId]",
                params: { chatId: chat.id.toString() },
              })
            }
          >
            <Image
              source={{ uri: chat.avatar }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">{chat.name}</Text>
              <Text className="text-gray-500 text-[13px]" numberOfLines={1}>
                {chat.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
