import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 380;

const stats = [
  {
    icon: "home-outline",
    value: 1654,
    suffix: "+",
    label: "Phòng trọ",
    color: "#3F72AF",
  },
  {
    icon: "people-outline",
    value: 546,
    suffix: "+",
    label: "Khách thuê",
    color: "#10B981",
  },
  {
    icon: "star-outline",
    value: 4.8,
    suffix: "",
    label: "Đánh giá",
    color: "#F59E0B",
    isDecimal: true,
  },
  {
    icon: "location-outline",
    value: 50,
    suffix: "+",
    label: "Khu vực",
    color: "#EF4444",
  },
];

function useCountAnimation(end: number, duration: number = 2500, isDecimal?: boolean, key?: number) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (key === 0) {
      setCount(0);
      return;
    }

    setCount(0);
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = easeOutQuart * end;
      
      setCount(isDecimal ? Number(currentValue.toFixed(1)) : Math.floor(currentValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isDecimal, key]);

  return count;
}

function StatItem({ stat, animKey }: { stat: typeof stats[0]; animKey: number }) {
  const animatedValue = useCountAnimation(stat.value, 2500, stat.isDecimal, animKey);

  return (
    <View className="items-center mb-4" style={{ width: "48%" }}>
      <View
        className="w-12 h-12 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${stat.color}15` }}
      >
        <Ionicons name={stat.icon as any} size={24} color={stat.color} />
      </View>
      <Text
        className="font-bold text-[#112D4E]"
        style={{ fontSize: isSmallScreen ? 24 : 28 }}
      >
        {stat.isDecimal ? animatedValue.toFixed(1) : animatedValue}{stat.suffix}
      </Text>
      <Text
        className="text-gray-500"
        style={{ fontSize: isSmallScreen ? 14 : 15 }}
      >
        {stat.label}
      </Text>
    </View>
  );
}

export default function StatsSection() {
  const [animKey, setAnimKey] = useState(0);

  // Mỗi lần focus vào Home → trigger animation
  useFocusEffect(
    useCallback(() => {
      setAnimKey(Date.now());
    }, [])
  );

  return (
    <View className="py-4">
      <View className="flex-row flex-wrap justify-between">
        {stats.map((stat, index) => (
          <StatItem key={index} stat={stat} animKey={animKey} />
        ))}
      </View>
    </View>
  );
}




