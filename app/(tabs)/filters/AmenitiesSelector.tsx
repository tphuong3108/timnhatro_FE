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
import { getAllAmenities } from "@/services/amenityApi";
import { useFilter } from "./FilterContext";

// 🌊 Hiệu ứng hiện dần
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

// Danh sách keyword map sang icon
const ICON_MAP = [
  // --- Nhóm điện tử & Gia dụng ---
  { keywords: ["wifi", "internet", "mạng"], icon: "wifi-outline", type: "Ionicons" },
  { keywords: ["tivi", "tv", "truyền hình"], icon: "tv-outline", type: "Ionicons" },
  { keywords: ["điều hòa", "máy lạnh"], icon: "snowflake", type: "Material" },
  { keywords: ["máy giặt", "giặt là"], icon: "washing-machine", type: "Material" },
  { keywords: ["tủ lạnh"], icon: "fridge-outline", type: "Material" },
  { keywords: ["nóng lạnh", "bình nước nóng", "máy nước nóng"], icon: "water-thermometer", type: "Material" },  
  { keywords: ["máy báo khói", "báo khói", "khói"], icon: "smoke-detector", type: "Material" },

  // --- Nhóm nội thất & Cấu trúc phòng ---
  { keywords: ["bếp", "nấu ăn"], icon: "stove", type: "Material" },
  { keywords: ["làm việc", "bàn làm việc"], icon: "briefcase", type: "Material" },
  { keywords: ["gác", "gác lửng"], icon: "stairs", type: "Material" },  
  { keywords: ["vệ sinh", "toilet", "wc"], icon: "toilet", type: "Material" },  
  { keywords: ["phòng tắm", "tắm", "vòi sen"], icon: "shower", type: "Material" },  
  { keywords: ["bồn tắm"], icon: "bathtub", type: "Material" },
  { keywords: ["giường", "nệm", "đệm"], icon: "bed", type: "Material" },  
  { keywords: ["tủ áo", "tủ quần áo", "quần áo"], icon: "wardrobe", type: "Material" },  
  { keywords: ["ban công", "sân nhỏ"], icon: "balcony", type: "Material" },

  // --- Nhóm tiện ích chung & An ninh ---
  { keywords: ["xe", "ô tô", "bãi đậu xe", "để xe"], icon: "car-outline", type: "Ionicons" },
  { keywords: ["thang máy"], icon: "elevator", type: "Material" },  
  { keywords: ["camera", "camera an ninh"], icon: "cctv", type: "Material" },  
  { keywords: ["an ninh", "bảo vệ"], icon: "shield-account", type: "Material" },
  { keywords: ["chữa cháy", "bình chữa cháy"], icon: "fire-extinguisher", type: "Material" },
  { keywords: ["sơ cứu", "y tế"], icon: "medical-bag", type: "Material" },
  { keywords: ["gym", "thể dục"], icon: "dumbbell", type: "Material" },
  { keywords: ["hồ bơi", "bể bơi"], icon: "pool", type: "Material" },
  { keywords: ["sân vườn", "cây xanh"], icon: "tree", type: "Material" },  
  { keywords: ["ăn uống", "bàn ăn"], icon: "silverware-fork-knife", type: "Material" },

  // --- Nhóm môi trường xung quanh ---
  { keywords: ["chợ"], icon: "storefront-outline", type: "Ionicons" },
  { keywords: ["siêu thị"], icon: "cart-outline", type: "Ionicons" },
  { keywords: ["bệnh viện", "cơ sở y tế"], icon: "hospital-box-outline", type: "Material" },
  { keywords: ["trường", "học", "đại học"], icon: "school-outline", type: "Ionicons" },
  { keywords: ["công viên"], icon: "pine-tree", type: "Material" },
  { keywords: ["bus", "xe buýt", "bến xe"], icon: "bus-outline", type: "Ionicons" },
  { keywords: ["thể thao", "sân vận động"], icon: "run", type: "Material" },
];

function getIconForAmenity(name: string) {
  const normalized = name.toLowerCase().replace(/[\s\-_/]+/g, "");
  const found = ICON_MAP.find((i) =>
    i.keywords.some((kw) => normalized.includes(kw.replace(/[\s\-_/]+/g, "")))
  );

  return found
    ? { icon: found.icon, type: found.type }
    : { icon: "checkmark-circle-outline", type: "Ionicons" };
}


const AmenityItem = ({ item, index, isSelected, onPress }: any) => {
  const animatedStyle = useRippleAnimation(index);
  const IconComponent = item.type === "Ionicons" ? Ionicons : MaterialCommunityIcons;

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
            backgroundColor: isSelected ? "#E8F0FE" : "#fff",
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
        <IconComponent name={item.icon as any} size={26} color="#3F72AF" />
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

export default function AmenitiesSelector() {
  const { filters, setFilters } = useFilter();
  const [amenities, setAmenities] = useState<any[]>([]);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await getAllAmenities();

        // Gán icon cho từng tiện ích dựa trên tên
        const mapped = data.map((item: any) => {
          const { icon, type } = getIconForAmenity(item.name);
          return { ...item, icon, type };
        });

        setAmenities(mapped);
      } catch (error) {
        setAmenities([]);
      }
    };
    fetchAmenities();
  }, []);

  const toggleAmenity = (id: string) => {
    setFilters((prev) => {
      const updated = prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id];
      return { ...prev, amenities: updated };
    });
  };

  if (!amenities || amenities.length === 0) return null;

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
        data={amenities}
        numColumns={3}
        keyExtractor={(item, i) => item._id || i.toString()}
        columnWrapperStyle={{ justifyContent: "flex-start", gap: 12 }}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <AmenityItem
            item={item}
            index={index}
            isSelected={filters.amenities.includes(item._id)}
            onPress={() => toggleAmenity(item._id)}
          />
        )}
      />
    </Animated.View>
  );
}
