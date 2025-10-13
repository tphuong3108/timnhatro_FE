import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Carousel from "react-native-reanimated-carousel";
import { Video, ResizeMode } from "expo-av";
import CommentSection from "./CommentSection";

const { width } = Dimensions.get("window");

interface UserInfo {
  name: string;
  avatar: string;
  createdAt?: string;
}

interface RoomItem {
  _id?: string;
  title: string;
  address?: string;
  content?: string;
  images?: string[];
  media?: string[];
  user?: UserInfo;
  createdAt?: string;
}

interface PostCardProps {
  item: RoomItem;
  isFavorite?: boolean;
}

export default function PostCard({ item, isFavorite = false }: PostCardProps) {
  const [liked, setLiked] = useState(isFavorite);
  const [currentIndex, setCurrentIndex] = useState(0);
  const media: string[] = item.media || item.images || [];

  return (
    <View className="bg-white rounded-2xl mb-6 border border-gray-100 overflow-hidden">
      {media.length > 0 && (
       <View className="relative overflow-hidden rounded-2xl">
          <Carousel
            width={width - 42}
            height={380}
            data={media}
            scrollAnimationDuration={400}
            onSnapToItem={(index: number) => setCurrentIndex(index)}
            renderItem={({ item: mediaItem }: { item: string }) => (
              <View className="w-full h-full">
                {mediaItem.endsWith(".mp4") ? (
                  <Video
                    source={{ uri: mediaItem }}
                    className="w-full h-full"
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                  />
                ) : (
                  <Image
                    source={{ uri: mediaItem } as ImageSourcePropType}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                )}
              </View>
            )}
          />

          <View className="absolute top-3 left-3 flex-row items-center bg-black/45 rounded-full px-2 py-1">
            <Image
              source={{
                uri: item.user?.avatar || "https://i.pravatar.cc/100?img=1",
              }}
              className="w-8 h-8 rounded-full border border-white"
            />
            <View className="ml-2">
              <Text className="text-white font-semibold text-sm" numberOfLines={1}>
                {item.user?.name || "Người dùng"}
              </Text>
              <Text className="text-gray-200 text-xs">
                {item.createdAt ? item.createdAt : "Vừa xong"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setLiked(!liked)}
            activeOpacity={0.8}
            className="absolute top-3 right-3 p-2"
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={32}
              color={liked ? "#ef4444" : "#ffff"}
            />
          </TouchableOpacity>

          {media.length > 1 && (
            <View className="absolute bottom-2 w-full flex-row justify-center space-x-1">
              {media.map((_, idx: number) => (
                <View
                  key={idx}
                  className={`h-[6px] w-[6px] rounded-full ${
                    currentIndex === idx ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* Nội dung */}
      <View className="p-4">
        <Text
          className="text-base font-semibold text-gray-800"
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text className="text-gray-500 text-sm mb-1" numberOfLines={1}>
          {item.address}
        </Text>
        <Text className="text-gray-700 text-sm">{item.content}</Text>
      </View>

      {/* Bình luận */}
      <CommentSection />
    </View>
  );
}
