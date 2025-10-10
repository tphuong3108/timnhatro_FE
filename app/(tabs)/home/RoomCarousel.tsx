import React, { useRef } from "react";
import { Animated, View, Dimensions } from "react-native";
import RoomCard, { Room } from "./RoomCard";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = 180;
const SPACING = 8;

export default function RoomCarousel({ rooms }: { rooms: Room[] }) {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View className="mt-2">
      <Animated.FlatList
        data={rooms}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + SPACING}
        snapToAlignment="start"
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingLeft: 16,
          paddingRight: 24,
        }}
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
              className="rounded-2xl"
              style={{
                transform: [{ scale }],
                marginRight: SPACING,
              }}
            >
              <RoomCard
                room={item}
                onPress={() => router.push(`/room/${item.id}` as any)}
              />
            </Animated.View>
          );
        }}
      />
    </View>
  );
}
