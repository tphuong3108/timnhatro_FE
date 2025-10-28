import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import UserCard from "./UserCard";
import { useUsersData } from "@/constants/data/useUsersData";

export default function UserList() {
  const { users, loading, toggleActive } = useUsersData();
  const [filter, setFilter] = useState<"all" | "active" | "locked">("all");

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center py-20">
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text className="text-gray-500 mt-3">Đang tải người dùng...</Text>
      </View>
    );
  }

  const filteredUsers = users.filter((u) => {
    if (filter === "all") return true;
    if (filter === "active") return u.isActive;
    if (filter === "locked") return !u.isActive;
  });

  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "active", label: "Hoạt động" },
    { key: "locked", label: "Bị khóa" },
  ];

  return (
    <View className="flex-1">
      <View className="w-full items-center mb-5">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 8,
          }}
        >
          {tabs.map((tab) => {
            const isActive = filter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setFilter(tab.key as any)}
                activeOpacity={0.8}
                className={`px-5 py-2 mx-1 rounded-full ${
                  isActive ? "bg-[#3F72AF]" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-[15px] font-semibold ${
                    isActive ? "text-white" : "text-[#112D4E]"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} onToggleActive={() => toggleActive(user.id)} />
          ))
        ) : (
          <View className="items-center justify-center mt-10">
            <Text className="text-gray-400">Không có người dùng nào phù hợp</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
