import { getAllWards } from "@/services/wardApi";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFilter } from "./FilterContext";

export default function AreaSelector() {
  const { filters, setFilters } = useFilter();
  const [search, setSearch] = useState("");
  const [wards, setWards] = useState<any[]>([]);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const data = await getAllWards();
        setWards(data);
      } catch (error) {
        console.error(" Lỗi khi lấy danh sách phường:", error);
      }
    };
    fetchWards();
  }, []);

  const filtered = wards.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="mb-7">
      <Text className="font-semibold text-base mb-4 mt-5">Khu vực (phường/xã)</Text>
      <TextInput
        placeholder="Tìm hoặc chọn khu vực..."
        value={search}
        onChangeText={setSearch}
        className="border border-gray-300 rounded-xl px-3 py-2 mb-2 text-[13px]"
        placeholderTextColor="#aaa"
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filtered.map((item) => {
          const selected = filters.area === item.name;
          return (
            <TouchableOpacity
              key={item._id}
              onPress={() => setFilters({ ...filters, area: item.name })}
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
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
