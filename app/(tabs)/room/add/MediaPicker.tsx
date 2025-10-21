import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function MediaPicker({ media, pickMedia, removeMedia }: any) {
  return (
    <View className="mb-4">
      <Text className="text-[#3F72AF] font-semibold mb-2">Ảnh / Video</Text>
      <View className="flex-row flex-wrap gap-3">
        {media.map((uri: string, i: number) => (
          <View key={i} className="relative">
            <Image source={{ uri }} className="w-[90px] h-[90px] rounded-xl" />
            <TouchableOpacity
              onPress={() => removeMedia(i)}
              className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
            >
              <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          onPress={pickMedia}
          className="w-[90px] h-[90px] border border-dashed border-gray-400 items-center justify-center rounded-xl"
        >
          <Ionicons name="add-outline" size={28} color="#3F72AF" />
          <Text className="text-[12px] text-[#3F72AF]">Thêm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
