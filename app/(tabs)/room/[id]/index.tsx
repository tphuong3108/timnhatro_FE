import React from "react";
import { View, ScrollView } from "react-native";
import { useRoomLogic } from "./RoomLogic";
import InfoRoom from "./InfoRoom";
import MapSection from "./MapSection";
import HostInfo from "./HostInfo";
import Banner from "./Banner";
import { useRouter } from "expo-router";
import RatingSection from "./RatingSection";
import AmenitiesList from "./AmenitiesList";
import RoomDescription from "./RoomDescription";
import HostReviewForm from "./HostReviewForm";

export default function RoomDetailScreen() {
  const {
    room,
    liked,
    setLiked,
    showMenu,
    setShowMenu,
    currentImage,
    handleScroll,
    shareRoom,
    openDirections,
    contactHost,
    loadingLoc,
  } = useRoomLogic();

  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F9F7F7]">
      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        {/* Banner hình ảnh phòng */}
        <Banner
          room={room}
          liked={liked}
          setLiked={setLiked}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          currentImage={currentImage}
          handleScroll={handleScroll}
          shareRoom={shareRoom}
        />

        {/* Thông tin cơ bản về phòng */}
        <InfoRoom room={room} />

        {/* Thông tin chủ trọ */}
        <HostInfo room={room} contactHost={contactHost} />

        {/* Mô tả chỗ trọ */}
        <RoomDescription room={room} />

        {/* Tiện ích */}
        <AmenitiesList room={room} />

        {/* Bản đồ vị trí */}
        <MapSection
          room={room}
          loadingLoc={loadingLoc}
          openDirections={openDirections}
        />

        {/* Đánh giá phòng */}
        <View className="mt-2">
          <RatingSection room={room} />
        </View>

      {/* Form để người dùng tự gửi đánh giá */}
        <HostReviewForm
          onSubmit={(review: any) => {
            console.log("Đánh giá mới từ người dùng:", review);
          }}
        />
      </ScrollView>
    </View>
  );
}
