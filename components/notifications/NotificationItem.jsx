import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/vi";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

export default function NotificationItem({ item, onPress, onDelete }) {
  const isUnread = !item.isRead;

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.5],
      extrapolate: "clamp",
    });

    return (
      <TouchableOpacity
        onPress={onDelete}
        className="bg-red-500 justify-center items-center px-6"
        style={{ marginVertical: 0 }}
      >
        <Animated.View style={{ transform: [{ scale }] }} className="items-center">
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Text className="text-white text-xs mt-1">Xóa</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      renderRightActions={onDelete ? renderRightActions : undefined}
      overshootRight={false}
    >
      <TouchableOpacity
        onPress={onPress}
        className={`flex-row p-3 border-b border-gray-200 ${
          isUnread ? "bg-blue-50" : "bg-white"
        }`}
        activeOpacity={0.8}
      >
        {/* Avatar */}
        {item.avatar ? (
          <Image
            source={{ uri: item.avatar }}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-gray-300 items-center justify-center">
            <Ionicons name="notifications" size={24} color="#374151" />
          </View>
        )}

        <View className="flex-1 ml-3">
          <Text className="font-semibold text-black">{item.title}</Text>
          <Text className="text-gray-600 mt-0.5" numberOfLines={2}>
            {item.message}
          </Text>
          <Text className="text-xs text-gray-400 mt-1">
            {moment(item.createdAt).fromNow()}
          </Text>
        </View>

        {/* Chấm xanh cho thông báo chưa đọc */}
        {isUnread && (
          <View className="self-center w-3 h-3 rounded-full bg-blue-500" />
        )}
      </TouchableOpacity>
    </Swipeable>
  );
}
