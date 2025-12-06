import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/vi";

export default function NotificationItem({ item, onPress }) {
  const isUnread = !item.isRead;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row p-3 ${isUnread ? "bg-blue-100" : "bg-white"}`}
      activeOpacity={0.8}
    >
      {/* Avatar hoặc icon */}
      {item.avatar ? (
        <Image
          source={{ uri: item.avatar }}
          className="w-12 h-12 rounded-full"
        />
      ) : (
        <View className="w-12 h-12 rounded-full bg-blue-200 items-center justify-center">
          <Ionicons name="notifications" size={24} color="#1d4ed8" />
        </View>
      )}

      {/* Nội dung */}
      <View className="flex-1 ml-3">
        <Text className={`font-semibold ${isUnread ? "text-black" : "text-gray-700"}`}>
          {item.title}
        </Text>
        <Text className="text-gray-600 mt-0.5">{item.message}</Text>
        <Text className="text-xs text-gray-400 mt-1">
          {moment(item.createdAt).fromNow()}
        </Text>
      </View>

      {/* Chấm xanh chưa đọc */}
      {isUnread && (
        <View className="w-3 h-3 rounded-full bg-blue-600 self-center mr-1" />
      )}
    </TouchableOpacity>
  );
}
