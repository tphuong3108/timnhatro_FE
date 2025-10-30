import React, { useEffect } from "react";
import { FlatList, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeInUp,
} from "react-native-reanimated";

// Hiệu ứng hiện dần từng tiện ích
function useRippleAnimation(index: number) {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = index * 100;
    const timeout = setTimeout(() => {
      scale.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.exp),
      });
      opacity.value = withTiming(1, { duration: 350 });
    }, delay);

    return () => clearTimeout(timeout);
  }, [index, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return animatedStyle;
}

// Danh sách tiện ích
const allAmenities = [
  { icon: "wifi-outline", name: "Wi-Fi miễn phí", color: "#3F72AF", type: "Ionicons" },
  { icon: "tv-outline", name: "TV", color: "#3F72AF", type: "Ionicons" },
  { icon: "snowflake", name: "Điều hòa", color: "#3F72AF", type: "Material" },
  { icon: "washing-machine", name: "Máy giặt", color: "#3F72AF", type: "Material" },
  { icon: "stove", name: "Khu bếp", color: "#3F72AF", type: "Material" },
  { icon: "fridge-outline", name: "Tủ lạnh", color: "#3F72AF", type: "Material" },
  { icon: "car-outline", name: "Chỗ để xe", color: "#3F72AF", type: "Ionicons" },
  { icon: "smoke-detector", name: "Máy báo khói", color: "#3F72AF", type: "Material" },
  { icon: "shield-account", name: "An ninh", color: "#3F72AF", type: "Material" },
];

// Component con hiển thị từng tiện ích
const AmenityItem = ({ item, index }: { item: any; index: number }) => {
  const animatedStyle = useRippleAnimation(index);

  return (
    <Animated.View
      style={animatedStyle}
      className="w-[31%] h-[85px] bg-white rounded-2xl mb-3 items-center justify-center border border-gray-300"
    >
      {item.type === "Ionicons" ? (
        <Ionicons name={item.icon as any} size={28} color={item.color} />
      ) : (
        <MaterialCommunityIcons
          name={item.icon as any}
          size={28}
          color={item.color}
        />
      )}
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        className="text-gray-700 text-center text-[12px] mt-1 font-medium px-1"
      >
        {item.name}
      </Text>
    </Animated.View>
  );
};

// Component chính
export default function AmenitiesList({ room }: any) {
  const filteredAmenities = allAmenities.filter((a) =>
    room?.amenities?.includes(a.name)
  );

  if (!filteredAmenities || filteredAmenities.length === 0) return null;

  return (
    <Animated.View
      entering={FadeInUp.duration(600)}
      className="px-5 py-5 border-t border-gray-200"
    >
      <Text className="text-lg font-semibold text-[#112D4E] mb-1">
        🏠 Tiện ích chỗ trọ
      </Text>
      <Text className="text-gray-500 text-[13px] mb-4">
        Các tiện ích sẵn có giúp bạn sinh hoạt thoải mái và thuận tiện hơn.
      </Text>

      <FlatList
        data={filteredAmenities}
        numColumns={3}
        keyExtractor={(_, i) => i.toString()}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 12,
        }}
        contentContainerStyle={{
          justifyContent: "center",
        }}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <AmenityItem item={item} index={index} />
        )}
      />
    </Animated.View>
  );
}
