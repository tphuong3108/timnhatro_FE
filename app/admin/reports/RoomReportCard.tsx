import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface RoomReport {
  id: string;
  slug?: string;
  name: string;
  address: string;
  image: string;
  reportContent?: string;
  attachments?: string[];
  status: "approved" | "pending" | "rejected";
  host: {
    name: string;
    avatar: string;
  };
  reporter?: {
    name: string;
    avatar: string;
  };
}

interface Props {
  room: RoomReport;
  onApprove?: () => void;
  onReject?: () => void;
}

export default function RoomReportCard({ room, onApprove, onReject }: Props) {
  const router = useRouter();
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleApprove = () => {
    Alert.alert("Xác nhận", "Duyệt báo cáo này?", [
      { text: "Hủy", style: "cancel" },
      { text: "Duyệt", onPress: onApprove || (() => {}) },
    ]);
  };

  const handleReject = () => {
    Alert.alert("Xác nhận", "Từ chối báo cáo này?", [
      { text: "Hủy", style: "cancel" },
      { text: "Từ chối", onPress: onReject || (() => {}) },
    ]);
  };

  return (
    <View className="bg-white rounded-3xl shadow-sm mb-5 p-4 border border-gray-100">
      {/* Header */}
      <TouchableOpacity
        onPress={() => router.push(`/room/${room.slug || room.id}`)}
        activeOpacity={0.8}
        className="flex-row"
      >
        <Image
          source={{ uri: room.image }}
          className="w-[110px] h-[110px] rounded-2xl"
          resizeMode="cover"
        />

        <View className="flex-1 ml-3 justify-between">
          <View>
            <Text
              className="text-[16px] mt-6 font-semibold text-[#112D4E]"
              numberOfLines={1}
            >
              {room.name}
            </Text>
            <Text className="text-gray-500 text-[13px]" numberOfLines={1}>
              {room.address}
            </Text>

            {/* Chủ trọ */}
            <TouchableOpacity
              onPress={() => router.push(`/user/${room.host.name}`)}
              activeOpacity={0.8}
              className="flex-row items-center mt-2"
            >
              <Image
                source={{ uri: room.host.avatar }}
                className="w-[26px] h-[26px] rounded-full mr-2"
              />
              <Text className="text-gray-700 text-[13px]" numberOfLines={1}>
                Chủ trọ: {room.host.name}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {/* Nội dung báo cáo */}
      {room.reportContent && (
        <Text className="text-[13px] text-gray-700 mt-3 leading-5">
          {room.reportContent.length > 150
            ? room.reportContent.slice(0, 150) + "..."
            : room.reportContent}
        </Text>
      )}

      {/* Người báo cáo */}
      {room.reporter && (
        <View className="flex-row items-center mt-3">
          <Image
            source={{ uri: room.reporter.avatar }}
            className="w-[24px] h-[24px] rounded-full mr-2"
          />
          <Text className="text-gray-500 text-[13px] italic">
            Báo cáo bởi: {room.reporter.name}
          </Text>
        </View>
      )}

      {/* Ảnh minh chứng */}
      {room.attachments && room.attachments.length > 0 && (
        <View className="mt-4">
          <Text className="text-gray-500 text-[13px] mb-2 font-medium">
            Hình ảnh minh chứng
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
            contentContainerStyle={{ paddingRight: 8 }}
          >
            {room.attachments.map((uri, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  setSelectedImage(uri);
                  setShowImage(true);
                }}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri }}
                  className="w-24 h-24 rounded-xl mr-2 border border-gray-200"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Footer */}
      <View className="flex-row justify-end items-center mt-4 pt-3 border-t border-gray-100">
        {room.status === "pending" ? (
          <View className="flex-row space-x-2">
            <TouchableOpacity
              onPress={handleReject}
              className="flex-row items-center bg-red-50 px-3 py-1.5 rounded-xl"
            >
              <Ionicons name="close-circle-outline" size={14} color="#EF4444" />
              <Text className="text-red-600 ml-1 text-[13px] font-medium">
                Từ chối
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApprove}
              className="flex-row items-center bg-green-50 px-3 py-1.5 rounded-xl"
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={14}
                color="#10B981"
              />
              <Text className="text-green-700 ml-1 text-[13px] font-medium">
                Duyệt
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center">
            <Ionicons
              name={
                room.status === "approved"
                  ? "checkmark-circle"
                  : "close-circle"
              }
              size={16}
              color={room.status === "approved" ? "#10B981" : "#EF4444"}
            />
            <Text
              className={`ml-1 text-[13px] font-semibold ${
                room.status === "approved"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {room.status === "approved" ? "Đã duyệt" : "Đã từ chối"}
            </Text>
          </View>
        )}
      </View>

      {/* Modal xem ảnh full */}
      <Modal visible={showImage} transparent animationType="fade">
        <Pressable
          onPress={() => setShowImage(false)}
          className="flex-1 bg-black/90 justify-center items-center"
        >
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              className="w-full h-full"
              resizeMode="contain"
              style={{ width, height }}
            />
          )}
          <Text className="absolute top-14 right-5 text-white text-sm bg-black/60 px-3 py-1 rounded-full">
            Đóng
          </Text>
        </Pressable>
      </Modal>
    </View>
  );
}
