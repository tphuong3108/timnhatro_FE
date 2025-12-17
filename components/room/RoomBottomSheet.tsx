import React from "react";
import {
  TouchableOpacity,
  FlatList,
  Animated,
  Dimensions,
  View,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { SNAP_POINTS } from "@/hooks/useRoomMapLogic";
import { SheetHeader } from "./SheetHeader";
import { MapRoomCard } from "@/components/MapRoomCard";

export function RoomBottomSheet({
  rooms,
  flatListRef,
  onViewableItemsChanged,
  scrollToCard,
  selectedRoom,
  modalHeight,
  panResponder,
  setSnapIndex,
  loadMoreRooms,
  loadingMore, // ✅ thêm prop
  hasMore, // ✅ thêm prop
}: any) {
  const { height } = Dimensions.get("window");
  const router = useRouter();

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <Animated.View
        style={{
          height: modalHeight,
          backgroundColor: "#fff",
          overflow: "visible", // ✅ đổi từ "hidden" sang "visible"
          paddingTop: 10,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 4,
        }}
      >
        {/* Header */}
        <SheetHeader
          total={rooms.length}
          panHandlers={panResponder.panHandlers}
          onCollapse={() => {
            setSnapIndex(0);
            Animated.spring(modalHeight, {
              toValue: height * SNAP_POINTS[0],
              useNativeDriver: false,
            }).start();
          }}
        />

        {/* Danh sách phòng */}
        <FlatList
          ref={flatListRef}
          data={rooms}
          keyExtractor={(item) => item._id}
          onViewableItemsChanged={onViewableItemsChanged}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreRooms}
          onEndReachedThreshold={0.3}
          contentContainerStyle={{
            paddingBottom: 60,
            paddingHorizontal: 24,
            paddingTop: 8,
            flexGrow: 1, // ✅ giúp cuộn mượt & kích hoạt onEndReached chuẩn
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => router.push(`/room/${item.slug || item._id}`)}
              style={{ marginBottom: 16 }}
            >
              <MapRoomCard room={item} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Text className="text-gray-500">Không có phòng nào.</Text>
            </View>
          }
          // ✅ Thêm Footer hiển thị trạng thái tải thêm
          ListFooterComponent={
            loadingMore ? (
              <View className="py-4 items-center">
                <Text className="text-gray-400">Đang tải thêm...</Text>
              </View>
            ) : !hasMore ? (
              <View className="py-4 items-center">
                <Text className="text-gray-400">Đã hết dữ liệu</Text>
              </View>
            ) : null
          }
        />
      </Animated.View>
    </Animated.View>
  );
}

export default RoomBottomSheet;
