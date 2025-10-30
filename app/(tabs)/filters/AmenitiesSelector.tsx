import React, { useEffect, useState } from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  FadeInUp,
} from "react-native-reanimated";

// 🎞 Hiệu ứng hiện dần từng tiện ích
function useRippleAnimation(index: number) {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = index * 80;
    const timeout = setTimeout(() => {
      scale.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.exp) });
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

const AmenityItem = ({
  item,
  index,
  isSelected,
  onPress,
}: {
  item: any;
  index: number;
  isSelected: boolean;
  onPress?: () => void;
}) => {
  const animatedStyle = useRippleAnimation(index);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{ width: "31%", marginBottom: 12 }}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            height: 85,
            backgroundColor: "#fff",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: isSelected ? "#3F72AF" : "#E5E7EB",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 1,
          },
        ]}
      >
        {item.type === "Ionicons" ? (
          <Ionicons name={item.icon as any} size={26} color={item.color} />
        ) : (
          <MaterialCommunityIcons name={item.icon as any} size={26} color={item.color} />
        )}
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{
            color: "#374151",
            textAlign: "center",
            fontSize: 12,
            fontWeight: "500",
            marginTop: 10,
            paddingHorizontal: 6,
          }}
        >
          {item.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function AmenitiesSelector({ room }: { room?: any }) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const filteredAmenities =
    room?.amenities?.length && room.amenities.length > 0
      ? allAmenities.filter((a) =>
          room.amenities.some(
            (b: string) => b.toLowerCase().trim() === a.name.toLowerCase().trim()
          )
        )
      : allAmenities;

  if (!filteredAmenities || filteredAmenities.length === 0) return null;

  return (
    <Animated.View
      entering={FadeInUp.duration(600)}
      style={{
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: "#fff",
      }}
    >
      <FlatList
        data={filteredAmenities}
        numColumns={3}
        keyExtractor={(_, i) => i.toString()}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 12,
        }}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <AmenityItem
            item={item}
            index={index}
            isSelected={selectedAmenities.includes(item.name)}
            onPress={() => toggleAmenity(item.name)}
          />
        )}
      />
    </Animated.View>
  );
}
