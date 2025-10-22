import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFilter } from "./FilterContext";

const provinces = [
  "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Đà Lạt",
  "Nha Trang", "Hải Phòng", "Huế", "Vũng Tàu", "Bình Dương", "Đồng Nai", "Quảng Ninh"
];

export default function AreaSelector() {
  const { filters, setFilters } = useFilter();
  const [search, setSearch] = useState("");

  const filtered = provinces.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="mb-7">
      <Text className="font-semibold text-base mb-4 mt-5">Khu vực</Text>
      <TextInput
        placeholder="Tìm hoặc chọn khu vực..."
        value={search}
        onChangeText={setSearch}
        className="border border-gray-300 rounded-xl px-3 py-2 mb-2 text-[13px]"
        placeholderTextColor="#aaa"
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filtered.map((item) => {
          const selected = filters.area === item;
          return (
            <TouchableOpacity
              key={item}
              onPress={() => setFilters({ ...filters, area: item })}
              className={`px-4 py-2 mr-2 rounded-full border ${
                selected
                  ? "bg-[#3F72AF] border-[#3F72AF]"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`text-[13px] ${
                  selected ? "text-white" : "text-[#112D4E]"
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
