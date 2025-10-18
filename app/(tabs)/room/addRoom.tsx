import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AmenitiesList from "../home/AmenitiesList";

export default function AddRoom() {
  const router = useRouter();

  const [roomName, setRoomName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [marker, setMarker] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // ✅ Lấy vị trí hiện tại
  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Quyền bị từ chối", "Vui lòng cấp quyền truy cập vị trí.");
        setLoadingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
      setMarker({ latitude, longitude });
      setLoadingLocation(false);

      // 👉 Thêm reverse geocode (địa chỉ text)
      const addr = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addr.length > 0) {
        const a = addr[0];
        setLocation(`${a.name || ""} ${a.street || ""}, ${a.district || ""}, ${a.city || ""}`);
      }
    } catch (e) {
      setLoadingLocation(false);
      Alert.alert("Lỗi", "Không thể lấy vị trí hiện tại.");
    }
  };

  // ✅ Chọn ảnh / video
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

  // ✅ Khi chạm vào map → chọn vị trí
  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarker({ latitude, longitude });
  };

  // ✅ Đăng phòng
  const handleSubmit = () => {
    if (!roomName || !price || !location || !marker) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin và chọn vị trí!");
      return;
    }

    const newRoom = {
      name: roomName,
      price,
      location,
      description,
      amenities: selectedAmenities,
      media,
      coordinates: marker,
    };

    console.log("Dữ liệu đăng phòng:", newRoom);

    Alert.alert("Thành công", "Phòng của bạn đã được đăng!", [
      { text: "OK", onPress: () => router.replace("/") },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <View className="py-4">
        <Text className="text-2xl font-semibold text-[#3F72AF] text-center">
          Đăng phòng
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-2"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Tên phòng */}
        <Text className="text-[#3F72AF] font-semibold mb-1">Tên phòng</Text>
        <TextInput
          value={roomName}
          onChangeText={setRoomName}
          placeholder="VD: Phòng trọ sinh viên gần ĐH Bách Khoa"
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-[14px]"
        />

        {/* Giá thuê */}
        <Text className="text-[#3F72AF] font-semibold mb-1">Giá thuê (VNĐ/tháng)</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholder="VD: 2.500.000"
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-[14px]"
        />

        {/* Địa chỉ */}
        <Text className="text-[#3F72AF] font-semibold mb-1">Địa chỉ</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Nhập địa chỉ hoặc chọn trên bản đồ"
          className="border border-gray-300 rounded-xl px-4 py-3 mb-2 text-[14px]"
        />

        {/* Nút lấy vị trí */}
        <TouchableOpacity
          onPress={getCurrentLocation}
          className="flex-row items-center justify-center mb-4 bg-[#3F72AF] py-3 rounded-xl"
        >
          {loadingLocation ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="locate-outline" size={20} color="#fff" />
              <Text className="text-white ml-2 font-medium">Dùng vị trí hiện tại</Text>
            </>
          )}
        </TouchableOpacity>

        {/* 🗺️ Bản đồ */}
        <Text className="text-[#3F72AF] font-semibold mb-2">Chọn vị trí trên bản đồ</Text>
        <View className="w-full h-64 mb-4 rounded-xl overflow-hidden border border-gray-300">
          <MapView
            style={{ flex: 1 }}
            onPress={handleMapPress}
            initialRegion={{
              latitude: marker?.latitude || 11.94,
              longitude: marker?.longitude || 108.45,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <UrlTile
              urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
            />
            {marker && (
              <Marker
                coordinate={marker}
                title="Vị trí phòng"
                pinColor="#EA4335" // ✅ màu đỏ kiểu Google Maps
              />
            )}
          </MapView>
        </View>

        {marker && (
          <Text className="text-gray-600 mb-4 text-center">
            📍 {marker.latitude.toFixed(5)}, {marker.longitude.toFixed(5)}
          </Text>
        )}

        {/* Mô tả */}
        <Text className="text-[#3F72AF] font-semibold mb-1">Mô tả chi tiết</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="VD: Phòng rộng 20m², có gác lửng, gần chợ..."
          className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-[14px]"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        {/* Ảnh / Video */}
        <Text className="text-[#3F72AF] font-semibold mb-2">Ảnh / Video</Text>
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
        <Text className="text-[#3F72AF] font-semibold mb-2">Tiện nghi</Text>
        <AmenitiesList />

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
