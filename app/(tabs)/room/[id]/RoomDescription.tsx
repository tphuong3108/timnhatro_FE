import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function RoomDescription({ room }: any) {
  const [expanded, setExpanded] = useState(false);

  const description =
    room.description ||
    "Phòng trọ rộng rãi, thoáng mát, được thiết kế tiện nghi và sạch sẽ. Vị trí gần trung tâm, thuận tiện đi lại, gần chợ, siêu thị và các tuyến xe buýt. Khu vực yên tĩnh, an ninh tốt, phù hợp với sinh viên hoặc nhân viên văn phòng.";

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View className="px-5 py-5 border-t border-gray-200 bg-[#F9F7F7]">
      <View className="flex-row items-center mb-2">
        <MaterialCommunityIcons
          name="text-box-outline"
          size={22}
          color="#3F72AF"
        />
        <Text className="text-xl font-semibold text-[#3F72AF] ml-2">
          Mô tả chỗ trọ
        </Text>
      </View>

      <Text
        className="text-gray-700 text-[14px] leading-5"
        numberOfLines={expanded ? undefined : 3}
      >
        {description}
      </Text>

      {/* Nút hiển thị thêm */}
      <TouchableOpacity
        onPress={toggleExpand}
        activeOpacity={0.8}
        className="mt-3 bg-[#F1F5F9] rounded-xl py-2 flex-row justify-center items-center text-xl"
      >
        <Ionicons
          name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
          size={16}
          color="#3F72AF"
        />
        <Text className="text-[#3F72AF] font-semibold ml-1">
          {expanded ? "Thu gọn" : "Hiển thị thêm"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
