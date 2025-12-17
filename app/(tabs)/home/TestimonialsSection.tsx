import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 80;

const testimonials = [
  {
    id: "1",
    name: "Minh Anh",
    content: "Tôi đã tìm được phòng trọ ưng ý chỉ sau 2 ngày sử dụng ứng dụng. Rất tiện lợi và dễ sử dụng!",
  },
  {
    id: "2",
    name: "Văn Minh",
    content: "Tôi rất ấn tượng với sự đa dạng và không khí năng động tại ứng dụng. Chắc chắn sẽ giới thiệu cho bạn bè!",
  },
  {
    id: "3",
    name: "Thu Hà",
    content: "Là chủ trọ, tôi thấy việc đăng phòng rất đơn giản. Có nhiều khách hàng liên hệ nhanh chóng.",
  },
  {
    id: "4",
    name: "Hoàng Long",
    content: "Giao diện đẹp, dễ thao tác. Tính năng chat với chủ trọ rất tiện để trao đổi thông tin.",
  },
];

export default function TestimonialsSection() {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < testimonials.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <View className="py-6 bg-white rounded-2xl -mx-6 px-6">
      {/* Quote Icon */}
      <View className="items-center mb-4">
        <Ionicons name="chatbox-ellipses" size={36} color="#3F72AF" />
      </View>

      {/* Carousel */}
      <View className="flex-row items-center justify-center">
        {/* Prev Button */}
        <TouchableOpacity
          onPress={handlePrev}
          activeOpacity={0.7}
          disabled={currentIndex === 0}
          className="w-10 h-10 rounded-full items-center justify-center border border-gray-300"
          style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
        >
          <Ionicons name="chevron-back" size={20} color="#3F72AF" />
        </TouchableOpacity>

        {/* Content */}
        <View style={{ width: CARD_WIDTH - 80, marginHorizontal: 10 }}>
          <FlatList
            ref={flatListRef}
            data={testimonials}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ width: CARD_WIDTH - 80 }} className="items-center px-2">
                <Text className="text-[#112D4E] font-bold text-base mb-2 text-center">
                  {item.name}
                </Text>
                <Text className="text-gray-600 text-center text-[13px] leading-5">
                  {item.content}
                </Text>
              </View>
            )}
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.7}
          disabled={currentIndex === testimonials.length - 1}
          className="w-10 h-10 rounded-full items-center justify-center border border-gray-300"
          style={{ opacity: currentIndex === testimonials.length - 1 ? 0.4 : 1 }}
        >
          <Ionicons name="chevron-forward" size={20} color="#3F72AF" />
        </TouchableOpacity>
      </View>

      {/* Dots */}
      <View className="flex-row justify-center mt-4">
        {testimonials.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === currentIndex ? "bg-[#3F72AF]" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
