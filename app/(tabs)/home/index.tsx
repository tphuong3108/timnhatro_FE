import React from "react";
import { SafeAreaView, ScrollView, View, useWindowDimensions } from "react-native";
import HomeBanner from "./HomeBanner";
import SearchBar from "@/components/ui/SearchBar";
import SectionHeader from "./SectionHeader";
import CategoryList from "./CategoryList";
import NearbyRooms from "./NearbyRooms";
import RoomCarousel from "./RoomCarousel";
import AmenitiesList from "./AmenitiesList";

export default function Home() {
  const { height } = useWindowDimensions();
  const isLargeScreen = height > 800;
  const isMediumScreen = height > 700 && height <= 800;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never" 
        contentContainerStyle={{
          flexGrow: 1, 
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <View className="w-full">
          <HomeBanner />
        </View>

        <View
          className="w-full max-w-[450px] px-6"
          style={{
            marginTop: isLargeScreen ? 24 : isMediumScreen ? 20 : 16,
            rowGap: isLargeScreen ? 36 : isMediumScreen ? 32 : 24,
            marginBottom: isLargeScreen ? 40 : 30,
          }}
        >
          <SearchBar />

          {/* Xu hướng tìm phòng */}
          <View>
            <SectionHeader title="Xu hướng tìm phòng" />
            <CategoryList />
          </View>

          {/* Phòng xung quanh bạn */}
          <View>
            <SectionHeader title="Phòng xung quanh bạn" />
            <NearbyRooms />
          </View>

          {/* Top phòng nổi bật */}
          <View>
            <SectionHeader title="Top phòng nổi bật" />
            <RoomCarousel />
          </View>

          {/* Tiện ích phổ biến */}
          <View>
            <SectionHeader title="Tiện ích phổ biến" />
            <AmenitiesList />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
