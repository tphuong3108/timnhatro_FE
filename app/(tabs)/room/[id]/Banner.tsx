import React, { useState } from "react";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Heart } from "lucide-react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function Banner({
  room,
  liked,
  setLiked,
  currentImage,
  handleScroll,
  shareRoom,
}: any) {
  const [showViewer, setShowViewer] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  // ảnh và video
  const mediaItems = [
    ...(room.images || []).map((img: string) => ({ type: "image", uri: img })),
    ...(room.videos || []).map((vid: string) => ({ type: "video", uri: vid })),
  ];

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setShowViewer(true);
  };

  const handleReport = () => {
    setShowMenu(false);
    router.push(`/room/ReportRoom?id=${room._id}`);
  };

  return (
    <View className="relative">
      {/* Ảnh & video */}
      <View style={{ height: width * 0.6 }}>
        <ScrollView
          horizontal
          pagingEnabled
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          className="w-full"
        >
          {mediaItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.9}
              onPress={() => openViewer(i)}
            >
              {item.type === "image" ? (
                <Image
                  source={{ uri: item.uri }}
                  className="w-full"
                  style={{ width, height: width * 0.6 }}
                  resizeMode="cover"
                />
              ) : (
                <Video
                  source={{ uri: item.uri }}
                  className="w-full"
                  style={{ width, height: width * 0.6 }}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay={false}
                  isLooping
                  useNativeControls
                />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Nhóm nút góc phải */}
      <View
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          flexDirection: "row",
          gap: 10,
          zIndex: 99,
        }}
      >
        <TouchableOpacity
          onPress={shareRoom}
          className="bg-white/80 p-2.5 rounded-full"
        >
          <Feather name="share-2" size={20} color="#112D4E" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setLiked(!liked)}
          className="bg-white/80 p-2.5 rounded-full"
        >
          {liked ? (
            <Heart size={20} color="#E63946" fill="#E63946" />
          ) : (
            <Heart size={20} color="#112D4E" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowMenu(true)}
          className="bg-white/80 p-2.5 rounded-full"
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#112D4E" />
        </TouchableOpacity>
      </View>

    <Modal
      visible={showMenu}
      transparent
      animationType="slide"
      onRequestClose={() => setShowMenu(false)}
    >
      <Pressable
        className="flex-1 bg-black/40 justify-end"
        onPress={() => setShowMenu(false)}
      >
        <View
          className="bg-white rounded-t-3xl pt-3 pb-6 px-5"
          onStartShouldSetResponder={() => true}
        >
          {/* Thanh kéo */}
          <View className="self-center w-10 h-1.5 bg-gray-300 rounded-full mb-4" />

          <TouchableOpacity
            onPress={handleReport}
            className="py-3.5 border-b border-gray-100 active:bg-gray-50"
          >
            <Text className="text-[#E63946] font-semibold text-center text-base">
              Báo cáo phòng
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowMenu(false)}
            className="py-3.5 mt-2 active:bg-gray-50 rounded-xl"
          >
            <Text className="text-[#112D4E] font-semibold text-center text-base">
              Đóng
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>


      {/* Modal xem ảnh/video phóng to */}
      <Modal visible={showViewer} transparent animationType="fade">
        <View className="bg-black flex-1 justify-center items-center">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: viewerIndex * width, y: 0 }}
          >
            {mediaItems.map((item, i) =>
              item.type === "image" ? (
                <Image
                  key={i}
                  source={{ uri: item.uri }}
                  className="w-full h-full"
                  resizeMode="contain"
                  style={{ width, height }}
                />
              ) : (
                <Video
                  key={i}
                  source={{ uri: item.uri }}
                  className="w-full h-full"
                  resizeMode={ResizeMode.CONTAIN}
                  shouldPlay
                  useNativeControls
                  isLooping
                  style={{ width, height }}
                />
              )
            )}
          </ScrollView>

          {/* Nút đóng */}
          <Pressable
            className="absolute top-12 right-6 bg-white/80 px-3 py-2 rounded-full"
            onPress={() => setShowViewer(false)}
          >
            <Text className="text-[#112D4E] font-semibold">Đóng</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
