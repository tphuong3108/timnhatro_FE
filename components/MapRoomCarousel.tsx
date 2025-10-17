import React from "react";
import { ScrollView, Image } from "react-native";

export default function MapRoomCarousel({ images }: { images: string[] }) {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      className="w-full h-[200px]"
    >
      {images.map((img, i) => (
        <Image
          key={i}
          source={{ uri: img }}
          className="w-full h-[200px]"
          resizeMode="cover"
        />
      ))}
    </ScrollView>
  );
}
