import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFilter } from "./FilterContext";

export default function SearchBar() {
  const { filters, setFilters, applyFilters } = useFilter();
  const [search, setSearch] = useState(filters.area);

  const handleSearch = () => {
    setFilters({ ...filters, area: search });
    applyFilters();
  };

  return (
    <View className="flex-row items-center border border-gray-300 rounded-2xl px-4 py-2 mb-3 bg-white shadow-sm">
      <Ionicons name="search-outline" size={20} color="#3F72AF" />
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Tìm phòng theo khu vực, địa chỉ..."
        placeholderTextColor="#888"
        className="flex-1 ml-2 text-[14px]"
        returnKeyType="search"
        onSubmitEditing={handleSearch}
      />
    </View>
  );
}
