import React from "react";
import { View, Text, FlatList, Dimensions } from "react-native";

// Import từng SVG icon riêng biệt
import PhongSinhVien from "../../../assets/images/phong.svg";
import PhongCoGac from "../../../assets/images/phong.svg";
import PhongGiaRe from "../../../assets/images/phong.svg";
import CanHoDichVu from "../../../assets/images/phong.svg";
import PhongFullNoiThat from "../../../assets/images/phong.svg";
import PhongGanTruong from "../../../assets/images/phong.svg";
import PhongMoiXay from "../../../assets/images/phong.svg";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 5;

const categories = [
  { id: "1", title: "Phòng trọ sinh viên", Icon: PhongSinhVien },
  { id: "2", title: "Phòng trọ có gác", Icon: PhongCoGac },
  { id: "3", title: "Phòng trọ giá rẻ", Icon: PhongGiaRe },
  { id: "4", title: "Căn hộ dịch vụ", Icon: CanHoDichVu },
  { id: "5", title: "Phòng full nội thất", Icon: PhongFullNoiThat },
  { id: "6", title: "Phòng gần trường", Icon: PhongGanTruong },
  { id: "7", title: "Phòng mới xây", Icon: PhongMoiXay },
];

export default function CategoryList() {
  return (
    <FlatList
      data={categories}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
      renderItem={({ item }) => {
        const Icon = item.Icon;
        return (
          <View
            className="items-center mx-1"
            style={{ width: CARD_WIDTH }}
          >
            <View
              className="rounded-xl bg-gray-100 items-center justify-center"
              style={{
                width: CARD_WIDTH * 0.9,
                height: CARD_WIDTH * 0.9,
              }}
            >
              <Icon width={CARD_WIDTH * 0.6} height={CARD_WIDTH * 0.6} />
            </View>
            <Text
              numberOfLines={2}
              className="text-center text-gray-700 font-medium mt-1"
              style={{
                fontSize: width > 400 ? 12 : 10,
                lineHeight: 14,
              }}
            >
              {item.title}
            </Text>
          </View>
        );
      }}
    />
  );
}
