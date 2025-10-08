import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import "../../global.css";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.replace("/(tabs)/home"), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#3F72AF" />
    </View>
  );
}
