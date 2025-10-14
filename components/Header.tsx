import React from "react";
import { TouchableOpacity, Platform, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { BlurView } from "expo-blur";
import Logo from "../assets/images/logo.svg";

export default function Header() {
  return (
    <View className="w-full z-20 overflow-hidden bg-[#B9D7EA]">
      <View
        />
        <BlurView
          intensity={40}
          tint="light"
          style={{
            paddingHorizontal: 20,
            paddingTop: Platform.OS === "ios" ? 60 : 40,
            paddingBottom: 12,
          }}
        className="flex-row justify-between items-center"
      >
        <Logo width={RFValue(95)} height={RFValue(30)} />
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="globe-outline" size={RFValue(22)} color="#ffffff" />
        </TouchableOpacity>
      </BlurView>
    </View>
  );
}
