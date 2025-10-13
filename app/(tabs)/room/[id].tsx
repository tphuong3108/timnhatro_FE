import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import rooms from "@/constants/data/rooms";
import type { Room } from "@/app/(tabs)/home/RoomCard";

const { width } = Dimensions.get("window");

export default function RoomDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");

  const roomInfo = useMemo<Room>(() => {
    return rooms.find((r) => r.id === id) || rooms[0];
  }, [id]);

  const room = {
    ...roomInfo,
    address: "123 Lý Tự Trọng, Quận 1, TP.HCM",
    avgRating: 4.7,
    totalRatings: 128,
    description:
      "Phòng trọ mới xây, sạch sẽ, có ban công, view đẹp. Gần trung tâm, siêu thị và trường học. Giá đã bao gồm wifi và rác.",
    owner: {
      name: "Nguyễn Văn A",
      phone: "0909 123 456",
      avatar: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
    },
    images: [
      "https://i.imgur.com/Mx7dA2l.jpg",
      "https://i.imgur.com/3mT4HcV.jpg",
      "https://i.imgur.com/bRg1YDJ.jpg",
    ],
    amenities: [
      { name: "Wifi miễn phí", icon: "wifi-outline" },
      { name: "Máy lạnh", icon: "snow-outline" },
      { name: "Chỗ để xe", icon: "car-outline" },
      { name: "Camera an ninh", icon: "videocam-outline" },
    ],
    comments: [
      {
        user: "Trần Thị B",
        avatar: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
        content: "Phòng sạch, chủ nhà thân thiện lắm ạ!",
      },
      {
        user: "Lê Văn C",
        avatar: "https://cdn-icons-png.flaticon.com/512/1946/1946429.png",
        content: "Giá hơi cao nhưng đáng tiền, vị trí đẹp.",
      },
    ],
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Hình ảnh */}
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

      {/* Tên phòng */}
      <View className="flex-row justify-between items-center px-4 py-3">
        <Text
          className="font-bold text-gray-800 flex-1"
          style={{ fontSize: width > 400 ? 20 : 17 }}
        >
          {room.title}
        </Text>
        <TouchableOpacity onPress={() => setLiked(!liked)} activeOpacity={0.8}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={28}
            color={liked ? "#E63946" : "#777"}
          />
        </TouchableOpacity>
      </View>

      {/* Địa chỉ + rating */}
      <View className="px-4 mb-2">
        <Text className="text-gray-600 text-[13px]">📍 {room.address}</Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={18} color="#FFD700" />
          <Text className="ml-1 text-gray-700">
            {room.avgRating} ({room.totalRatings} lượt đánh giá)
          </Text>
        </View>
      </View>

      {/* Người cho thuê */}
      <View className="px-4 py-3 border-t border-gray-100">
        <Text className="font-semibold text-lg mb-2">Người cho thuê</Text>
        <View className="flex-row items-center">
          <Image
            source={{ uri: room.owner.avatar }}
            className="w-12 h-12 rounded-full mr-3"
          />
          <View>
            <Text className="font-semibold text-gray-800">{room.owner.name}</Text>
            <Text className="text-gray-600 text-[13px]">📞 {room.owner.phone}</Text>
          </View>
        </View>
      </View>

      {/* Mô tả */}
      <View className="px-4 py-3 border-t border-gray-100">
        <Text className="font-semibold text-lg mb-2">Mô tả</Text>
        <Text className="text-gray-700 leading-5">{room.description}</Text>
      </View>

      {/* Tiện ích */}
      <View className="px-4 py-3 border-t border-gray-100">
        <Text className="font-semibold text-lg mb-2">Tiện ích</Text>
        <View className="flex-row flex-wrap">
          {room.amenities.map((item, i) => (
            <View
              key={i}
              className="flex-row items-center bg-gray-100 px-3 py-2 rounded-full mr-2 mb-2"
            >
              <Ionicons name={item.icon as any} size={18} color="#3F72AF" />
              <Text className="ml-2 text-gray-700 text-[13px]">{item.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bình luận */}
      <View className="px-4 py-3 border-t border-gray-100">
        <Text className="font-semibold text-lg mb-3">Bình luận</Text>
        {room.comments.map((cmt, i) => (
          <View key={i} className="flex-row mb-3">
            <Image
              source={{ uri: cmt.avatar }}
              className="w-10 h-10 rounded-full mr-3"
            />
            <View className="flex-1 bg-gray-50 rounded-xl p-3">
              <Text className="font-semibold text-gray-800 text-[14px]">{cmt.user}</Text>
              <Text className="text-gray-600 mt-1 text-[13px]">{cmt.content}</Text>
            </View>
          </View>
        ))}

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
              alert("Đã gửi bình luận: " + comment);
              setComment("");
            }}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}
