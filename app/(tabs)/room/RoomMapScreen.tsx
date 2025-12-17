import { RoomBottomSheet } from "@/components/room/RoomBottomSheet";
import { RoomMap } from "@/components/room/RoomMap";
import { useRoomMapLogic } from "@/hooks/useRoomMapLogic";
import React from "react";
import { View } from "react-native";

export default function RoomMapScreen() {
  const logic = useRoomMapLogic();

  return (
    <View className="flex-1 bg-white">
      <RoomMap {...logic} />
      {logic.isVisible && <RoomBottomSheet {...logic} />}
    </View>
  );
}
