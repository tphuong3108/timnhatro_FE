import React, {useState, useEffect} from "react";
import { View, Text, TextInput,ScrollView, TouchableOpacity } from "react-native";
import apiClient from "@/services/apiClient";
export default function EditRoomForm({ roomData, setRoomData }: any) {
  const [wardText, setWardText] = useState("");
  const [showWardList, setShowWardList] = useState(false);
  const [wards, setWards] = useState<any[]>([]);
  useEffect(() => {
  const loadWards = async () => {
    try {
      const res = await apiClient.get("/wards");
      setWards(res.data);
    } catch (err) {
      console.log("❌ Lỗi load wards:", err);
    }
  };
  loadWards();
}, []);
useEffect(() => {
    if (roomData?.ward && wards.length > 0) {
      const found = wards.find((w) => w._id === roomData.ward);
      if (found) setWardText(found.name);
    }
  }, [roomData?.ward, wards]);
  return (
    <View className="flex-1 bg-white">
      <Text className="text-lg font-semibold mb-2 text-gray-700">Tên phòng</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-3 py-2 mb-4"
        value={roomData.name}
        onChangeText={(text) => setRoomData((prev: any) => ({ ...prev, name: text }))}
      />

      <Text className="text-lg font-semibold mb-2 text-gray-700">Giá (VNĐ)</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-3 py-2 mb-4"
        keyboardType="numeric"
        value={roomData.price?.toString() || ""}
        onChangeText={(text) => setRoomData({ ...roomData, price: text })}
      />

      <Text className="text-lg font-semibold mb-2 text-gray-700">Địa chỉ</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-3 py-2 mb-4"
        value={roomData.address}
        onChangeText={(text) => setRoomData({ ...roomData, address: text })}
      />
      <Text className="text-lg font-semibold mb-2 text-gray-700">Phường</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-3 py-2"
        value={wardText}
        placeholder="Nhập tên phường..."
        onChangeText={(text) => {
          setWardText(text);
          setShowWardList(true);
        }}
      />

      {showWardList && wardText.length > 0 && (
        <View className="border border-gray-200 rounded-xl mt-1 bg-white max-h-40">
          <ScrollView keyboardShouldPersistTaps="handled">
            {wards
              .filter((w: any) =>
                w.name.toLowerCase().includes(wardText.toLowerCase())
              )
              .map((w: any) => (
                <TouchableOpacity
                  key={w._id}
                  onPress={() => {
                    setWardText(w.name);
                    setRoomData((prev: any) => ({
                      ...prev,
                      ward: w._id,
                    }));
                    setShowWardList(false);
                  }}
                  className="p-2 border-b border-gray-100"
                >
                  <Text className="text-gray-700 text-sm">{w.name}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}
      <Text className="text-lg font-semibold mb-2 text-gray-700">Mô tả</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-3 py-2 mb-4"
        value={roomData.description}
        onChangeText={(text) => setRoomData({ ...roomData, description: text })}
        multiline
        numberOfLines={3}
      />
    </View>
  );
}
