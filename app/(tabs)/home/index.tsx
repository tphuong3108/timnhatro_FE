import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import HomeBanner from "./HomeBanner";
import SearchBar from "@/components/ui/SearchBar";
import SectionHeader from "./SectionHeader";
import CategoryList from "./CategoryList";
import NearbyRooms from "./NearbyRooms";
import RoomCarousel from "./RoomCarousel";
import AmenitiesList from "./AmenitiesList";
import rooms from "@/constants/data/rooms";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="">
          <HomeBanner />
        </View>

        <View className="px-4 mt-1">
          <SearchBar />
        </View>

        <View className="mt-6 px-4">
          <SectionHeader title="Xu hướng tìm phòng" />
          <CategoryList />
        </View>

        <View className="mt-8 px-4">
          <SectionHeader title="Phòng quanh bạn" />
          <NearbyRooms />
        </View>

        <View className="mt-8 px-4">
          <SectionHeader title="Top phòng nổi bật" />
          <RoomCarousel rooms={rooms} />
        </View>

        <View className="mt-8 px-4 mb-10">
          <SectionHeader title="Tiện ích phổ biến" />
          <AmenitiesList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
