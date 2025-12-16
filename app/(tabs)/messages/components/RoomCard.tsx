import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export interface RoomData {
  _id?: string;
  name?: string;
  title?: string;
  slug?: string;
  address: string;
  price: number | string;
  description?: string;
  amenities?: string[] | string;
  image?: string;
  imageUrl?: string;
  link?: string;
}

interface RoomCardProps {
  room: RoomData;
}

export default function RoomCard({ room }: RoomCardProps) {
  const handlePress = () => {
    const slug = room.slug || room.link?.replace("/phong-tro/", "") || room._id;
    if (slug) {
      router.push(`/room/${slug}` as any);
    }
  };

  const displayName = room.name || room.title || "Phòng trọ";
  const displayImage = room.image || room.imageUrl;
  
  const formatPrice = (price: number | string) => {
    if (typeof price === "number") {
      return `${price.toLocaleString("vi-VN")}đ`;
    }
    return price;
  };

  const getAmenities = (): string[] => {
    if (Array.isArray(room.amenities)) {
      return room.amenities;
    }
    if (typeof room.amenities === "string") {
      return room.amenities.split(",").map((a) => a.trim());
    }
    return [];
  };

  const amenitiesArray = getAmenities();

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      className="bg-white rounded-xl shadow-sm overflow-hidden mb-2 border border-gray-100 flex-row"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      {/* Small Square Image */}
      <View className="w-20 h-20 bg-gray-100 m-2 rounded-lg overflow-hidden">
        {displayImage ? (
          <Image
            source={{ uri: displayImage }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center bg-blue-50">
            <Ionicons name="home-outline" size={24} color="#3B82F6" />
          </View>
        )}
      </View>

      <View className="flex-1 py-2 pr-3 justify-center">
        <Text
          className="text-[13px] font-semibold text-gray-800"
          numberOfLines={2}
        >
          {displayName}
        </Text>

        {/* Address */}
        <View className="flex-row items-center mt-1">
          <Ionicons name="location-outline" size={12} color="#9CA3AF" />
          <Text className="text-[11px] text-gray-400 ml-1 flex-1" numberOfLines={1}>
            {room.address}
          </Text>
        </View>

        {/* Price + Amenities */}
        <View className="flex-row items-center justify-between mt-1.5">
          <Text className="text-red-500 font-bold text-[13px]">
            {formatPrice(room.price)}
          </Text>
          
          {amenitiesArray.length > 0 && (
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="check-circle" size={12} color="#10B981" />
              <Text className="text-[10px] text-gray-500 ml-0.5">
                {amenitiesArray.length} tiện ích
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Arrow */}
      <View className="justify-center pr-2">
        <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
      </View>
    </TouchableOpacity>
  );
}
