import React, { useState } from "react";
import { View, Text, TextInput, useWindowDimensions } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useFilter } from "@/components/filters/FilterContext";

export default function PriceRange() {
  const { width } = useWindowDimensions();
  const { filters, setFilters } = useFilter();
  const [localMin, setLocalMin] = useState(filters.minPrice);
  const [localMax, setLocalMax] = useState(filters.maxPrice);

  const handleSliderChange = (values: number[]) => {
    const [min, max] = values;
    setLocalMin(min);
    setLocalMax(max);
    setFilters({ ...filters, minPrice: min, maxPrice: max });
  };

  return (
    <View className="mb-5">
      <Text className="font-semibold text-base mb-3">
        Khoảng giá thuê (VNĐ/tháng)
      </Text>

      {/* Input nhập tay */}
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

      {/* Thanh trượt 2 đầu */}
      <View className="mt-1">
        <MultiSlider
          values={[localMin, localMax]}
          min={0}
          max={10000000}
          step={50000}
          sliderLength={width - 40}
          onValuesChange={handleSliderChange}
          selectedStyle={{ backgroundColor: "#3F72AF" }}
          unselectedStyle={{ backgroundColor: "#d3d3d3" }}
          containerStyle={{ alignSelf: "center" }}
          trackStyle={{ height: 4, borderRadius: 2 }}
          markerStyle={{
            height: 20,
            width: 20,
            borderRadius: 10,
            backgroundColor: "#3F72AF",
            borderWidth: 1.5,
            borderColor: "#fff",
            elevation: 0,
          }}
          pressedMarkerStyle={{
            backgroundColor: "#112D4E",
            shadowColor: "transparent",
            elevation: 0,
          }}
        />

        <View className="flex-row justify-between mt-1">
          <Text className="text-[12px] text-gray-500">0₫</Text>
          <Text className="text-[12px] text-gray-500">10.000.000₫+</Text>
        </View>
      </View>

      {/* Hiển thị giá hiện tại */}
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
