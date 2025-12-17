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
  Alert,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Heart } from "lucide-react-native";
import { useRouter } from "expo-router";
import { roomApi } from "@/services/roomApi";

const { width, height } = Dimensions.get("window");

export default function Banner({
  room,
  liked,
  setLiked,
  favorited,
  setFavorited,
  currentImage,
  handleScroll,
  shareRoom,
  refreshRoomStatus,
}: any) {
  const [showViewer, setShowViewer] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const mediaItems = [
    ...(room?.images || []).map((img: string) => ({ type: "image", uri: img })),
    ...(room?.videos || []).map((vid: string) => ({ type: "video", uri: vid })),
  ];

  const openViewer = (index: number) => {
    setViewerIndex(index);
    setShowViewer(true);
  };

  //  Like phòng
  const handleLikeRoom = async () => {
    if (!room?._id) return Alert.alert("Lỗi", "Không thể xác định phòng này.");
    try {
      await roomApi.likeRoom(room._id);
      setLiked((prev: boolean) => !prev);
      await refreshRoomStatus?.();
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái thả tim.");
    }
  };

  //  Lưu phòng / bỏ lưu
  const handleFavoriteRoom = async () => {
    if (!room?.slug) return Alert.alert("Lỗi", "Không thể xác định phòng này.");

    try {
      if (!favorited) {
        await roomApi.addToFavorites(room.slug);
        setFavorited(true);
        Alert.alert("Thành công", "Đã lưu phòng vào danh sách yêu thích.");
      } else {
        await roomApi.removeFromFavorites(room.slug);
        setFavorited(false);
        Alert.alert("Thành công", "Đã xoá khỏi danh sách yêu thích.");
      }

      await refreshRoomStatus?.();
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể cập nhật danh sách yêu thích.");
    }
  };

  const handleReport = () => {
    setShowMenu(false);
    if (!room?._id) return Alert.alert("Lỗi", "Không thể xác định phòng.");
    router.push(`/room/ReportRoom?id=${room._id}`);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
    handleScroll?.(e);
  };

  return (
    <View className="relative">
      {/* Media */}
      <View style={{ height: width * 0.6 }}>
        <ScrollView
          horizontal
          pagingEnabled
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          className="w-full"
        >
          {mediaItems.map((item, i) => (
            <TouchableOpacity key={i} activeOpacity={0.9} onPress={() => openViewer(i)}>
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

      {/* Counter */}
      {mediaItems.length > 1 && (
        <View
          style={{
            position: "absolute",
            bottom: 30,
            right: 16,
            backgroundColor: "rgba(0,0,0,0.5)",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 16,
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            {currentIndex + 1} / {mediaItems.length}
          </Text>
        </View>
      )}

      {/* Floating buttons */}
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
        <TouchableOpacity onPress={shareRoom} className="bg-white/80 p-2.5 rounded-full">
          <Feather name="share-2" size={20} color="#112D4E" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLikeRoom} className="bg-white/80 p-2.5 rounded-full">
          <Heart size={20} color={liked ? "#E63946" : "#112D4E"} fill={liked ? "#E63946" : "none"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleFavoriteRoom} className="bg-white/80 p-2.5 rounded-full">
          <Ionicons
            name={favorited ? "bookmark" : "bookmark-outline"}
            size={20}
            color={favorited ? "#FFD700" : "#112D4E"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowMenu(true)} className="bg-white/80 p-2.5 rounded-full">
          <Ionicons name="ellipsis-vertical" size={20} color="#112D4E" />
        </TouchableOpacity>
      </View>

      {/* Report modal */}
      <Modal visible={showMenu} transparent animationType="slide" onRequestClose={() => setShowMenu(false)}>
        <Pressable className="flex-1 bg-black/40 justify-end" onPress={() => setShowMenu(false)}>
          <View className="bg-white rounded-t-3xl pt-3 pb-6 px-5" onStartShouldSetResponder={() => true}>
            <View className="self-center w-10 h-1.5 bg-gray-300 rounded-full mb-4" />

            <TouchableOpacity onPress={handleReport} className="py-3.5 border-b border-gray-100 active:bg-gray-50">
              <Text className="text-[#E63946] font-semibold text-center text-base">Báo cáo phòng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowMenu(false)}
              className="py-3.5 mt-2 active:bg-gray-50 rounded-xl"
            >
              <Text className="text-[#112D4E] font-semibold text-center text-base">Đóng</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Full screen viewer */}
      <Modal visible={showViewer} transparent animationType="fade">
        <View className="bg-black flex-1 justify-center items-center">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: viewerIndex * width, y: 0 }}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setViewerIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {mediaItems.map((item, i) =>
              item.type === "image" ? (
                <Image key={i} source={{ uri: item.uri }} className="w-full h-full" resizeMode="contain" style={{ width, height }} />
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

          {/* Viewer counter */}
          {mediaItems.length > 1 && (
            <View
              style={{
                position: "absolute",
                bottom: 30,
                alignSelf: "center",
                backgroundColor: "rgba(0,0,0,0.6)",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600" }}>
                {viewerIndex + 1} / {mediaItems.length}
              </Text>
            </View>
          )}

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
