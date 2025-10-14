import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useFilter } from "./FilterContext";

const options = [
  { key: "instantBook", label: "Đặt ngay" },
  { key: "selfCheckIn", label: "Tự nhận phòng" },
  { key: "petsAllowed", label: "Thú cưng" },
] as const;

export default function BookingOptions() {
  const { filters, setFilters } = useFilter();

  const toggle = (key: typeof options[number]["key"]) => {
    setFilters({ ...filters, [key]: !filters[key] });
  };

  return (
    <View className="mb-5">
      <Text className="font-semibold text-base mb-2">Tùy chọn lọc phòng</Text>
      <View className="flex-row flex-wrap">
        {options.map((o) => (
          <TouchableOpacity
            key={o.key}
            onPress={() => toggle(o.key)}
            className={`px-3 py-2 mr-2 mb-2 rounded-full border ${
              filters[o.key]
                ? "bg-blue-500 border-blue-500"
                : "border-gray-300"
            }`}
          >
            <Text
              className={`text-sm ${
                filters[o.key] ? "text-white" : "text-gray-700"
              }`}
            >
              {o.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
