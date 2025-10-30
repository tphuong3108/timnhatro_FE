import React, { useRef } from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";

const CARD_WIDTH = 180;
const CARD_HEIGHT = 200;
const SPACING = 12;

const nearbyRooms = [
  {
    id: "1",
    name: "Phòng gần trung tâm",
    distance: "2km từ vị trí của bạn",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "2",
    name: "Phòng có ban công",
    distance: "5km từ bạn",
    image:
      "https://images.unsplash.com/photo-1595526114035-0f50155e8f7b?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "3",
    name: "Phòng mini tiện nghi",
    distance: "4km từ bạn",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "4",
    name: "Phòng có máy lạnh",
    distance: "3km từ bạn",
    image:
      "https://images.unsplash.com/photo-1560067174-8947b61a2c2e?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "5",
    name: "Phòng gần đại học",
    distance: "6km từ bạn",
    image:
      "https://images.unsplash.com/photo-1616628188533-8e0cb4123b4d?auto=format&fit=crop&w=800&q=60",
  },
];

export default function NearbyRooms() {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View className="mt-2">
      <Animated.FlatList
        data={nearbyRooms}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + SPACING}
        snapToAlignment="center"
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        ItemSeparatorComponent={() => <View style={{ width: SPACING }} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * (CARD_WIDTH + SPACING),
            index * (CARD_WIDTH + SPACING),
            (index + 1) * (CARD_WIDTH + SPACING),
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.95, 1, 0.95],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              className="rounded-2xl overflow-hidden"
              style={{
                transform: [{ scale }],
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                className="flex-1 rounded-2xl overflow-hidden shadow-md"
                onPress={() => router.push(`/room/${item.id}` as any)}
              >
                <ImageBackground
                  source={{ uri: item.image }}
                  resizeMode="cover"
                  className="flex-1 justify-end"
                >
                  <View className="absolute bottom-0 left-0 right-0 h-[50px] bg-black/35" />

                  <View className="p-3">
                    <Text
                      className="text-white font-semibold text-[15px] leading-tight drop-shadow-md"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.name}
                    </Text>
                    <Text className="text-gray-200 text-[12px] mt-1 ml-[2px]">
                      {item.distance}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}
