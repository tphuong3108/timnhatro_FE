import React from "react";
import { ScrollView, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FilterProvider } from "./FilterContext";
import SearchBar from "./SearchBar";
import FilterSection from "./FilterSection";
import AmenitiesSelector from "./AmenitiesSelector";
import RoomList from "./RoomList";
import TopRatedRooms from "./TopRatedRooms";
import NearbyRooms from "../home/NearbyRooms";
import FilterFooter from "./FilterFooter";

export default function FindRoomIndex() {
  return (
    <FilterProvider>
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/*  Thanh tìm kiếm */}
        <View className="px-5 py-10">
          <SearchBar />
        </View>

        {/*  Bộ lọc nâng cao */}
        <View className="-top-7">
          <FilterSection />
        </View>

        {/*  Tiện ích phổ biến */}
        <View className="px-5 border-t border-gray-100 pt-6">
          <View className="flex-row items-center mb-4">
            <Ionicons name="options-outline" size={20} color="#3F72AF" />
            <Text className="ml-2 text-lg font-semibold text-[#112D4E]">
              Tiện ích phổ biến
            </Text>
          </View>
          <AmenitiesSelector />
        </View>
         <View className="px-5">
              <FilterFooter />
           </View>

        {/*  Danh sách phòng được lọc */}
        <View className="px-5 py-5 border-t border-gray-100 mt-2">
          <RoomList />
        </View>

        {/*  Phòng nổi bật */}
        <View className="px-5 py-5 border-t border-gray-100 mt-2 bg-[#F9FAFB]">
          <View className="flex-row items-center mb-6">
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text className="ml-2 text-lg font-semibold text-[#112D4E]">
              Phòng nổi bật & được đánh giá cao
            </Text>
          </View>
          <TopRatedRooms />
        </View>

        {/* Phòng gần khu vực */}
        <View className="px-5 py-5 border-t border-gray-100 mt-2 mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="location-outline" size={20} color="#3F72AF" />
            <Text className="ml-2 text-lg font-semibold text-[#112D4E]">
              Phòng gần khu vực của bạn
            </Text>
          </View>
          <NearbyRooms />
        </View>
      </ScrollView>
    </FilterProvider>
  );
}
