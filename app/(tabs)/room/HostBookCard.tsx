import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { X } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Host } from "@/constants/data/rooms";

export function HostBookCard({ host }: { host: Host }) {
  const [visible, setVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const openBook = () => {
    setVisible(true);
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(() => setIsFlipped(true));
  };

  const closeBook = () => {
    Animated.timing(flipAnim, {
      toValue: 0,
      duration: 400,
      easing: Easing.in(Easing.exp),
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(false);
      setVisible(false);
    });
  };

  const flip = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, -1],
  });

  const handleAvatarPress = () => {
    closeBook();
    router.push({
      pathname: "/user/[id]",
      params: { id: host._id },
    });
  };

  return (
    <>
      {/* 📘 Cuốn sổ nhỏ */}
      <TouchableOpacity
        onPress={openBook}
        activeOpacity={0.85}
        className="absolute bottom-8 left-3 z-30"
      >
        <View className="flex-row items-center">
          <View className="w-[4px] h-12 bg-gray-500 rounded-l-md" />
          <View className="w-10 h-12 bg-white border border-gray-300 rounded-r-md items-center justify-center shadow-md">
            <View className="w-9 h-9 rounded-full overflow-hidden border border-gray-300">
              <Image
                source={{ uri: host.avatar }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* 📖 Modal mở sổ */}
      <Modal visible={visible} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center">
          <Animated.View
            style={{
              transform: [{ scaleX: flip }],
            }}
            className="w-[85%] bg-white rounded-2xl border border-gray-200 shadow-xl p-6"
          >
            <View style={{ transform: [{ scaleX: -1 }] }}>
              <TouchableOpacity
                onPress={closeBook}
                className="absolute -right-2 -top-2"
              >
                <X size={25} color="black" />
              </TouchableOpacity>

              <View className="items-center mt-4">
                <TouchableOpacity
                  onPress={handleAvatarPress}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: host.avatar }}
                    className="w-20 h-20 rounded-full mb-2 border border-gray-300"
                  />
                </TouchableOpacity>

                <Text className="text-lg font-semibold text-gray-800">
                  {host.fullName}
                </Text>
              </View>

              {host.email && (
                <View className="flex-row justify-center items-center mt-3">
                  <Feather name="mail" size={16} color="#3F72AF" />
                  <Text className="text-gray-700 text-center ml-2">
                    {host.email}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}
