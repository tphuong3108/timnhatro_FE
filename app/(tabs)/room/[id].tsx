import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import rooms, { Room } from "@/constants/data/rooms";

const { width } = Dimensions.get("window");

export default function RoomDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  // ✅ Tìm phòng theo id (nếu không có thì lấy phòng đầu tiên)
  const room = useMemo<Room>(() => {
    return rooms.find((r) => r._id === id) || rooms[0];
  }, [id]);

  return (
    <View className="flex-1 bg-white">
      {/* Hình ảnh */}
      <View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          className="w-full bg-gray-100"
          style={{ height: width * 0.55 }}
        >
          {room.images.map((img, i) => (
            <Image
              key={i}
              source={{ uri: img }}
              className="w-full h-full"
              style={{ width }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Nút ba chấm */}
        <TouchableOpacity
          onPress={() => setShowMenu(true)}
          className="absolute top-3 right-3 bg-[rgba(0,0,0,0.4)] p-2 rounded-full"
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Nội dung */}
      <ScrollView className="flex-1">
        {/* Tên phòng */}
        <View className="flex-row justify-between items-center px-4 py-3">
          <Text
            className="font-bold text-gray-800 flex-1"
            style={{ fontSize: width > 400 ? 20 : 17 }}
          >
            {room.name}
          </Text>
          <TouchableOpacity onPress={() => setLiked(!liked)} activeOpacity={0.8}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={28}
              color={liked ? "#E63946" : "#777"}
            />
          </TouchableOpacity>
        </View>

        {/* Địa chỉ + đánh giá */}
        <View className="px-4 mb-2">
          <Text className="text-gray-600 text-[13px]">📍 {room.address}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text className="ml-1 text-gray-700">
              {room.avgRating} ({room.totalRatings} lượt đánh giá)
            </Text>
          </View>
        </View>

        {/* Giá phòng */}
        <View className="px-4 py-3 border-t border-gray-100">
          <Text className="text-[#3F72AF] font-bold text-lg">
            {room.price.toLocaleString("vi-VN")}đ / đêm
          </Text>
        </View>

        {/* Mô tả */}
        <View className="px-4 py-3 border-t border-gray-100">
          <Text className="font-semibold text-lg mb-2">Mô tả</Text>
          <Text className="text-gray-700 leading-5">
            {room.name} nằm ở vị trí thuận tiện, sạch sẽ, gần trung tâm, có view
            đẹp và tiện nghi đầy đủ.
          </Text>
        </View>

        {/* Bình luận */}
        <View className="px-4 py-3 border-t border-gray-100">
          <Text className="font-semibold text-lg mb-3">Bình luận</Text>

          <View className="flex-row mb-3">
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
              }}
              className="w-10 h-10 rounded-full mr-3"
            />
            <View className="flex-1 bg-gray-50 rounded-xl p-3">
              <Text className="font-semibold text-gray-800 text-[14px]">
                Trần Thị B
              </Text>
              <Text className="text-gray-600 mt-1 text-[13px]">
                Phòng sạch, chủ nhà thân thiện lắm ạ!
              </Text>
            </View>
          </View>

          {/* Nhập bình luận */}
          <View className="flex-row items-center mt-2 border-t border-gray-200 pt-2">
            <TextInput
              placeholder="Viết bình luận..."
              value={comment}
              onChangeText={setComment}
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-[13px]"
            />
            <TouchableOpacity
              className="ml-2 bg-[#3F72AF] p-2 rounded-full"
              onPress={() => {
                if (!comment.trim()) return;
                Alert.alert("Đã gửi bình luận", comment);
                setComment("");
              }}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* Popup menu */}
      <Modal visible={showMenu} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-[rgba(0,0,0,0.3)] justify-end"
          onPress={() => setShowMenu(false)}
        >
          <View className="bg-white rounded-t-2xl p-5">
            <TouchableOpacity
              onPress={() => {
                setShowMenu(false);
                router.push(`/room/ReportRoom?id=${room._id}`);
              }}
              className="flex-row items-center py-3 border-b border-gray-100"
            >
              <Ionicons name="alert-circle-outline" size={22} color="#E63946" />
              <Text className="ml-2 text-red-500 text-base font-medium">
                Báo cáo phòng
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowMenu(false)}
              className="mt-3 py-3"
            >
              <Text className="text-center text-gray-600 text-base">Hủy</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
