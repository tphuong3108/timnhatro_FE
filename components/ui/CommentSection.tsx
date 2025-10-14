import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CommentSection() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: "1",
      user: "Mai",
      text: "Phòng đẹp quá 😍",
      avatar: "https://i.pravatar.cc/50?img=1",
      time: "2025-10-12T14:20:00",
    },
    {
      id: "2",
      user: "Tú",
      text: "Gần trường luôn, thích quá",
      avatar: "https://i.pravatar.cc/50?img=2",
      time: "2025-10-12T14:25:00",
    },
  ]);

  const formatDate = (isoString: string | number | Date) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString("vi-VN")} ${date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const handleAddComment = () => {
    if (comment.trim() === "") return;
    const newComment = {
      id: Date.now().toString(),
      user: "Bạn",
      text: comment,
      avatar: "https://i.pravatar.cc/50?img=5",
      time: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
    setComment("");
  };

  return (
    <View className="border-t border-gray-200 px-4 py-3">
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-start mb-3">
            <Image
              source={{ uri: item.avatar }}
              className="w-8 h-8 rounded-full mr-2"
            />
            <View className="flex-1 bg-gray-100 rounded-xl px-3 py-2">
              <Text className="font-semibold text-gray-800">{item.user}</Text>
              <Text className="text-gray-700 text-sm">{item.text}</Text>
              <Text className="text-gray-400 text-xs mt-1">
                {formatDate(item.time)}
              </Text>
            </View>
          </View>
        )}
      />

      <View className="flex-row items-center mt-2">
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Viết bình luận..."
          className="flex-1 bg-gray-100 rounded-full px-3 py-2 text-sm"
        />
        <TouchableOpacity onPress={handleAddComment} className="ml-2">
          <Ionicons name="send" size={20} color="#3F72AF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
