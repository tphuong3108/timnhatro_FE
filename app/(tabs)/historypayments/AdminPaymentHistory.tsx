import { paymentApi } from "@/services/paymentApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import FilterStatusPayment, { PaymentStatus } from "@/app/(tabs)/filters/FilterStatusPayment";

interface AdminTransaction {
  _id: string;
  type: string;
  amount: number;
  status: "pending" | "success" | "failed";
  userId?: { fullName: string; email: string };
  roomId?: { name: string };
  createdAt: string;
}

export default function AdminPaymentHistory() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<AdminTransaction[]>([]);

  // Modal status filter
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  // Modal date filter
  const [showDateFilter, setShowDateFilter] = useState(false);

  const [filter, setFilter] = useState({
    status: "" as PaymentStatus,
    startDate: "",
    endDate: "",
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const queryParams: any = {};

      if (filter.status) queryParams.status = filter.status;
      if (filter.startDate) queryParams.startDate = filter.startDate;
      if (filter.endDate) queryParams.endDate = filter.endDate;

      const response = await paymentApi.getAdminPaymentHistory(queryParams);
      setPayments(response.data.data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "success") return "#3F72AF";
    if (status === "failed") return "#B9D7EA";
    return "#F9A825";
  };

  const getStatusIcon = (status: string) => {
    if (status === "success") return "checkmark-circle-outline";
    if (status === "failed") return "close-circle-outline";
    return "time-outline";
  };

  return (
    <View className="flex-1 bg-white p-4">
      {/* HEADER */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-[#112D4E]">
          Lịch sử giao dịch (Admin)
        </Text>

        <View className="flex-row">
          {/* STATUS FILTER BUTTON */}
          <TouchableOpacity
            className="p-2 bg-[#3F72AF] rounded-full mr-2"
            onPress={() => setShowStatusFilter(true)}
          >
            <Ionicons name="filter-outline" size={22} color="white" />
          </TouchableOpacity>

          {/* DATE FILTER BUTTON */}
          <TouchableOpacity
            className="p-2 bg-[#112D4E] rounded-full"
            onPress={() => setShowDateFilter(true)}
          >
            <Ionicons name="calendar-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* LIST */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3F72AF" />
        </View>
      ) : payments.length === 0 ? (
        <Text className="text-gray-500 text-center mt-10">
          Không có giao dịch nào
        </Text>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const color = getStatusColor(item.status);

            return (
              <View
                className="rounded-2xl p-4 mb-4 shadow"
                style={{ backgroundColor: "#F9FAFB", elevation: 2 }}
              >
                <View className="flex-row items-center mb-2">
                  <Ionicons name="card-outline" size={22} color="#3F72AF" />
                  <Text className="ml-2 text-lg font-semibold text-[#112D4E]">
                    {item.type === "premium" ? "Nâng cấp Premium" : "Thanh toán"}
                  </Text>
                </View>

                <View className="flex-row items-center mt-1">
                  <Ionicons name="cash-outline" size={18} color="#112D4E" />
                  <Text className="ml-2 text-gray-700">
                    Số tiền: <Text className="font-bold">{item.amount} VND</Text>
                  </Text>
                </View>

                <View className="flex-row items-center mt-1">
                  <Ionicons name={getStatusIcon(item.status)} size={18} color={color} />
                  <Text className="ml-2 text-gray-700">
                    Trạng thái:{" "}
                    <Text style={{ color, fontWeight: "bold" }}>
                      {item.status.toUpperCase()}
                    </Text>
                  </Text>
                </View>

                {item.userId && (
                  <View className="mt-1">
                    <Text className="text-gray-700">
                      Người dùng:{" "}
                      <Text className="font-semibold">{item.userId.fullName}</Text>
                    </Text>
                    <Text className="text-gray-500 text-sm">{item.userId.email}</Text>
                  </View>
                )}

                {item.roomId && (
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="home-outline" size={18} color="#112D4E" />
                    <Text className="ml-2 text-gray-700">
                      Phòng:{" "}
                      <Text className="font-semibold">{item.roomId.name}</Text>
                    </Text>
                  </View>
                )}

                <View className="flex-row items-center mt-2">
                  <Ionicons name="calendar-outline" size={18} color="#3F72AF" />
                  <Text className="ml-2 text-gray-500 text-[13px]">
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* STATUS FILTER MODAL */}
      <FilterStatusPayment
        visible={showStatusFilter}
        status={filter.status}
        onClose={() => setShowStatusFilter(false)}
        onApply={(selectedStatus) =>
          setFilter((prev) => ({
            ...prev,
            status: selectedStatus,
          }))
        }
      />

      {/* DATE FILTER MODAL */}
      <Modal transparent visible={showDateFilter} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="w-80 bg-white p-4 rounded-2xl">
            <Text className="text-lg font-semibold text-[#112D4E] mb-3">
              Lọc theo ngày
            </Text>

            <Text className="font-semibold mb-1 text-[#112D4E]">
              Từ ngày (YYYY-MM-DD)
            </Text>
            <TextInput
              className="border p-2 rounded-lg mb-3"
              value={filter.startDate}
              placeholder="2025-01-01"
              onChangeText={(v) => setFilter((f) => ({ ...f, startDate: v }))}
            />

            <Text className="font-semibold mb-1 text-[#112D4E]">
              Đến ngày (YYYY-MM-DD)
            </Text>
            <TextInput
              className="border p-2 rounded-lg mb-3"
              value={filter.endDate}
              placeholder="2025-12-31"
              onChangeText={(v) => setFilter((f) => ({ ...f, endDate: v }))}
            />

            <TouchableOpacity
              onPress={() => {
                setShowDateFilter(false);
                fetchPayments();
              }}
              className="bg-[#112D4E] py-3 rounded-lg mt-2"
            >
              <Text className="text-white font-bold text-center">Áp dụng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowDateFilter(false)}
              className="py-2"
            >
              <Text className="text-center text-gray-600 font-medium">Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
