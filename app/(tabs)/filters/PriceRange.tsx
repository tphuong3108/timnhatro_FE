import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import Slider from "@react-native-community/slider";
import { useFilter } from "./FilterContext";

export default function PriceRange() {
  const { filters, setFilters } = useFilter();
  const [localMin, setLocalMin] = useState(filters.minPrice);
  const [localMax, setLocalMax] = useState(filters.maxPrice);

  const handleSliderChange = (min: number, max: number) => {
    setLocalMin(min);
    setLocalMax(max);
    setFilters({ ...filters, minPrice: min, maxPrice: max });
  };

  return (
    <View className="mb-5">
      <Text className="font-semibold text-base mb-3">Khoảng giá thuê (VNĐ/tháng)</Text>

      {/* Hiển thị giá */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-1 mr-2">
          <Text className="text-gray-500 text-[13px] mb-1">Từ</Text>
          <TextInput
            value={localMin.toString()}
            onChangeText={(v) => {
              const val = parseInt(v) || 0;
              setLocalMin(val);
              setFilters({ ...filters, minPrice: val });
            }}
            keyboardType="numeric"
            className="border border-gray-300 rounded-lg px-3 py-2 text-[13px]"
          />
        </View>

        <View className="flex-1 ml-2">
          <Text className="text-gray-500 text-[13px] mb-1">Đến</Text>
          <TextInput
            value={localMax.toString()}
            onChangeText={(v) => {
              const val = parseInt(v) || 0;
              setLocalMax(val);
              setFilters({ ...filters, maxPrice: val });
            }}
            keyboardType="numeric"
            className="border border-gray-300 rounded-lg px-3 py-2 text-[13px]"
          />
        </View>
      </View>

      {/* Thanh trượt giá */}
      <View className="mt-1">
        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={0}
          maximumValue={10000000}
          step={50000}
          value={localMax}
          minimumTrackTintColor="#3F72AF"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#3F72AF"
          onValueChange={(val) => handleSliderChange(localMin, val)}
        />
        <View className="flex-row justify-between">
          <Text className="text-[12px] text-gray-500">0₫</Text>
          <Text className="text-[12px] text-gray-500">10.000.000₫+</Text>
        </View>
      </View>

      {/* Tóm tắt giá đang chọn */}
      <View className="mt-2">
        <Text className="text-[13px] text-[#112D4E]">
          Hiển thị phòng có giá từ{" "}
          <Text className="font-semibold text-[#3F72AF]">
            {localMin.toLocaleString("vi-VN")}₫
          </Text>{" "}
          đến{" "}
          <Text className="font-semibold text-[#3F72AF]">
            {localMax.toLocaleString("vi-VN")}₫
          </Text>
        </Text>
      </View>
    </View>
  );
}
