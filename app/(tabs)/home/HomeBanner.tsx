import React, { useState, useEffect } from "react";
import { View, Image, Dimensions } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get("window");

const banners = [
  { id: "1", image: "https://i.pinimg.com/736x/87/71/ea/8771eabaaa156083db480e3fe692830f.jpg" },
  { id: "2", image: "https://i.pinimg.com/736x/3e/14/5b/3e145bd017d7afc6552248ad7fb99143.jpg" },
  { id: "3", image: "https://i.pinimg.com/736x/99/61/de/9961dedbc854c8c2a54f5f3868681f47.jpg" },
];

export default function HomeBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="overflow-hidden">
      <Image
        source={{ uri: banners[current].image }}
        className="w-full"
        style={{ height: RFValue(160) }}
        resizeMode="cover"
      />
      <View className="absolute bottom-3 w-full flex-row justify-center">
        {banners.map((_, idx) => (
          <View
            key={idx}
            style={{
              height: RFValue(6),
              marginHorizontal: RFValue(3),
              borderRadius: RFValue(3),
              width: current === idx ? RFValue(14) : RFValue(6),
              backgroundColor: current === idx ? "#3F72AF" : "#fff",
            }}
          />
        ))}
      </View>
    </View>
  );
}
