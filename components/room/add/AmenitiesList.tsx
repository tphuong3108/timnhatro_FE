import { getAllAmenities } from "@/services/amenityApi";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

//  Gán icon theo tên tiện nghi
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

export default function AmenitiesList({
  selectedAmenities,
  setSelectedAmenities,
}: {
  selectedAmenities: string[];
  setSelectedAmenities: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [amenities, setAmenities] = useState<any[]>([]);
  const [pressedId, setPressedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  //  Lấy danh sách tiện nghi từ backend
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await getAllAmenities();

        // Thêm icon tương ứng vào từng tiện nghi
        const mapped = data.map((item: any) => {
          const { icon, type } = getIconForAmenity(item.name);
          return { ...item, icon, type };
        });

        setAmenities(mapped);
      } catch (error) {
        setAmenities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAmenities();
  }, []);

  const toggleAmenity = (id: string) => {
    if (selectedAmenities.includes(id)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== id));
    } else {
      setSelectedAmenities([...selectedAmenities, id]);
    }
  };

  if (loading) {
    return (
      <View className="items-center justify-center py-4">
        <ActivityIndicator color="#3F72AF" />
        <Text className="text-gray-500 mt-2">Đang tải tiện nghi...</Text>
      </View>
    );
  }

  if (amenities.length === 0) {
    return (
      <Text className="text-center text-gray-500 py-4">
        Không có tiện nghi nào.
      </Text>
    );
  }

  return (
    <View className="mt-3">
      <View className="flex-row flex-wrap justify-between px-2">
        {amenities.map((item) => {
          const isSelected = selectedAmenities.includes(item._id);
          const isPressed = pressedId === item._id;

          const IconComponent =
            item.type === "Ionicons" ? Ionicons : MaterialCommunityIcons;

          return (
            <TouchableOpacity
              key={item._id}
              activeOpacity={0.9}
              onPress={() => toggleAmenity(item._id)}
              onPressIn={() => setPressedId(item._id)}
              onPressOut={() => setPressedId(null)}
              className={`w-[31%] h-[80px] rounded-2xl mb-3 items-center justify-center border ${
                isSelected ? "border-[#3F72AF]" : "border-gray-300"
              } ${isPressed ? "bg-gray-100" : "bg-white"}`}
            >
              <View className="w-8 h-8 items-center justify-center">
                <IconComponent
                  name={item.icon as any}
                  size={26}
                  color={isSelected ? "#1E4F91" : "#3F72AF"}
                />
              </View>

              <Text
                numberOfLines={1}
                className={`text-center text-[12px] mt-1 font-medium w-[80px] ${
                  isSelected ? "text-[#1E4F91]" : "text-gray-700"
                }`}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
