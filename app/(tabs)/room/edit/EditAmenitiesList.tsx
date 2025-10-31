import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getAllAmenities } from "@/services/amenityApi";

// 🎨 Map icon theo tên tiện nghi
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

export default function EditAmenitiesList({
  existingAmenities = [],
  selectedAmenities = [],
  setSelectedAmenities = () => {},
}: {
  existingAmenities?: any[];
  selectedAmenities?: string[];
  setSelectedAmenities?: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [amenities, setAmenities] = useState<any[]>([]);
  const [pressedId, setPressedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🧩 Lấy danh sách tiện nghi
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await getAllAmenities();
        const mapped = data.map((item: any) => {
          const { icon, type } = getIconForAmenity(item.name);
          return { ...item, icon, type };
        });

        setAmenities(mapped);

        // 🟦 Gán tick sẵn tiện nghi đã có trong phòng
        if (existingAmenities?.length > 0) {
          const ids = existingAmenities.map((a: any) => a._id || a);
          setSelectedAmenities(ids);
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách tiện nghi:", error);
        setAmenities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAmenities();
  }, [existingAmenities]);

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev: string[] = []) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <View className="items-center justify-center py-4">
        <ActivityIndicator color="#3F72AF" />
        <Text className="text-gray-500 mt-2">Đang tải tiện nghi...</Text>
      </View>
    );
  }

  return (
    <View className="mt-3">
      <Text className="text-[#3F72AF] font-semibold mb-3">Tiện nghi</Text>

      <View className="flex-row flex-wrap justify-between px-2">
        {amenities.map((item) => {
          const isSelected = selectedAmenities?.includes(item._id);
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
              className={`w-[31%] h-[85px] rounded-2xl mb-3 items-center justify-center border
              ${
                isSelected
                  ? "border-[#3F72AF] bg-[#E8F0FE]"
                  : "border-gray-300 bg-white"
              } ${isPressed ? "opacity-80" : ""}`}
            >
              <IconComponent
                name={item.icon as any}
                size={28}
                color={isSelected ? "#3F72AF" : "#3F72AFCC"}
              />
              <Text
                numberOfLines={2}
                className={`text-center text-[12px] mt-1 font-medium px-1 ${
                  isSelected ? "text-[#3F72AF]" : "text-gray-700"
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
