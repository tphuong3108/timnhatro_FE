import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Keyboard, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddRoomForm({
  roomName, setRoomName,
  price, setPrice,
  location, setLocation,
  marker, setMarker,
  description, setDescription,

  // ⭐ THÊM MỚI
  selectedWard,
  setSelectedWard,
  wards,
}: any) {

  const [suggestions, setSuggestions] = useState<any[]>([]);

  const fetchSuggestions = async (text: string) => {
    setLocation(text);
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&addressdetails=1&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.log("Error fetching suggestions:", err);
    }
  };

  const handleSelectSuggestion = (item: any) => {
    setLocation(item.display_name);
    setMarker({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    });
    setSuggestions([]);
    Keyboard.dismiss();
  };

  return (
    <>
      {/* Tên phòng */}
      <Text className="text-[#3F72AF] font-semibold mb-1">Tên phòng</Text>
      <TextInput
        value={roomName}
        onChangeText={setRoomName}
        placeholder="VD: Phòng trọ sinh viên gần ĐH Bách Khoa"
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-[14px]"
      />

      {/* Giá phòng */}
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
        onChangeText={fetchSuggestions}
        placeholder="Nhập địa chỉ hoặc chọn trên bản đồ"
        className="border border-gray-300 rounded-xl px-4 py-3 text-[14px]"
      />

      {/* ⭐ THÊM PICKER WARD */}
      <Text className="text-[#3F72AF] font-semibold mb-1 mt-4">Phường</Text>
      <View className="border border-gray-300 rounded-xl mb-4 bg-white h-9 justify-center">
        <Picker
          selectedValue={selectedWard}
          onValueChange={(val) => {setSelectedWard(val);
            const ward = wards?.find((w: any) => w._id === val);

              if (ward) {
                console.log("🆔 ID Phường:", ward._id);
                console.log("📍 Tên Phường:", ward.name);
              }
          }}
          style={{ color: '#111827', paddingHorizontal: 12 }}
          dropdownIconColor="#111827"
          itemStyle={{ color: '#111827', fontSize: 14 }}
          mode="dropdown"
        >
          <Picker.Item label="-- Chọn phường --" value="" />
          {wards?.map((w: any) => (
            <Picker.Item key={w._id} label={w.name} value={w._id} />
          ))}
        </Picker>
      </View>

      {/* Gợi ý địa chỉ */}
      {suggestions.length > 0 && (
        <View className="border border-gray-200 rounded-xl mt-1 bg-white shadow-sm max-h-48">
          <ScrollView keyboardShouldPersistTaps="handled">
            {suggestions.map((item, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleSelectSuggestion(item)}
                className="p-2 border-b border-gray-100"
              >
                <Text className="text-gray-700 text-[13px]">{item.display_name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Mô tả */}
      <Text className="text-[#3F72AF] font-semibold mb-1 mt-4">Mô tả chi tiết</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="VD: Phòng rộng 20m², có gác lửng, gần chợ..."
        multiline
        numberOfLines={5}
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-[14px]"
      />
    </>
  );
}
