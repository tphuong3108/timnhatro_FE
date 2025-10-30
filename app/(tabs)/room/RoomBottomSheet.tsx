import React from "react";
import { TouchableOpacity, FlatList, Animated, Dimensions } from "react-native";
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
}: any) {
  const { height } = Dimensions.get("window");

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
          overflow: "hidden",
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
          contentContainerStyle={{
            paddingBottom: 50,
            paddingHorizontal: 30,
            paddingTop: 8,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.95}
              onPress={() => scrollToCard(item._id)}
              style={{
                marginBottom: 20,
              }}
            >
              <MapRoomCard room={item} />
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </Animated.View>
  );
}
