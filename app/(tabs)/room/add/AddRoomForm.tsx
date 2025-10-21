import React from "react";
import { View, Text, TextInput } from "react-native";

export default function AddRoomForm({
  roomName,
  setRoomName,
  price,
  setPrice,
  location,
  setLocation,
  description,
  setDescription,
}: any) {
  return (
    <>
      <Text className="text-[#3F72AF] font-semibold mb-1">Tên phòng</Text>
      <TextInput
        value={roomName}
        onChangeText={setRoomName}
        placeholder="VD: Phòng trọ sinh viên gần ĐH Bách Khoa"
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-[14px]"
      />

      <Text className="text-[#3F72AF] font-semibold mb-1">Giá thuê (VNĐ/tháng)</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="VD: 2.500.000"
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-[14px]"
      />

      <Text className="text-[#3F72AF] font-semibold mb-1">Địa chỉ</Text>
      <TextInput
        value={location}
        onChangeText={setLocation}
        placeholder="Nhập địa chỉ hoặc chọn trên bản đồ"
        className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-[14px]"
      />

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
    </>
  );
}
