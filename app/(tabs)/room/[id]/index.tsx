import AmenitiesList from "@/components/room/detail/AmenitiesList";
import Banner from "@/components/room/detail/Banner";
import HostInfo from "@/components/room/detail/HostInfo";
import HostReviewForm from "@/components/room/detail/HostReviewForm";
import InfoRoom from "@/components/room/detail/InfoRoom";
import MapSection from "@/components/room/detail/MapSection";
import RatingSection from "@/components/room/detail/RatingSection";
import RoomDescription from "@/components/room/detail/RoomDescription";
import { useRoomLogic } from "@/components/room/detail/RoomLogic";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { bookingApi } from "../../../../services/bookingApi";
import BookingDialog from "../../booking/BookingDialog";
import NearbyRooms from "../../home/NearbyRooms";
import SectionHeader from "../../home/SectionHeader";


export default function RoomDetailScreen() {
  const {
    room,
    setRoom,
    liked,
    setLiked,
    favorited,  
    setFavorited,
    currentImage,
    handleScroll,
    shareRoom,
    refreshRoomStatus,
    openDirections,
    contactHost,
    loadingLoc,
    loadingRoom,
  } = useRoomLogic();

  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [showBooking, setShowBooking] = useState(false);
  const [hasBooked, setHasBooked] = useState(false);
const [checkingBooked, setCheckingBooked] = useState(true);

useEffect(() => {
  if (!room?._id) return;

  const checkBooking = async () => {
    try {
      const res = await bookingApi.checkUserBookedRoom(room._id);
      setHasBooked(res.data.booked);
    } catch (err) {
    } finally {
      setCheckingBooked(false);
    }
  };

  checkBooking();
}, [room]);

  if (loadingRoom || !room) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9F7F7]">
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text className="mt-3 text-gray-600">Đang tải dữ liệu phòng...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F9F7F7]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Banner
          room={room}
          liked={liked}
          setLiked={setLiked}
          favorited={favorited}
          setFavorited={setFavorited}
          currentImage={currentImage}
          handleScroll={handleScroll}
          shareRoom={shareRoom}
          refreshRoomStatus={refreshRoomStatus} 
        />

        {/* Thông tin cơ bản */}
        <InfoRoom room={room} />
      {/* Đặt lịch xem phòng*/}
             {checkingBooked ? (
          <View className="bg-gray-300 mx-6 mt-3 rounded-xl py-4">
            <Text className="text-center text-gray-600">Đang kiểm tra lịch...</Text>
          </View>
        ) : hasBooked ? (
          <View className="bg-gray-400 mx-6 mt-3 rounded-xl py-4">
            <Text className="text-center text-white font-semibold text-lg">
              Bạn đã đặt lịch xem phòng!
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={{ backgroundColor: "#3F72AF" }}
            className="bg-blue-600 mx-6 mt-3 rounded-xl py-4"
            onPress={() => setShowBooking(true)}
          >
            <Text className="text-center text-white font-semibold text-lg">
              Đặt lịch xem phòng
            </Text>
          </TouchableOpacity>
        )}

        {/* Thông tin chủ trọ */}
        <HostInfo room={room} contactHost={contactHost} />

        {/* Mô tả */}
        <RoomDescription room={room} />

        {/* Tiện ích */}
        <AmenitiesList amenities={room?.amenities} />
       
       

        {/* Bản đồ vị trí */}
        <MapSection
          room={room}
          loadingLoc={loadingLoc}
          openDirections={openDirections}
        />

        {/* Đánh giá phòng */}
        <View className="mt-2">
          <RatingSection key={refreshKey} room={room} />
        </View>

        {/* Form gửi đánh giá */}
        <HostReviewForm
          room={room}
          onSubmit={(newReview) => {
            setRoom((prev: any) => ({
              ...prev,
              reviews: [newReview, ...(prev?.reviews || [])],
              totalRatings: (prev?.totalRatings || 0) + 1,
            }));
            setRefreshKey((prev) => prev + 1);
          }}
        />

        {/* Phòng xung quanh */}
        <View className="mt-2 px-6 py-12">
          <SectionHeader title="Phòng xung quanh bạn" />
          <NearbyRooms />
        </View>
        
      </ScrollView>
      <BookingDialog
        visible={showBooking}
        onClose={() => setShowBooking(false)}
        roomId={room._id}
        hostId={room.createdBy}
        roomName={room.title}
        onBooked={() => setHasBooked(true)}
      />

    </View>
  );
}
