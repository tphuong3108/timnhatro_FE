import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  name: string;
  avatar?: string;
  hostId?: string;
}

export default function ChatHeader({ name, avatar, hostId }: Props) {
  const handlePress = () => {
    if (hostId) {
      router.push(`/(tabs)/user/${hostId}` as any);
    }
  };

  return (
    <View
      className="flex-row items-center px-3 py-3 border-b border-gray-200"
      style={{ backgroundColor: "#B9D7EA" }}
    >
      {/* Avatar + Name */}
      <TouchableOpacity
        activeOpacity={hostId ? 0.7 : 1}
        onPress={handlePress}
        className="flex-row items-center"
      >
        <Image
          source={{
            uri: avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <Text className="text-xl font-semibold text-white">{name}</Text>
      </TouchableOpacity>
    </View>
  );
}

