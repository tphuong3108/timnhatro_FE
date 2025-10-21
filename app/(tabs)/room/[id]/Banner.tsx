import React from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import { Heart, HeartOff, Share2, MoreVertical } from "lucide-react-native";
const { width } = Dimensions.get("window");

export default function Banner({
  room,
  liked,
  setLiked,
  currentImage,
  handleScroll,
  shareRoom,
  setShowMenu,
}: any) {
  return (
    <View className="relative">
      {/* Ảnh phòng */}
      <ScrollView
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        className="w-full"
        style={{ height: width * 0.6 }}
      >
        {room.images.map((img: string, i: number) => (
          <Image
            key={i}
            source={{ uri: img }}
            style={{ width, height: width * 0.6 }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Chỉ số ảnh */}
      <View className="absolute bottom-3 right-4 bg-black/60 rounded-md px-2 py-[2px]">
        <Text className="text-white font-semibold text-[12px]">
          {currentImage} / {room.images.length}
        </Text>
      </View>

      {/* Nút chia sẻ, yêu thích, menu */}
      <View
        style={styles.iconContainer}
        className="absolute top-3 right-3 flex-row"
      >
        <TouchableOpacity onPress={shareRoom} style={styles.iconButton}>
          <Feather name="share-2" size={20} color="#112D4E" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setLiked(!liked)} style={styles.iconButton}>
          {liked ? (
            <Heart size={20} color="#E63946" fill="#E63946" />
          ) : (
            <Heart size={20} color="#112D4E" />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.iconButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#112D4E" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    gap: 10,
    zIndex: 20,
    pointerEvents: "box-none",
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 10,
    borderRadius: 50,
  },
});
