import SearchBar from "@/components/ui/SearchBar";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, View, useWindowDimensions } from "react-native";
import AmenitiesList from "./AmenitiesList";
import CategoryList from "./CategoryList";
import HomeBanner from "./HomeBanner";
import NearbyRooms from "./NearbyRooms";
import SectionHeader from "./SectionHeader";
import ServicesSection from "./ServicesSection";
import SloganSection from "./SloganSection";
import StatsSection from "./StatsSection";
import TestimonialsSection from "./TestimonialsSection";

export default function Home() {
  const { height } = useWindowDimensions();
  const isLargeScreen = height > 800;
  const isMediumScreen = height > 700 && height <= 800;

  const [showAllAmenities, setShowAllAmenities] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}
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
          {/* 1. Thanh tìm kiếm */}
          <SearchBar />

          {/* 2. Dịch vụ */}
          <ServicesSection />

          {/* 3. Con số ấn tượng */}
          <View>
            <SectionHeader title="Con số ấn tượng" hideViewAll />
            <StatsSection />
          </View>

          {/* 4. Xu hướng tìm phòng */}
          <View>
            <SectionHeader title="Xu hướng tìm phòng" />
            <CategoryList />
          </View>

          {/* 5. Phòng xung quanh bạn */}
          <View>
            <SectionHeader title="Phòng xung quanh bạn" />
            <NearbyRooms />
          </View>

          {/* 6. Tiện ích phổ biến */}
          <View>
            <SectionHeader 
              title="Tiện ích phổ biến" 
              onViewAll={() => setShowAllAmenities(!showAllAmenities)}
              viewAllText={showAllAmenities ? "Thu gọn" : "Xem tất cả"}
            />
            <AmenitiesList showAll={showAllAmenities} />
          </View>

          {/* 7. Khách hàng nói gì */}
          <View>
            <SectionHeader title="Khách hàng nói gì" hideViewAll />
            <TestimonialsSection />
          </View>

          {/* 8. Slogan */}
          <SloganSection />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}



