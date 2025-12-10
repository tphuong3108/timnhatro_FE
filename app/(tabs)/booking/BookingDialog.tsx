import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { bookingApi } from "../../../services/bookingApi";
import Toast from "react-native-toast-message";

interface BookingDialogProps {
  visible: boolean;
  onClose: () => void;
  roomId: string;
  hostId: string;
  roomName?: string;
  onBooked?: () => void;
}

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
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  const hours = [
    "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30",
    "19:00", "19:30", "20:00",
  ];

  useEffect(() => {
    if (!visible) return;

    const checkAlreadyBooked = async () => {
      try {
        const res = await bookingApi.checkUserBookedRoom(roomId);
        setAlreadyBooked(!!res.data?.alreadyBooked);
      } catch (err) {
        console.log("Check booking error:", err);
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
      console.log("Booking error:", err?.response?.data);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: err.response?.data?.error || "Có lỗi xảy ra",
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white p-6 rounded-t-3xl max-h-[90%]">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-xl font-bold mb-3">Đặt lịch xem phòng</Text>
              {roomName && (
                <Text className="text-lg font-semibold text-blue-600 mb-4">{roomName}</Text>
              )}

              {/* Chọn ngày */}
              <Text className="font-semibold mb-1">Ngày xem phòng</Text>
              <TouchableOpacity
                onPress={() => setOpenDatePicker(true)}
                className="border border-gray-300 p-3 rounded-xl mb-3"
              >
                <Text>{date || "Chọn ngày"}</Text>
              </TouchableOpacity>

              {/* Chọn giờ */}
              <Text className="font-semibold mb-1">Giờ xem phòng</Text>
              <TouchableOpacity
                onPress={() => setOpenTimePicker(true)}
                className="border border-gray-300 p-3 rounded-xl mb-3"
              >
                <Text>{time || "Chọn giờ"}</Text>
              </TouchableOpacity>

              {/* Ghi chú */}
              <Text className="font-semibold mb-1">Ghi chú</Text>
              <TextInput
                className="border border-gray-300 p-3 rounded-xl mb-3 min-h-[80px]"
                placeholder="Thông tin bạn muốn trao đổi..."
                value={note}
                onChangeText={setNote}
                multiline
                textAlignVertical="top"
              />

              {/* Nút đặt lịch */}
              <TouchableOpacity
                className={`py-4 rounded-xl mt-2 ${alreadyBooked ? "bg-gray-400" : "bg-blue-600"}`}
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
                className="py-3 mt-3 rounded-xl bg-gray-200"
              >
                <Text className="text-center text-gray-700 font-semibold">Đóng</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>

        {/* Modal chọn ngày */}
        <Modal visible={openDatePicker} transparent animationType="fade">
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-white p-4 rounded-t-3xl">
              <Calendar
                minDate={new Date().toISOString().split("T")[0]}
                onDayPress={(day) => {
                  setDate(day.dateString);
                  setOpenDatePicker(false);
                }}
                markedDates={{
                  [date || ""]: { selected: true, selectedColor: "#3B82F6" },
                }}
              />
              <TouchableOpacity
                onPress={() => setOpenDatePicker(false)}
                className="bg-red-500 p-3 rounded-xl mt-3"
              >
                <Text className="text-center text-white font-semibold">Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal chọn giờ */}
        <Modal visible={openTimePicker} transparent animationType="fade">
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-white p-4 rounded-t-3xl max-h-[60%]">
              <Text className="text-lg font-bold mb-3">Chọn khung giờ</Text>
              <FlatList
                data={hours}
                numColumns={3}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setTime(item);
                      setOpenTimePicker(false);
                    }}
                    className={`p-3 rounded-xl border mb-3 w-[30%] ${
                      time === item ? "bg-blue-500 border-blue-500" : "border-gray-300"
                    }`}
                  >
                    <Text className={`text-center ${time === item ? "text-white" : "text-gray-800"}`}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
              />
              <TouchableOpacity
                onPress={() => setOpenTimePicker(false)}
                className="bg-red-500 p-3 rounded-xl mt-3"
              >
                <Text className="text-center text-white font-semibold">Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
      <Toast position="top" />
    </Modal>
  );
}
