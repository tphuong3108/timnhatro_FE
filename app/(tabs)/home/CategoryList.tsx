import React from "react";
import { View, Text, FlatList, ImageBackground, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 4.5;

const categories = [
  {
    id: "1",
    title: "Phòng trọ sinh viên",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "2",
    title: "Phòng trọ có gác rộng rãi thoáng mát",
    image: "https://images.unsplash.com/photo-1595526114035-0f50155e8f7b?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "3",
    title: "Phòng trọ giá rẻ",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "4",
    title: "Căn hộ dịch vụ",
    image: "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "5",
    title: "Phòng full nội thất",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "6",
    title: "Phòng gần trường",
    image: "https://images.unsplash.com/photo-1600585153856-3d4d8e0d6d53?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "7",
    title: "Phòng mới xây",
    image: "https://images.unsplash.com/photo-1616628188533-8e0cb4123b4d?auto=format&fit=crop&w=800&q=60",
  },
];

export default function CategoryList() {
  return (
    <FlatList
      data={categories}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
      renderItem={({ item }) => (
        <View className="items-center mx-1.5" style={{ width: CARD_WIDTH }}>
          <ImageBackground
            source={{ uri: item.image }}
            resizeMode="cover"
            className="w-[80px] h-[80px] rounded-2xl overflow-hidden shadow-sm justify-end"
            imageStyle={{ borderRadius: 16 }}
          >
            <View className="absolute inset-0 bg-black/10 rounded-2xl" />
          </ImageBackground>

          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-center text-gray-700 font-medium mt-1"
            style={{
              fontSize: width > 400 ? 12 : 10,
              lineHeight: 14,
              maxWidth: CARD_WIDTH * 0.95,
            }}
          >
            {item.title}
          </Text>
        </View>
      )}
    />
  );
}
