import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect } from "react";
import { FlatList, Text } from "react-native";
import Animated, {
    Easing,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
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

// Icon mapping đồng bộ với trang Home
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
  { keywords: ["vân tay", "khóa vân tay", "fingerprint"], icon: "fingerprint", type: "Material" },
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
    const iconInfo = getIconForAmenity(a.name || "");
    return {
      ...a,
      icon: iconInfo.icon,
      type: iconInfo.type,
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

