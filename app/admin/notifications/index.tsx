import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import NotificationItemAdmin from "./NotificationItemAdmin";
import { notificationApi } from "@/services/notificationApi";
import { useRouter } from "expo-router";

interface IAdminNotification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  avatar?: string;
  metadata?: any;
}

export default function AdminNotificationsScreen() {
  const router = useRouter();
  const [notis, setNotis] = useState<IAdminNotification[]>([]);

    const loadNotifs = async () => {
    try {
        const arr = await notificationApi.getAdminNotifications();
        setNotis(Array.isArray(arr) ? arr : []);
    } catch (e) {
        console.log("Admin load notifications error:", e);
    }
    };


  // mark as read
  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotis(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.log("Mark read error:", e);
    }
  };

  useEffect(() => {
    loadNotifs();
    const interval = setInterval(loadNotifs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 bg-white">
      <Text className="text-xl font-bold p-4">Thông báo quản trị</Text>

      <FlatList
        data={notis}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <NotificationItemAdmin
            item={item}
            onPress={() => {
              if (!item.isRead) markAsRead(item._id);
            }}
          />
        )}
      />
    </View>
  );
}
