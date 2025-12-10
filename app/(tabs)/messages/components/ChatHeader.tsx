import React from "react";
import { View, Text, Image } from "react-native";

interface Props {
  name: string;
  avatar?: string;
  
}

export default function ChatHeader({ name, avatar }: Props) {
  return (
    <View
      className="flex-row items-center px-3 py-3 border-b border-gray-200"
      style={{ backgroundColor: "#B9D7EA" }}
    >

      {/* Avatar + Name */}
      <View className="flex-row items-center text-center">
        <Image
          source={{
        
              uri: avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          className="w-10 h-10 rounded-full mr-3"
        />

        <Text className="text-lg font-semibold text-white">{name}</Text>
      </View>
    </View>
  );
}
