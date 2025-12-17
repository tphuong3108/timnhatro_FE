import React from "react";
import { Text, View } from "react-native";
import AreaSelector from "./AreaSelector";
import PriceRange from "./PriceRange";
import AmenitiesSelector from "./AmenitiesSelector";
import { useFilter } from "@/components/filters/FilterContext";
import { Ionicons } from "@expo/vector-icons";

// ⭐ Component chọn số sao
function RatingSelector() {
  const { filters, setFilters } = useFilter();

  const handleSelect = (value: number) => {
    setFilters((prev) => ({
      ...prev,
      rating: prev.rating === value ? 0 : value,
    }));
  };

  return (
    <View className="mt-4">
      <Text className="text-base font-semibold text-[#112D4E] mb-2">
        Đánh giá tối thiểu
      </Text>
      <View className="flex-row items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= filters.rating ? "star" : "star-outline"}
            size={28}
            color="#FACC15"
            style={{ marginRight: 6 }}
            onPress={() => handleSelect(star)}
          />
        ))}
        {filters.rating > 0 && (
          <Text className="ml-2 text-[#374151] text-sm">
            Từ {filters.rating} sao
          </Text>
        )}
      </View>
    </View>
  );
}

export default function FilterSection() {
  return (
    <View className="px-6 pb-6">
      <Text className="text-lg font-semibold text-[#112D4E] mb-2">
        Bộ lọc tìm phòng
      </Text>

      <AreaSelector />

      <PriceRange />

      <RatingSelector />

    </View>
  );
}
