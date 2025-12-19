import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Toast from "react-native-toast-message";
import { bookingApi } from "../../../services/bookingApi";

// Primary color theme - xanh dương chủ đạo
const PRIMARY_COLOR = "#3F72AF";

// Hàm lấy ngày mai (chặn đặt lịch trong ngày)
const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
};

interface BookingDialogProps {
  visible: boolean;
  onClose: () => void;
  roomId: string;
  hostId: string;
  roomName?: string;
  onBooked?: () => void;
}

// Các view mode - chỉ dùng 1 Modal, switch nội dung
type ViewMode = "form" | "date" | "time";

export default function BookingDialog({
  visible,
  onClose,
  roomId,
  hostId,
  roomName,
  onBooked,
}: BookingDialogProps) {
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("form");

  const hours = [
    "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30",
    "19:00", "19:30", "20:00",
  ];

  // Reset viewMode khi đóng dialog
  useEffect(() => {
    if (!visible) {
      setViewMode("form");
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const checkAlreadyBooked = async () => {
      try {
        const res = await bookingApi.checkUserBookedRoom(roomId);
        setAlreadyBooked(!!res.data?.alreadyBooked);
      } catch (err) {
      }
    };

    checkAlreadyBooked();
  }, [visible, roomId]);

  const handleSubmit = async () => {
    if (!date || !time) {
      Alert.alert("Lỗi", "Bạn phải chọn ngày và giờ");
      return;
    }
    if (alreadyBooked) {
      Alert.alert("Thông báo", "Bạn đã đặt lịch xem phòng này rồi!");
      return;
    }

    try {
      await bookingApi.createBooking({
        roomId,
        hostId,
        date,
        time,
        note,
      });

      Toast.show({ type: "success", text1: "Thành công", text2: "Đặt lịch thành công!" });
      if (onBooked) onBooked();
      onClose();
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: err.response?.data?.error || "Có lỗi xảy ra",
      });
    }
  };

  // Render nội dung form chính
  const renderFormContent = () => (
    <View className="bg-white p-6 rounded-t-3xl max-h-[90%]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-xl font-bold mb-3 text-gray-800">Đặt lịch xem phòng</Text>
        {roomName && (
          <Text style={{ color: PRIMARY_COLOR }} className="text-lg font-semibold mb-4">{roomName}</Text>
        )}

        {/* Chọn ngày */}
        <Text className="font-semibold mb-1 text-gray-700">Ngày xem phòng</Text>
        <TouchableOpacity
          onPress={() => setViewMode("date")}
          style={{ borderColor: date ? PRIMARY_COLOR : '#d1d5db' }}
          className="border p-3 rounded-xl mb-3"
        >
          <Text style={{ color: date ? PRIMARY_COLOR : '#6b7280' }}>{date || "Chọn ngày"}</Text>
        </TouchableOpacity>

        {/* Chọn giờ */}
        <Text className="font-semibold mb-1 text-gray-700">Giờ xem phòng</Text>
        <TouchableOpacity
          onPress={() => setViewMode("time")}
          style={{ borderColor: time ? PRIMARY_COLOR : '#d1d5db' }}
          className="border p-3 rounded-xl mb-3"
        >
          <Text style={{ color: time ? PRIMARY_COLOR : '#6b7280' }}>{time || "Chọn giờ"}</Text>
        </TouchableOpacity>

        {/* Ghi chú */}
        <Text className="font-semibold mb-1 text-gray-700">Ghi chú</Text>
        <TextInput
          className="border border-gray-300 text-[#3F72AF]  p-3 rounded-xl mb-3 min-h-[80px]"
          placeholder="Thông tin bạn muốn trao đổi..."
          value={note}
          onChangeText={setNote}
          multiline
          textAlignVertical="top"
          placeholderTextColor="#9ca3af"
        />

        {/* Nút đặt lịch */}
        <TouchableOpacity
          style={{ backgroundColor: alreadyBooked ? '#9ca3af' : PRIMARY_COLOR }}
          className="py-4 rounded-xl mt-2"
          disabled={alreadyBooked}
          onPress={handleSubmit}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {alreadyBooked ? "Đã đặt rồi" : "Đặt lịch"}
          </Text>
        </TouchableOpacity>

        {/* Nút đóng */}
        <TouchableOpacity
          onPress={onClose}
          className="py-3 mt-3 rounded-xl bg-gray-100"
        >
          <Text className="text-center text-gray-600 font-semibold">Đóng</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  // Render nội dung chọn ngày
  const renderDateContent = () => (
    <View className="bg-white p-4 rounded-t-3xl">
      <Text style={{ color: PRIMARY_COLOR }} className="text-lg font-bold mb-3 text-center">
        Chọn ngày xem phòng
      </Text>
      <Calendar
        minDate={getTomorrowDate()}
        onDayPress={(day) => {
          setDate(day.dateString);
          setViewMode("form");
        }}
        markedDates={{
          [date || ""]: { selected: true, selectedColor: PRIMARY_COLOR },
        }}
        theme={{
          todayTextColor: PRIMARY_COLOR,
          arrowColor: PRIMARY_COLOR,
          selectedDayBackgroundColor: PRIMARY_COLOR,
          dotColor: PRIMARY_COLOR,
        }}
      />
      <TouchableOpacity
        onPress={() => setViewMode("form")}
        className="p-3 rounded-xl mt-3 bg-gray-100"
      >
        <Text className="text-center text-gray-600 font-semibold">Quay lại</Text>
      </TouchableOpacity>
    </View>
  );

  // Render nội dung chọn giờ
  const renderTimeContent = () => (
    <View className="bg-white p-4 rounded-t-3xl max-h-[60%]">
      <Text style={{ color: PRIMARY_COLOR }} className="text-lg font-bold mb-3 text-center">
        Chọn khung giờ
      </Text>
      <FlatList
        data={hours}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setTime(item);
              setViewMode("form");
            }}
            style={{
              backgroundColor: time === item ? PRIMARY_COLOR : 'transparent',
              borderColor: time === item ? PRIMARY_COLOR : '#d1d5db',
            }}
            className="p-3 rounded-xl border mb-3 w-[30%]"
          >
            <Text 
              style={{ color: time === item ? '#ffffff' : '#374151' }}
              className="text-center font-medium"
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
      <TouchableOpacity
        onPress={() => setViewMode("form")}
        className="p-3 rounded-xl mt-3 bg-gray-100"
      >
        <Text className="text-center text-gray-600 font-semibold">Quay lại</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-end bg-black/40">
          {viewMode === "form" && renderFormContent()}
          {viewMode === "date" && renderDateContent()}
          {viewMode === "time" && renderTimeContent()}
        </View>
      </KeyboardAvoidingView>
      <Toast position="top" />
    </Modal>
  );
}
