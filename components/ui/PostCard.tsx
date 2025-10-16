import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { useRouter } from "expo-router";

interface RoomCardProps {
  item: {
    id?: string;
    _id?: string;
    title?: string;
    name?: string;
    address?: string;
    distance?: string;
    image?: string;
    images?: string[];
  };
  isFavorite?: boolean;
}

export default function PostCard({ item, isFavorite }: RoomCardProps) {
  const router = useRouter();

  const imageUri = item.image || item.images?.[0];

  return (
    <View
      style={{
        width: "48%",
        height: 200,
        marginBottom: 14,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        style={{ flex: 1 }}
        onPress={() => router.push(`/room/${item.id || item._id}` as any)}
      >
        <ImageBackground
          source={{ uri: imageUri }}
          resizeMode="cover"
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 55,
              backgroundColor: "rgba(0,0,0,0.35)",
            }}
          />
          <View style={{ padding: 8 }}>
            <Text
              style={{
                color: "#fff",
                fontWeight: "600",
                fontSize: 14,
                lineHeight: 20,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.name || item.title}
            </Text>

            <Text
              style={{
                color: "#ddd",
                fontSize: 12,
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {item.distance || item.address}
            </Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}
