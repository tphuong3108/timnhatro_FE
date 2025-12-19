import { notificationApi } from "@/services/notificationApi";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
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
      // Error loading notifications
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
    const interval = setInterval(loadNotifs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GestureHandlerRootView className="flex-1 -mx-4 bg-[#F9FAFB]">
      <Text className="text-xl font-bold p-4">Thông báo quản trị</Text>

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


