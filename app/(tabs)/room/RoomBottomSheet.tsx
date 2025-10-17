import React from "react";
import { View, Text, TouchableOpacity, FlatList, Animated, Image } from "react-native";
import { Star } from "lucide-react-native";
import { SNAP_POINTS } from "@/hooks/useRoomMapLogic";

export function RoomBottomSheet({
  rooms,
  flatListRef,
  onViewableItemsChanged,
  scrollToCard,
  selectedRoom,
  modalHeight,
  panResponder,
  setSnapIndex,
}: any) {
  const { height } = require("react-native").Dimensions.get("window");

  return (
    <Animated.View
      style={{
        height: modalHeight,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "white",
        overflow: "hidden",
        paddingTop: 10,
      }}
    >
      <Animated.View {...panResponder.panHandlers} className="h-6 justify-center items-center">
        <View className="h-1.5 w-10 bg-gray-300 rounded-full" />
      </Animated.View>

      <View className="px-5 flex-row justify-between items-center mb-2">
        <Text className="text-[#3F72AF] font-semibold text-base">
          {rooms.length} chỗ ở trong khu vực này
        </Text>
        <TouchableOpacity
          onPress={() => {
            setSnapIndex(0);
            Animated.spring(modalHeight, {
              toValue: height * SNAP_POINTS[0],
              useNativeDriver: false,
            }).start();
          }}
        >
          <Text className="text-red-500 font-semibold">Thu gọn</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={rooms}
        keyExtractor={(item) => item._id}
        onViewableItemsChanged={onViewableItemsChanged}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => scrollToCard(item._id)}
            className={`border rounded-2xl mb-4 mx-4 shadow-sm ${
              selectedRoom === item._id
                ? "border-[#3F72AF] bg-[#F9FAFB]"
                : "border-gray-200 bg-white"
            }`}
          >
            <Image source={{ uri: item.images[0] }} className="w-full h-40 rounded-t-2xl" />
            <View className="p-3">
              <Text className="text-lg font-semibold text-[#112D4E]">{item.name}</Text>
              <Text className="text-gray-500 text-sm mt-1">{item.address}</Text>
              <View className="flex-row items-center mt-2">
                <Star size={16} color="#FACC15" fill="#FACC15" />
                <Text className="ml-1 text-sm text-gray-700">
                  {item.avgRating} ({item.totalRatings})
                </Text>
              </View>
              <Text className="text-[#3F72AF] font-semibold mt-2">
                {item.price.toLocaleString("vi-VN")}đ / tháng
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </Animated.View>
  );
}
