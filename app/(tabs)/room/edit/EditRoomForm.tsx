import React from "react";
import { View, Text, TextInput } from "react-native";

export default function EditRoomForm({ roomData, setRoomData }: any) {
  return (
    <View className="flex-1 bg-white">
      <Text className="text-lg font-semibold mb-2 text-gray-700">Tên phòng</Text>
      <TextInput
        className="border border-gray-300 rounded-xl px-3 py-2 mb-4"
        value={roomData.name}
        onChangeText={(text) => setRoomData({ ...roomData, name: text })}
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
