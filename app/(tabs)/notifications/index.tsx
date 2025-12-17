import NotificationItem from "@/components/notifications/NotificationItem";
import { notificationApi } from "@/services/notificationApi";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

interface INotification {
  _id?: string;
  id?: string;
  item_id?: string;
  chatId?: string | number;
  postId?: string | number;
  bookingId?: string | number;
  slug?: string;

  title: string;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
  avatar?: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notis, setNotis] = useState<INotification[]>([]);

  const loadNotifs = async () => {
    try {
      const data = await notificationApi.getMyNotifications();
      if (!Array.isArray(data)) return setNotis([]);
      setNotis(data);
    } catch (e) {
    }
  };

  const getRealId = (item: INotification) =>
    item._id?.toString() || item.id?.toString() || item.item_id?.toString() || null;

  const handleOpenNotification = async (item: INotification) => {
    const realId = getRealId(item);

    // Đánh dấu đã đọc
    if (realId && !item.isRead) {
      try {
        await notificationApi.markAsRead(realId);
        setNotis(prev =>
          prev.map(n =>
            getRealId(n) === realId ? { ...n, isRead: true } : n
          )
        );
      } catch (e) {
      }
    }

    if (item.chatId) {
      router.push({
        pathname: "/messages/[chatId]",
        params: { chatId: item.chatId.toString() }
      });
      return;
    }

    if (item.slug) {
      router.push(`/room/${item.slug}` as any);
      return;
    }

    if (item.postId) {
      router.push(`/room/${item.postId}` as any);
      return;
    }

    if (item.bookingId) {
      router.push("/booking/HostBookingList");
      return;
    }
  };


  useEffect(() => {
    loadNotifs();
    const interval = setInterval(loadNotifs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 bg-white">
      <Text className="text-xl font-bold p-4">Thông báo</Text>

      <FlatList
        data={notis}
        keyExtractor={(item) => getRealId(item) || Math.random().toString()}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={() => handleOpenNotification(item)} />
        )}
      />
    </View>
  );
}
