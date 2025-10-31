import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { Video, ResizeMode } from "expo-av";

interface MediaPickerProps {
  media: string[];
  pickMedia: () => void;
  removeMedia: (uri: string) => void;
}

export default function MediaPicker({
  media,
  pickMedia,
  removeMedia,
}: MediaPickerProps) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentUri, setCurrentUri] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);

  const openPreview = (uri: string) => {
    setCurrentUri(uri);
    setIsVideo(uri.toLowerCase().endsWith(".mp4") || uri.toLowerCase().endsWith(".mov"));
    setPreviewVisible(true);
  };

  return (
    <View className="mb-5">
      <Text className="text-[#3F72AF] font-semibold mb-2">Ảnh / Video</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: "row", gap: 10 }}
      >
        {media?.map((uri, i) => {
          const isVid = uri.toLowerCase().endsWith(".mp4") || uri.toLowerCase().endsWith(".mov");

          return (
            <View key={i} className="relative">
              <TouchableOpacity onPress={() => openPreview(uri)}>
                {isVid ? (
                  <View className="w-[90px] h-[90px] rounded-xl bg-black items-center justify-center">
                    <Ionicons name="play-circle" size={32} color="#fff" />
                  </View>
                ) : (
                  <Image
                    source={{ uri }}
                    className="w-[90px] h-[90px] rounded-xl"
                    resizeMode="cover"
                  />
                )}
              </TouchableOpacity>

              {/* Nút xóa */}
              <TouchableOpacity
                onPress={() => removeMedia(uri)}
                className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
              >
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Nút thêm ảnh/video */}
        <TouchableOpacity
          onPress={pickMedia}
          className="w-[90px] h-[90px] border border-dashed border-gray-400 items-center justify-center rounded-xl"
        >
          <Ionicons name="add-outline" size={28} color="#3F72AF" />
          <Text className="text-[12px] text-[#3F72AF]">Thêm</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal xem trước */}
      <Modal visible={previewVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/90 items-center justify-center">
          {currentUri &&
            (isVideo ? (
              <Video
                source={{ uri: currentUri }}
                style={{ width: "90%", height: "70%", borderRadius: 10 }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
              />
            ) : (
              <Image
                source={{ uri: currentUri }}
                className="w-[90%] h-[70%] rounded-lg"
                resizeMode="contain"
              />
            ))}

          <Pressable
            onPress={() => setPreviewVisible(false)}
            className="absolute top-10 right-10 bg-black/70 p-2 rounded-full"
          >
            <Ionicons name="close" size={26} color="#fff" />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
