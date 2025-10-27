import React, { useRef } from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; 
import { useRouter } from "expo-router";

const CARD_WIDTH = 180;
const CARD_HEIGHT = 200;
const SPACING = 12;

const featuredRooms = [
  {
    id: "1",
    name: "Phòng cao cấp trung tâm thành phố",
    price: "5.000.000đ / tháng",
    views: 1240,
    image:
      "https://images.unsplash.com/photo-1595526114035-0f50155e8f7b?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "2",
    name: "Phòng view Landmark 81 cực đẹp",
    price: "6.200.000đ / tháng",
    views: 890,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "3",
    name: "Phòng studio đầy đủ tiện nghi",
    price: "4.500.000đ / tháng",
    views: 1032,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=60",
  },
];

export default function RoomCarousel({
  rooms = featuredRooms,
}: {
  rooms?: typeof featuredRooms;
}) {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View className="mt-2">
      <Animated.FlatList
        data={Array.isArray(rooms) ? rooms : []}
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
                  <View className="absolute bottom-0 left-0 right-0 h-[75px] bg-black/35" />

                  <View className="p-3 flex-col space-y-1">
                    <Text
                      className="text-white font-semibold text-[15px] leading-tight drop-shadow-md"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.name}
                    </Text>
                    <View className="flex-row items-center space-x-1 mt-1">
                      <MaterialIcons name="attach-money" size={15} color="white" />
                      <Text className="text-gray-100 text-[12px]">
                        {item.price}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="eye-outline" size={14} color="#D1D5DB" />
                      <Text className="text-gray-300 text-[12px] ml-2">
                          {(item?.views ?? 0).toLocaleString()}
                      </Text>
                    </View>
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
