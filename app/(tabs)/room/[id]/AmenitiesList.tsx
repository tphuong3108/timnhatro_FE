import React, { useEffect } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeInUp,
} from "react-native-reanimated";
import type { Dispatch, SetStateAction } from "react";

function useRippleAnimation(index: number) {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = index * 80;
    const timeout = setTimeout(() => {
      scale.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.exp),
      });
      opacity.value = withTiming(1, { duration: 350 });
    }, delay);
    return () => clearTimeout(timeout);
  }, [index, scale, opacity]);

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

// ✅ Tách component riêng để gọi hook hợp lệ
const AmenityItem = ({
  item,
  index,
  isSelected,
  toggleAmenity,
}: {
  item: any;
  index: number;
  isSelected: boolean;
  toggleAmenity: (name: string) => void;
}) => {
  const animatedStyle = useRippleAnimation(index);
  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: "31%",
          height: 85,
          borderRadius: 16,
          marginBottom: 10,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isSelected ? "#3F72AF22" : "#fff",
          borderWidth: 1.5,
          borderColor: isSelected ? "#3F72AF" : "#ccc",
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => toggleAmenity(item.keyword)}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        {item.type === "Ionicons" ? (
          <Ionicons
            name={item.icon as any}
            size={28}
            color={isSelected ? "#3F72AF" : "#999"}
          />
        ) : (
          <MaterialCommunityIcons
            name={item.icon as any}
            size={28}
            color={isSelected ? "#3F72AF" : "#999"}
          />
        )}
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className={`text-center text-[12px] mt-1 font-medium px-1 ${
            isSelected ? "text-[#3F72AF]" : "text-gray-600"
          }`}
        >
          {item.keyword}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ✅ Component chính
export default function AmenitiesList({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
}) {
  const toggleAmenity = (name: string) => {
    setSelected((prev: string[]) =>
      prev.includes(name)
        ? prev.filter((n: string) => n !== name)
        : [...prev, name]
    );
  };

  return (
    <Animated.View entering={FadeInUp.duration(600)} className="px-5 py-4">
      <FlatList
        data={iconMapping}
        numColumns={3}
        keyExtractor={(item) => item.keyword}
        columnWrapperStyle={{ justifyContent: "flex-start", gap: 12 }}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <AmenityItem
            item={item}
            index={index}
            isSelected={selected.includes(item.keyword)}
            toggleAmenity={toggleAmenity}
          />
        )}
      />
    </Animated.View>
  );
}
