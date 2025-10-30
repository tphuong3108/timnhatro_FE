import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RoomMapScreen from "./RoomMapScreen";

export default function RoomIndex() {
  return (
    <GestureHandlerRootView className="flex-1">
      <RoomMapScreen />
    </GestureHandlerRootView>
  );
}
