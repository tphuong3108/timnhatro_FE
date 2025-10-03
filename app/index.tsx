import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import Logo from "../assets/images/logo.svg";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: "https://i.pinimg.com/736x/87/71/ea/8771eabaaa156083db480e3fe692830f.jpg",
    text: "Tìm nhà trọ là nền tảng tìm kiếm và cho thuê phòng trọ uy tín thông minh, được xây dựng với sứ mệnh giúp kết nối nhanh chóng và hiệu quả giữa người có nhu cầu thuê và chủ trọ..",
  },
  {
    id: "2",
    image: "https://i.pinimg.com/736x/3e/14/5b/3e145bd017d7afc6552248ad7fb99143.jpg",
    text: "Tìm nhà trọ là nền tảng tìm kiếm và cho thuê phòng trọ uy tín thông minh, được xây dựng với sứ mệnh giúp kết nối nhanh chóng và hiệu quả giữa người có nhu cầu thuê và chủ trọ.",
  },
  {
    id: "3",
    image: "https://i.pinimg.com/736x/99/61/de/9961dedbc854c8c2a54f5f3868681f47.jpg",
    text: "Tìm nhà trọ là nền tảng tìm kiếm và cho thuê phòng trọ uy tín thông minh, được xây dựng với sứ mệnh giúp kết nối nhanh chóng và hiệu quả giữa người có nhu cầu thuê và chủ trọ.",
  },
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 bg-white">
      <View className="relative w-full h-[470px]">
        <Image
          source={{ uri: slides[current].image }}
          className="w-full h-full rounded-xl"
          resizeMode="cover"
        />
        <View className="absolute bottom-3 w-full flex-row justify-center">
          {slides.map((_, idx) => (
            <View
              key={idx}
              className={`h-2 w-2 mx-1 rounded-full ${
                current === idx ? "bg-yellow-500 w-4" : "bg-white"
              }`}
            />
          ))}
        </View>
      </View>

      <View className="flex-row items-center justify-center mt-10">
        <Logo width={350} height={80} />
      </View>

      <Text className="text-center px-6 mt-20 text-2xl">
        {slides[current].text}
      </Text>
    <View className="flex-1 justify-end px-6 mb-[55px]">
    {current < slides.length - 1 ? (
        <TouchableOpacity
        className="self-center bg-[#3F72AF] px-8 py-3 rounded-2xl w-[55%]"
        onPress={() => setCurrent(current + 1)}
        >
        <Text className="text-white font-inter text-center text-lg">TIẾP THEO</Text>
        </TouchableOpacity>
    ) : (
        <View className="flex-row justify-between px-10 mt-8">
        <TouchableOpacity
            className="w-[47%] border border-[#3F72AF] py-3 rounded-xl"
            onPress={() => router.push("/auth/register")}
        >
            <Text className="text-[#3F72AF] font-inter text-center text-lg">ĐĂNG KÝ</Text>
        </TouchableOpacity>

        <TouchableOpacity
            className="w-[47%] bg-[#3F72AF] py-3 rounded-xl"
            onPress={() => router.push("/auth/login")}
        >
            <Text className="text-white font-inter text-center text-lg">ĐĂNG NHẬP</Text>
        </TouchableOpacity>
        </View>
    )}
    </View>
    </View>
  );
}
