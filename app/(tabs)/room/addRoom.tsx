import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

const amenities = [
  { key: "wifi", icon: "wifi-outline", name: "Wi-Fi miễn phí", type: "Ionicons" },
  { key: "tv", icon: "tv-outline", name: "TV", type: "Ionicons" },
  { key: "aircon", icon: "snowflake", name: "Điều hòa", type: "Material" },
  { key: "washer", icon: "washing-machine", name: "Máy giặt", type: "Material" },
  { key: "kitchen", icon: "stove", name: "Khu bếp", type: "Material" },
  { key: "fridge", icon: "fridge-outline", name: "Tủ lạnh", type: "Material" },
  { key: "parking", icon: "car-outline", name: "Chỗ để xe", type: "Ionicons" },
  { key: "smoke", icon: "smoke-detector", name: "Máy báo khói", type: "Material" },
];

export default function AddRoom() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [media, setMedia] = useState<string[]>([]);

  const toggleAmenity = (key: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(key) ? prev.filter((a) => a !== key) : [...prev, key]
    );
  };

  const pickMedia = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Không có quyền truy cập", "Vui lòng cấp quyền truy cập thư viện ảnh.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setMedia((prev) => [...prev, ...uris]);
    }
  };


  const handleSubmit = () => {
    if (!roomName || !price || !location) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin phòng!");
      return;
    }
    const newRoom = {
      name: roomName,
      price,
      location,
      description,
      amenities: selectedAmenities,
      media,
    };

    console.log("Dữ liệu đăng phòng:", newRoom);

    Alert.alert("Thành công", "Phòng của bạn đã được đăng!");
    router.push("/home");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Tiêu đề ở giữa */}
      <View className="py-4">
        <Text className="text-xl font-semibold text-[#3F72AF] text-center">
          Đăng phòng
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {/* Tên phòng */}

        <Text className="text-gray-700 font-semibold mb-1">Tên phòng</Text>
        <TextInput
          value={roomName}
          onChangeText={setRoomName}
          placeholder="VD: Phòng trọ sinh viên gần ĐH Bách Khoa"
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-[14px]"
        />
        <Text className="text-gray-700 font-semibold mb-1">Giá thuê (VNĐ/tháng)</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholder="VD: 2.500.000"
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-[14px]"
        />
        {/* Ảnh & video */}
        <Text className="text-gray-700 font-semibold mb-2">Ảnh / Video</Text>
        <View className="flex-row flex-wrap gap-3 mb-4">
          {media.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              className="w-[90px] h-[90px] rounded-xl"
            />
          ))}
          <TouchableOpacity
            onPress={pickMedia}
            className="w-[90px] h-[90px] rounded-xl border border-dashed border-gray-400 items-center justify-center"
          >
            <Ionicons name="add-outline" size={28} color="#3F72AF" />
            <Text className="text-[12px] text-[#3F72AF]">Thêm</Text>
          </TouchableOpacity>
        </View>

        {/* Tiện nghi */}
        <Text className="text-gray-700 font-semibold mb-2">Tiện nghi</Text>
        <View className="flex-row flex-wrap justify-start">
          {amenities.map((item, index) => {
            const selected = selectedAmenities.includes(item.key);
            const IconComp =
              item.type === "Ionicons" ? Ionicons : MaterialCommunityIcons;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => toggleAmenity(item.key)}
                className={`w-[30%] h-[75px] rounded-2xl mb-3 items-center justify-center border ${
                  selected
                    ? "border-[#3F72AF] bg-blue-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                <IconComp name={item.icon as any} size={24} color="#3F72AF" />
                <Text
                  className={`text-[12px] mt-1 ${
                    selected ? "text-[#3F72AF] font-semibold" : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Nút Đăng phòng */}
        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.8}
          className="bg-[#3F72AF] rounded-2xl py-4 mt-8 mb-10 self-center w-[90%]"

        >
          <Text className="text-white font-semibold text-center text-[16px]">
            Đăng phòng ngay
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
