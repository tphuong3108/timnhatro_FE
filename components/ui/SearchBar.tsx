import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useRouter } from "expo-router";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (search.trim() === "") return;
    // Điều hướng sang trang filters và truyền query
  router.push(`/(tabs)/filters?q=${encodeURIComponent(search)}` as any);
  };

  return (
    <View className="px-4 mt-3">
      <View className="flex-row items-center bg-[#F1F4F9] rounded-full px-4 py-2 shadow-sm">
        <Ionicons name="search-outline" size={RFValue(18)} color="#3F72AF" />
        <TextInput
          placeholder="Tìm phòng giá tốt tại đây"
          placeholderTextColor="#777"
          className="flex-1 ml-2 text-gray-800 text-[13px]"
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
      </View>
    </View>
  );
}
