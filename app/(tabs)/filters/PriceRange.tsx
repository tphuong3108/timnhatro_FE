import React, { useState } from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { useFilter } from "./FilterContext";

export default function PriceRange() {
  const { filters, setFilters } = useFilter();
  const [value, setValue] = useState<number>(filters.priceMax);

  return (
    <View className="mb-5">
      <Text className="font-semibold text-base mb-2">Giá (VNĐ)</Text>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={0}
        maximumValue={10000000}
        step={50000}
        minimumTrackTintColor="#3F72AF"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#3F72AF"
        value={value}
        onValueChange={(v: number) => setValue(v)}
        onSlidingComplete={(v: number) =>
          setFilters({ ...filters, priceMax: v })
        }
      />
      <Text className="text-sm text-gray-600 mt-1">
        Tối đa {value.toLocaleString()}đ
      </Text>
    </View>
  );
}
