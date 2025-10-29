import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getAllAmenities } from "@/services/amenityApi";

//  Gán icon theo tên tiện nghi
const ICON_MAP = [
  { keywords: ["wifi"], icon: "wifi-outline", type: "Ionicons" },
  { keywords: ["tivi", "tv"], icon: "tv-outline", type: "Ionicons" },
  { keywords: ["điều hòa", "máy lạnh"], icon: "snowflake", type: "Material" },
  { keywords: ["máy giặt"], icon: "washing-machine", type: "Material" },
  { keywords: ["bếp", "nấu ăn"], icon: "stove", type: "Material" },
  { keywords: ["tủ lạnh"], icon: "fridge-outline", type: "Material" },
  { keywords: ["xe", "ô tô"], icon: "car-outline", type: "Ionicons" },
  { keywords: ["ban công"], icon: "balcony", type: "Material" },
  { keywords: ["bồn tắm"], icon: "bathtub", type: "Material" },
  { keywords: ["gym"], icon: "dumbbell", type: "Material" },
  { keywords: ["hồ bơi", "bể bơi"], icon: "pool", type: "Material" },
  { keywords: ["khói"], icon: "smoke-detector", type: "Material" },
  { keywords: ["an ninh"], icon: "shield-account", type: "Material" },
  { keywords: ["sơ cứu"], icon: "medical-bag", type: "Material" },
  { keywords: ["chữa cháy"], icon: "fire-extinguisher", type: "Material" },
  { keywords: ["làm việc"], icon: "briefcase", type: "Material" },
  { keywords: ["ăn uống"], icon: "silverware-fork-knife", type: "Material" },
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
        console.error("❌ Lỗi khi lấy danh sách tiện nghi:", error);
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
