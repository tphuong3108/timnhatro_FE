import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Logo from "../assets/images/logo.svg";

const { height } = Dimensions.get("window");

const slides = [
  { id: "1", image: "https://i.pinimg.com/736x/87/71/ea/8771eabaaa156083db480e3fe692830f.jpg" },
  { id: "2", image: "https://i.pinimg.com/736x/3e/14/5b/3e145bd017d7afc6552248ad7fb99143.jpg" },
  { id: "3", image: "https://i.pinimg.com/736x/99/61/de/9961dedbc854c8c2a54f5f3868681f47.jpg" },
];

const introText =
  "Tìm nhà trọ là nền tảng tìm kiếm và cho thuê phòng trọ uy tín, giúp kết nối nhanh chóng giữa người có nhu cầu thuê và chủ trọ.";

export default function Onboarding() {
  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(0);
  const [showAuthButtons, setShowAuthButtons] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleContinueAsGuest = async () => {
    try {
      await AsyncStorage.setItem("hasSeenIntro", "true");
      await AsyncStorage.setItem("guestMode", "true");

      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 100);
    } catch (error) {
      console.error("Error saving guest mode:", error);
    }
  };

  const handleLogin = async () => {
    await AsyncStorage.setItem("hasSeenIntro", "true");
    router.push("/auth/login");
  };

  const handleRegister = async () => {
    await AsyncStorage.setItem("hasSeenIntro", "true");
    router.push("/auth/register");
  };

  return (
    <View className="flex-1 bg-white">
      <View style={{ height: height * 0.52 }}>
        <Image
          source={{ uri: slides[currentImage].image }}
          className="w-full h-full rounded-xl"
          resizeMode="cover"
        />
        <View className="absolute bottom-3 w-full flex-row justify-center">
          {slides.map((_, idx) => (
            <View
              key={idx}
              style={{
                height: RFValue(8),
                borderRadius: RFValue(4),
                marginHorizontal: RFValue(3),
                width: currentImage === idx ? RFValue(18) : RFValue(8),
                backgroundColor: currentImage === idx ? "#3F72AF" : "#fff",
              }}
            />
          ))}
        </View>
      </View>

      <View style={{ height: height * 0.3, alignItems: "center", paddingHorizontal: 20 }}>
        <Logo width={RFValue(200)} height={RFValue(50)} style={{ marginTop: RFValue(25) }} />
        <Text
          className="text-center text-gray-700"
          style={{
            marginTop: RFValue(20),
            fontSize: RFPercentage(2.2),
            lineHeight: RFPercentage(3),
          }}
        >
          {introText}
        </Text>
      </View>

      <View style={{ height: height * 0.2, justifyContent: "center", paddingHorizontal: 24 }}>
        {!showAuthButtons ? (
          <TouchableOpacity
            className="self-center bg-[#3F72AF] rounded-2xl"
            style={{ width: "55%", paddingVertical: RFValue(12) }}
            onPress={() => setShowAuthButtons(true)}
          >
            <Text
              className="text-white text-center font-medium"
              style={{ fontSize: RFPercentage(2.2) }}
            >
              TIẾP THEO
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            <View className="flex-row justify-between mb-3" style={{ marginTop: RFValue(10) }}>
              <TouchableOpacity
                className="border border-[#3F72AF] rounded-xl"
                style={{ width: "45%", paddingVertical: RFValue(10) }}
                onPress={handleRegister}
              >
                <Text
                  className="text-[#3F72AF] text-center"
                  style={{ fontSize: RFPercentage(2) }}
                >
                  ĐĂNG KÝ
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-[#3F72AF] rounded-xl"
                style={{ width: "45%", paddingVertical: RFValue(10) }}
                onPress={handleLogin}
              >
                <Text
                  className="text-white text-center"
                  style={{ fontSize: RFPercentage(2) }}
                >
                  ĐĂNG NHẬP
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleContinueAsGuest}>
              <Text
                className="text-center text-gray-600 underline"
                style={{ fontSize: RFPercentage(1.9) }}
              >
                Tiếp tục mà không đăng nhập
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
