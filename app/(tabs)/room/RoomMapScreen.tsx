import React from "react";
import { View } from "react-native";
import { useRoomMapLogic } from "@/hooks/useRoomMapLogic";
import { RoomMap } from "./RoomMap";
import { RoomBottomSheet } from "./RoomBottomSheet";


export default function RoomMapScreen() {
  const logic = useRoomMapLogic();

  return (
    <View className="flex-1 bg-white">
      <RoomMap {...logic} />
      {logic.isVisible && <RoomBottomSheet {...logic} />}
    </View>
  );
}
