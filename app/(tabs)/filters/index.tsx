import React from "react";
import { View, ScrollView } from "react-native";
import { FilterProvider } from "./FilterContext";
import RoomOptions from "./RoomOptions";
import BookingOptions from "./BookingOptions";
import FilterFooter from "./FilterFooter";
import AmenitiesList from "../home/AmenitiesList";
import PriceRange from "./PriceRange";

export default function FilterScreen() {
  return (
    <FilterProvider>
      <View className="flex-1 bg-gray-50">
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="px-4 pt-3"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
        <PriceRange/>
          <RoomOptions />
          <AmenitiesList />
          <BookingOptions />
        </ScrollView>
        <FilterFooter />
      </View>
    </FilterProvider>
  );
}
