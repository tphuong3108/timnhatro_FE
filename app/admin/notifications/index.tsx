import { notificationApi } from "@/services/notificationApi";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NotificationItemAdmin from "./NotificationItemAdmin";

interface IAdminNotification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  avatar?: string;
  metadata?: any;
  actionPath?: string | null;
}

export default function AdminNotificationsScreen() {
  const router = useRouter();
  const [notis, setNotis] = useState<IAdminNotification[]>([]);

  const loadNotifs = async () => {
    try {
      const arr = await notificationApi.getAdminNotifications();
      setNotis(Array.isArray(arr) ? arr : []);
    } catch {
    }
  };

  // mark as read
  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotis(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch {
    }
  };

  // Xóa thông báo
  const handleDeleteNotification = async (id: string) => {
    try {
      await notificationApi.deleteNotification(id);
      setNotis(prev => prev.filter(n => n._id !== id));
    } catch {
    }
  };

  useEffect(() => {
    loadNotifs();
    const interval = setInterval(loadNotifs, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GestureHandlerRootView className="flex-1 bg-[#F9FAFB] px-4 pt-4">
      <View className="mb-4">
        <Text className="text-2xl font-bold text-[#112D4E]">Thông báo quản trị</Text>
        <Text className="text-gray-500 text-sm">Theo dõi hoạt động hệ thống</Text>
      </View>

      <FlatList
        data={notis}
        scrollEnabled={false}
        nestedScrollEnabled={true}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <NotificationItemAdmin
            item={item}
            onPress={() => {
              if (!item.isRead) markAsRead(item._id);
              if (item.actionPath) {
                router.push(item.actionPath as any);
                return;
              }
            }}
            onDelete={() => handleDeleteNotification(item._id)}
          />
        )}
      />
    </GestureHandlerRootView>
  );
}


