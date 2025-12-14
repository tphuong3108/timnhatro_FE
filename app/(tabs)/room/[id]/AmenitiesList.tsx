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

// Hiệu ứng
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
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return animatedStyle;
}

const iconMapping = [
  { keyword: "wifi", icon: "wifi-outline", type: "Ionicons" },
  { keyword: "tv", icon: "tv-outline", type: "Ionicons" },
  { keyword: "điều hòa", icon: "snowflake", type: "Material" },
  { keyword: "máy giặt", icon: "washing-machine", type: "Material" },
  { keyword: "bếp", icon: "stove", type: "Material" },
  { keyword: "tủ lạnh", icon: "fridge-outline", type: "Material" },
  { keyword: "xe", icon: "car-outline", type: "Ionicons" },
  { keyword: "khói", icon: "smoke-detector", type: "Material" },
  { keyword: "an ninh", icon: "shield-account", type: "Material" },
  { keyword: "sơ cứu", icon: "medical-bag", type: "Material" },
  { keyword: "chữa cháy", icon: "fire-extinguisher", type: "Material" },
];

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
        className="text-[#3F72AF] text-center text-[12px] mt-1 font-medium px-1"
      >
        {item.name}
      </Text>
    </Animated.View>
  );
};

export default function AmenitiesList({ amenities }: { amenities: any[] }) {
  const validAmenities = Array.isArray(amenities) ? amenities : [];

  const enrichedAmenities = validAmenities.map((a: any) => {
    const match = iconMapping.find((i) =>
      a.name?.toLowerCase().includes(i.keyword)
    );
    return {
      ...a,
      icon: match?.icon || "checkmark-circle",
      type: match?.type || "Ionicons",
      color: "#3F72AF",
    };
  });

  if (!enrichedAmenities.length) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInUp.duration(600)}
      className="px-5 py-5 border-t border-gray-200"
    >
      <Text className="text-xl font-semibold text-[#3F72AF] mb-3">
        🏠 Tiện ích chỗ trọ
      </Text>
      <Text className="text-gray-700 text-[14px] mb-4">
        Các tiện ích sẵn có giúp bạn sinh hoạt thoải mái và thuận tiện hơn.
      </Text>

      <FlatList
        data={enrichedAmenities}
        numColumns={3}
        keyExtractor={(item) => item._id}
        columnWrapperStyle={{ justifyContent: "flex-start", gap: 12 }}
        contentContainerStyle={{ justifyContent: "center" }}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <AmenityItem item={item} index={index} />
        )}
      />
    </Animated.View>
  );
}

