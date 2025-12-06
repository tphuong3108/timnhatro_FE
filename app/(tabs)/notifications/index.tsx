import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import NotificationItem from "./NotificationItem";
import { notificationApi } from "@/services/notificationApi";

interface INotification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  avatar?: string;
}

export default function NotificationsScreen() {

  const [notis, setNotis] = useState<INotification[]>([]);

  const loadNotifs = async () => {
    try {
      const data = await notificationApi.getMyNotifications();
      setNotis(data);
    } catch (e) {
      console.log("ERROR:", e);
    }
  };

  const handleMarkRead = async (id: string) => {
    await notificationApi.markAsRead(id);
    setNotis(prev =>
      prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  useEffect(() => {
    loadNotifs();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <Text className="text-xl font-bold p-4">Thông báo</Text>

      <FlatList
        data={notis}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={() => handleMarkRead(item._id)} />
        )}
      />
    </View>
  );
}
