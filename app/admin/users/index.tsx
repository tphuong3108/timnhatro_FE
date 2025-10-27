import React from "react";
import { View } from "react-native";
import UserList from "./UserList";

export default function AdminUsers() {
  return (
    <View className="flex-1 bg-[#F9FAFB] p-4">
      <UserList />
    </View>
  );
}
