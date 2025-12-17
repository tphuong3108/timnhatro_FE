import { HostBookCard } from "@/components/room/HostBookCard";
import { Room } from "@/constants/data/rooms";
import { ResizeMode, Video } from "expo-av";
import { Star } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
    Dimensions,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Text,
    View
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width - 48;
const MEDIA_HEIGHT = 280;

export function MapRoomCard({ room }: { room: Room }) {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasHost = !!room.host;

  const media = [...(room.videos || []), ...(room.images || [])];

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
    setCurrentIndex(index);
  };

  return (
    <View className="bg-white rounded-3xl overflow-hidden">
      {/* Carousel ảnh + video */}
      <View className="relative rounded-3xl overflow-hidden">
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          nestedScrollEnabled
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH}
          snapToAlignment="center"
          onMomentumScrollEnd={handleScrollEnd}
        >
          {media.map((item, index) =>
            item.endsWith(".mp4") ? (
              <View
                key={index}
                className="rounded-2xl overflow-hidden"
                style={{ width: ITEM_WIDTH, height: MEDIA_HEIGHT }}
              >
                <Video
                  source={{ uri: item }}
                  style={{ width: ITEM_WIDTH, height: MEDIA_HEIGHT }}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay={currentIndex === index}
                  isLooping
                  useNativeControls
                />
              </View>
            ) : (
              <Image
                key={index}
                source={{ uri: item }}
                className="rounded-2xl"
                style={{ width: ITEM_WIDTH, height: MEDIA_HEIGHT }}
                resizeMode="cover"
              />
            )
          )}
        </ScrollView>

        {/* Dấu chấm phân trang */}
        {media.length > 1 && (
          <View className="absolute bottom-3 w-full flex-row justify-center items-center z-20">
            {media.map((_, i) => (
              <View
                key={i}
                className={`w-2.5 h-2.5 mx-[2px] rounded-full ${
                  i === currentIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </View>
        )}

        {hasHost && <HostBookCard host={room.host!} />}
      </View>

      {/* Thông tin phòng */}
      <View className="p-3">
        <Text className="text-lg font-semibold text-[#112D4E]">{room.name}</Text>
        <Text className="text-gray-500 text-sm mt-1" numberOfLines={1}>
          {room.address}
        </Text>
        <View className="flex-row items-center mt-2">
          <Star size={16} color="#FACC15" fill="#FACC15" />
          <Text className="ml-1 text-sm text-gray-700">
            {room.avgRating} ({room.totalRatings})
          </Text>
        </View>
        <Text className="text-[#3F72AF] font-semibold mt-2">
          {room.price.toLocaleString("vi-VN")}đ / tháng
        </Text>
      </View>
    </View>
  );
}
