import { Text, View, TouchableOpacity, Image } from "react-native";
import "../global.css"; // 👈 chỉnh lại đường dẫn cho đúng (vì file này nằm trong components)

export default function TailwindTest() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 dark:bg-black">
      {/* Text test */}
      <Text className="text-2xl font-bold text-blue-600 dark:text-yellow-300">
        Hello Tailwind 🎉
      </Text>

      {/* Button test */}
      <TouchableOpacity className="mt-6 rounded-xl bg-green-500 px-6 py-3">
        <Text className="text-white font-semibold">Click me</Text>
      </TouchableOpacity>

      {/* Box test */}
      <View className="mt-6 w-32 h-32 rounded-lg bg-purple-400 items-center justify-center">
        <Text className="text-white">Box</Text>
      </View>

      {/* Image test */}
      <Image
        source={{ uri: "https://placekitten.com/200/200" }}
        className="mt-6 w-24 h-24 rounded-full border-4 border-pink-500"
      />
    </View>
  );
}
