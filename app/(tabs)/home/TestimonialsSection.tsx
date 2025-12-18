import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Animated, Dimensions, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 160;

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

// Clone items: [last, ...original, first] for infinite effect
const infiniteData = [
  { ...testimonials[testimonials.length - 1], id: "clone-last" },
  ...testimonials,
  { ...testimonials[0], id: "clone-first" },
];

export default function TestimonialsSection() {
  const scrollX = useRef(new Animated.Value(CARD_WIDTH)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const isScrolling = useRef(false);
  const actualIndexRef = useRef(1); // Track actual position in infiniteData (starts at 1 = first real item)

  const handleNext = () => {
    if (isScrolling.current) return;
    isScrolling.current = true;

    const nextIndex = actualIndexRef.current + 1;
    const offset = nextIndex * CARD_WIDTH;

    Animated.timing(scrollX, {
      toValue: offset,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (nextIndex === infiniteData.length - 1) {
        // Reached clone-first, silently jump to real first
        scrollX.setValue(CARD_WIDTH);
        actualIndexRef.current = 1;
        setCurrentIndex(0);
      } else {
        actualIndexRef.current = nextIndex;
        setCurrentIndex(nextIndex - 1);
      }
      isScrolling.current = false;
    });
  };

  const handlePrev = () => {
    if (isScrolling.current) return;
    isScrolling.current = true;

    const prevIndex = actualIndexRef.current - 1;
    const offset = prevIndex * CARD_WIDTH;

    Animated.timing(scrollX, {
      toValue: offset,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (prevIndex === 0) {
        // Reached clone-last, silently jump to real last
        scrollX.setValue(testimonials.length * CARD_WIDTH);
        actualIndexRef.current = testimonials.length;
        setCurrentIndex(testimonials.length - 1);
      } else {
        actualIndexRef.current = prevIndex;
        setCurrentIndex(prevIndex - 1);
      }
      isScrolling.current = false;
    });
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
          className="w-10 h-10 rounded-full items-center justify-center border border-gray-300"
        >
          <Ionicons name="chevron-back" size={20} color="#3F72AF" />
        </TouchableOpacity>

        {/* Content */}
        <View style={{ width: CARD_WIDTH, marginHorizontal: 10, overflow: "hidden" }}>
          <Animated.View
            style={{
              flexDirection: "row",
              transform: [{ translateX: Animated.multiply(scrollX, -1) }],
            }}
          >
            {infiniteData.map((item, index) => (
              <View key={item.id + "-" + index} style={{ width: CARD_WIDTH }} className="items-center px-2">
                <Text className="text-[#112D4E] font-bold text-[17px] mb-2 text-center">
                  {item.name}
                </Text>
                <Text className="text-gray-600 text-center text-[14px] leading-5">
                  {item.content}
                </Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.7}
          className="w-10 h-10 rounded-full items-center justify-center border border-gray-300"
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

