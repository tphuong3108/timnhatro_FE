import React from "react";
import { View, Image, Text } from "react-native";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";

const categories = [
  { title: "Phòng trọ sinh viên", img: require("../../../assets/images/phong.svg") },
  { title: "Phòng trọ có gác", img: require("../../../assets/images/phong.svg") },
  { title: "Phòng trọ giá rẻ", img: require("../../../assets/images/phong.svg") },
  { title: "Căn hộ dịch vụ", img: require("../../../assets/images/phong.svg") },
];

export default function CategoryList() {
  return (
    <View className="flex-row justify-between">
      {categories.map((item, i) => (
        <View key={i} className="items-center flex-1 mx-1">
          <Image
            source={item.img}
            className="w-[70px] h-[70px] rounded-xl"
            resizeMode="cover"
          />
          <Text
            className="text-center mt-1 text-gray-700"
            style={{ fontSize: RFPercentage(1.6) }}
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </View>
      ))}
    </View>
  );
}
