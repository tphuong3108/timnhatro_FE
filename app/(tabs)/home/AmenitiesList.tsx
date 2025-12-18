import { getAllAmenities } from "@/services/amenityApi";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

// Tiện ích tĩnh mặc định (9 cái)
const staticAmenities = [
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

// Map icon từ tên tiện ích (đồng bộ với trang thêm phòng)
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

interface AmenitiesListProps {
  showAll?: boolean;
}

export default function AmenitiesList({ showAll = false }: AmenitiesListProps) {
  const [dbAmenities, setDbAmenities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showAll) {
      const fetchFromDB = async () => {
        setLoading(true);
        try {
          const data = await getAllAmenities();
          const mapped = data.map((item: any) => {
            const iconInfo = getIconForAmenity(item.name);
            return { ...item, icon: iconInfo.icon, type: iconInfo.type, color: "#3F72AF" };
          });
          setDbAmenities(mapped);
        } catch {
          setDbAmenities([]);
        } finally {
          setLoading(false);
        }
      };
      fetchFromDB();
    }
  }, [showAll]);

  const amenities = showAll ? dbAmenities : staticAmenities;

  if (showAll && loading) {
    return (
      <View className="py-6 items-center">
        <ActivityIndicator size="small" color="#3F72AF" />
        <Text className="text-gray-500 mt-2 text-sm">Đang tải tiện ích...</Text>
      </View>
    );
  }

  return (
    <View className="mt-3">
      <View className="flex-row flex-wrap justify-between px-2">
        {amenities.map((item, index) => (
          <View
            key={item._id || index}
            className="w-[30%] h-[75px] bg-white rounded-2xl mb-3 items-center justify-center border border-gray-300"
          >
            <View className="w-8 h-8 items-center justify-center">
              {item.type === "Ionicons" ? (
                <Ionicons name={item.icon as any} size={26} color={item.color} />
              ) : (
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={26}
                  color={item.color}
                />
              )}
            </View>

            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-gray-700 text-center text-[13px] mt-1 font-medium w-[70px]"
            >
              {item.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
