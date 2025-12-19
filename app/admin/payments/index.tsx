import FilterStatusPayment, { PaymentStatus } from "@/components/filters/FilterStatusPayment";
import { paymentApi } from "@/services/paymentApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface AdminTransaction {
  _id: string;
  type: string;
  amount: number;
  status: "pending" | "success" | "failed";
  orderId?: string;
  premiumDuration?: number;
  userId?: { 
    _id?: string;
    firstName?: string; 
    lastName?: string; 
    email: string; 
    phoneNumber?: string;
    avatar?: string;
  };
  roomId?: { 
    _id?: string;
    name: string; 
    address?: string;
    images?: string[];
    isPremium?: boolean;
    premiumUntil?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export default function AdminPaymentHistory() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [payments, setPayments] = useState<AdminTransaction[]>([]);

  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);

  const [filter, setFilter] = useState({
    status: "" as PaymentStatus,
    startDate: "",
    endDate: "",
  });

  const fetchPayments = useCallback(async (isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      const queryParams: any = {};

      if (filter.status) queryParams.status = filter.status;
      if (filter.startDate) queryParams.startDate = filter.startDate;
      if (filter.endDate) queryParams.endDate = filter.endDate;

      const response = await paymentApi.getAdminPaymentHistory(queryParams);
      setPayments(response.data.data || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchPayments();
    const interval = setInterval(() => {
      fetchPayments(true);
    }, 2000);
    return () => clearInterval(interval);
  }, [fetchPayments]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPayments(true);
  };

  const getStatusColor = (status: string) => {
    if (status === "success") return "#3F72AF";
    if (status === "failed") return "#F38181";
    return "#F9A825";
  };

  const renderItem = ({ item, index }: { item: AdminTransaction; index: number }) => {
    const color = getStatusColor(item.status);

    return (
      <TouchableOpacity
        onPress={() => {
          // Truyền toàn bộ dữ liệu giao dịch sang trang chi tiết để không cần gọi API BE
          router.push({
            pathname: "/admin/payments/[id]",
            params: { 
              id: item._id,
              transactionData: JSON.stringify(item)
            }
          });
        }}
        activeOpacity={0.7}
      >
        <Animated.View
          entering={FadeInUp.delay(index * 50)}
          className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-gray-100"
        >
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
                <Ionicons name="card" size={20} color="#3F72AF" />
              </View>
              <View>
                <Text className="text-lg font-bold text-[#112D4E]">
                  {item.type === "premium" ? "Nâng cấp Premium" : "Thanh toán"}
                </Text>
                <Text className="text-gray-400 text-xs">
                  ID: {item._id.substring(0, 8)}...
                </Text>
              </View>
            </View>
            <View 
              className="px-3 py-1 rounded-full" 
              style={{ backgroundColor: `${color}20` }}
            >
              <Text style={{ color, fontSize: 12, fontWeight: "bold" }}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>

        <View className="space-y-2">
          <View className="flex-row items-center">
            <Ionicons name="cash-outline" size={16} color="#4A5568" />
            <Text className="ml-2 text-gray-700">
              Số tiền: <Text className="font-bold text-[#112D4E]">{item.amount?.toLocaleString()} VND</Text>
            </Text>
          </View>

            {item.userId && (
              <View className="flex-row items-center mt-2">
                {item.userId.avatar ? (
                  <Image 
                    source={{ uri: item.userId.avatar }} 
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <Ionicons name="person-circle-outline" size={18} color="#4A5568" />
                )}
                <Text className="ml-2 text-gray-700 font-medium">
                  {item.userId.firstName && item.userId.lastName 
                    ? `${item.userId.firstName} ${item.userId.lastName}`
                    : item.userId.email}
                </Text>
              </View>
            )}

            {item.roomId && (
              <View className="flex-row items-center">
                <Ionicons name="home-outline" size={16} color="#4A5568" />
                <Text className="ml-2 text-gray-700">
                  Phòng: <Text className="font-semibold text-[#3F72AF]">{item.roomId.name}</Text>
                </Text>
              </View>
            )}

            <View className="flex-row items-center justify-between pt-2 border-t border-gray-50 mt-2">
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={14} color="#A0AEC0" />
                <Text className="ml-2 text-gray-400 text-xs">
                  {new Date(item.createdAt).toLocaleString("vi-VN")}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={14} color="#CBD5E0" />
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-[#F9FAFB] px-4 pt-4">
      <View className="flex-row justify-between items-end mb-6">
        <View>
          <Text className="text-2xl font-bold text-[#112D4E]">Lịch sử thanh toán</Text>
          <Text className="text-gray-500 text-sm">Quản lý giao dịch hệ thống</Text>
        </View>

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setShowStatusFilter(true)}
            className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-gray-100"
          >
            <Ionicons name="filter" size={20} color="#3F72AF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowDateFilter(true)}
            className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-gray-100"
          >
            <Ionicons name="calendar" size={20} color="#112D4E" />
          </TouchableOpacity>
        </View>
      </View>

      {loading && payments.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3F72AF" />
          <Text className="mt-4 text-gray-500 font-medium">Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing || (loading && payments.length > 0)} onRefresh={onRefresh} colors={["#3F72AF"]} />
          }
          ListEmptyComponent={
            !loading ? (
              <View className="flex-1 justify-center items-center py-20">
                <Ionicons name="receipt-outline" size={64} color="#CBD5E0" />
                <Text className="mt-4 text-gray-400 text-lg">Không có giao dịch nào</Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Filter Modals */}
      <FilterStatusPayment
        visible={showStatusFilter}
        status={filter.status}
        onClose={() => setShowStatusFilter(false)}
        onApply={(selectedStatus) => {
          setFilter((prev) => ({ ...prev, status: selectedStatus }));
          setShowStatusFilter(false);
        }}
      />

      <Modal transparent visible={showDateFilter} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-[85%] bg-white p-6 rounded-3xl shadow-xl">
            <Text className="text-xl font-bold text-[#112D4E] mb-5">Lọc theo ngày</Text>

            <View className="mb-4">
              <Text className="text-gray-600 font-semibold mb-2">Từ ngày</Text>
              <TextInput
                className="bg-gray-50 p-4 rounded-2xl border border-gray-100"
                value={filter.startDate}
                placeholder="YYYY-MM-DD"
                onChangeText={(v) => setFilter((f) => ({ ...f, startDate: v }))}
              />
            </View>

            <View className="mb-6">
              <Text className="text-gray-600 font-semibold mb-2">Đến ngày</Text>
              <TextInput
                className="bg-gray-50 p-4 rounded-2xl border border-gray-100"
                value={filter.endDate}
                placeholder="YYYY-MM-DD"
                onChangeText={(v) => setFilter((f) => ({ ...f, endDate: v }))}
              />
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowDateFilter(false)}
                className="flex-1 py-4 rounded-2xl bg-gray-100"
              >
                <Text className="text-center text-gray-600 font-bold">Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowDateFilter(false);
                  fetchPayments();
                }}
                className="flex-1 py-4 rounded-2xl bg-[#112D4E]"
              >
                <Text className="text-white font-bold text-center">Áp dụng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
