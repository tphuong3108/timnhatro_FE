import React from "react";
import { SafeAreaView, ScrollView, View, Image } from "react-native";

import Header from "@/components/Header";
import SectionHeader from "./SectionHeader";
import CategoryList from "./CategoryList";
import RoomCard from "./RoomCard";
import rooms from "@/constants/data/rooms";

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="relative">
        <Image
          source={require("../../../assets/images/phong.svg")}
          className="w-full h-52"
          resizeMode="cover"
        />
        <Header />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <View className="mt-4 px-4">
          <SectionHeader title="Xu hướng tìm phòng" />
          <CategoryList />
        </View>

        <View className="mt-6 px-4 mb-10">
          <SectionHeader title="Top phòng nổi bật" />
          <View className="flex-row justify-between flex-wrap mt-2">
            {rooms.map((room, i) => (
              <RoomCard key={i} room={room} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
