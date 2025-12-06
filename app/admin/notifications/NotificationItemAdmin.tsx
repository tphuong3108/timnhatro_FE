import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/vi";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface IAdminNotification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  avatar?: string;
}

interface Props {
  item: IAdminNotification;
  onPress: () => void;
}

export default function NotificationItemAdmin({ item, onPress }: Props) {
  const isUnread = !item.isRead;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row p-3 border-b border-gray-200 ${
        isUnread ? "bg-gray-100" : "bg-white"
      }`}
      activeOpacity={0.8}
    >
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} className="w-12 h-12 rounded-full" />
      ) : (
        <View className="w-12 h-12 rounded-full bg-gray-300 items-center justify-center">
          <Ionicons name="notifications" size={24} color="#374151" />
        </View>
      )}

      <View className="flex-1 ml-3">
        <Text className="font-semibold text-black">{item.title}</Text>
        <Text className="text-gray-600 mt-0.5">{item.message}</Text>
        <Text className="text-xs text-gray-400 mt-1">
          {moment(item.createdAt).fromNow()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
