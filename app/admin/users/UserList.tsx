import React from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import UserCard from "./UserCard";
import { useUsersData } from "@/constants/data/useUsersData";

export default function UserList() {
  const { users, loading, toggleActive } = useUsersData();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-20">
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text className="text-gray-500 mt-3">Đang tải người dùng...</Text>
      </View>
    );
  }

  const total = users.length;
  const active = users.filter((u) => u.isActive).length;
  const admins = users.filter((u) => u.role === "admin").length;
  const hosts = users.filter((u) => u.role === "host").length;
  const normal = users.filter((u) => u.role === "user").length;

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <Text className="text-[18px] font-semibold text-[#112D4E] mb-3">
        Người dùng ({total})
      </Text>

      <View className="flex-row justify-between bg-white p-3 rounded-xl mb-4 shadow-sm border border-gray-100">
        <Text className="text-gray-700 text-[13px]">Đang hoạt động: {active}</Text>
        <Text className="text-indigo-600 text-[13px]">Admin: {admins}</Text>
        <Text className="text-green-600 text-[13px]">Host: {hosts}</Text>
        <Text className="text-gray-500 text-[13px]">User: {normal}</Text>
      </View>

      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onToggleActive={() => toggleActive(user.id)}
        />
      ))}
    </ScrollView>
  );
}
