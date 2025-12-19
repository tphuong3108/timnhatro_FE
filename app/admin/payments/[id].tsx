import { paymentApi } from "@/services/paymentApi";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

export default function TransactionDetailScreen() {
  const { id, transactionData } = useLocalSearchParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ưu tiên lấy dữ liệu từ params truyền sang để tránh gọi API BE đang thiếu
    if (transactionData) {
      try {
        const parsed = JSON.parse(transactionData as string);
        setTransaction(parsed);
        setLoading(false);
        return;
      } catch (err) {
        console.error("Error parsing transactionData:", err);
      }
    }

    // Nếu không có dữ liệu truyền sang thì mới gọi API (dành cho trường hợp reload trang)
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // Lưu ý: Sử dụng route mới của BE cho Admin: /payment/admin/:paymentId
        const res = await paymentApi.getAdminPaymentDetail(id as string);
        setTransaction(res.data?.data || res.data);
      } catch (err) {
        console.error("Error fetching transaction detail:", err);
        setError("Không thể tải chi tiết giao dịch từ máy chủ.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id, transactionData]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "success":
        return { color: "#3F72AF", icon: "checkmark-circle", label: "Thành công" };
      case "failed":
        return { color: "#F38181", icon: "close-circle", label: "Thất bại" };
      default:
        return { color: "#F9A825", icon: "time", label: "Đang chờ" };
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9FAFB]">
        <ActivityIndicator size="large" color="#3F72AF" />
        <Text className="mt-4 text-gray-500 font-medium">Đang tải chi tiết...</Text>
      </View>
    );
  }

  if (error || !transaction) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F9FAFB] px-10">
        <Ionicons name="alert-circle-outline" size={80} color="#CBD5E0" />
        <Text className="text-gray-600 text-center mt-4 text-lg font-medium">
          {error || "Không tìm thấy thông tin giao dịch."}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-8 bg-[#3F72AF] px-8 py-3 rounded-2xl shadow-sm"
        >
          <Text className="text-white font-bold">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusConfig = getStatusConfig(transaction.status);

  return (
    <View className="flex-1 bg-[#F9FAFB]">
      <View className="px-5 pt-6 pb-2 bg-white border-b border-gray-100">
        <Text className="text-xl font-bold text-[#112D4E] text-center">Chi tiết giao dịch</Text>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          entering={FadeInDown.duration(400)}
          className="bg-white rounded-2xl p-6 items-center border border-gray-100 mb-4"
        >
          <Animated.View entering={ZoomIn.delay(200)}>
            <Ionicons name={statusConfig.icon as any} size={84} color={statusConfig.color} />
          </Animated.View>
          <Text className="mt-4 text-2xl font-bold text-[#112D4E]">
            {transaction.amount?.toLocaleString()} VND
          </Text>
          <View 
            className="mt-3 px-4 py-1.5 rounded-full"
            style={{ backgroundColor: `${statusConfig.color}15` }}
          >
            <Text style={{ color: statusConfig.color, fontWeight: "bold", fontSize: 13 }}>
              {statusConfig.label.toUpperCase()}
            </Text>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          className="bg-white rounded-2xl p-5 border border-gray-100 mb-4"
        >
          <Text className="text-base font-bold text-[#112D4E] mb-3">Thông tin giao dịch</Text>
          
          <DetailRow label="Mã giao dịch" value={transaction._id} copyable />
          <DetailRow label="Loại dịch vụ" value={transaction.type === "premium" ? "Nâng cấp Premium" : "Thanh toán thường"} />
          <DetailRow label="Ngày tạo" value={new Date(transaction.createdAt).toLocaleString("vi-VN")} />
          <DetailRow label="Phương thức" value="VNPay" />
        </Animated.View>

        {transaction.userId && (
          <Animated.View 
            entering={FadeInDown.delay(200).duration(400)}
            className="bg-white rounded-2xl p-5 border border-gray-100 mb-4"
          >
            <Text className="text-base font-bold text-[#112D4E] mb-3">Khách hàng</Text>
            
            {transaction.userId._id && (
              <DetailRow 
                label="Mã khách hàng" 
                value={transaction.userId._id} 
                copyable 
              />
            )}
            
            {(transaction.userId.firstName || transaction.userId.lastName) && (
              <DetailRow 
                label="Họ tên" 
                value={`${transaction.userId.firstName || ''} ${transaction.userId.lastName || ''}`.trim()}
              />
            )}
            
            <DetailRow 
              label="Email" 
              value={transaction.userId.email}
            />
            
            {transaction.userId.phoneNumber && (
              <DetailRow 
                label="Số điện thoại" 
                value={transaction.userId.phoneNumber}
              />
            )}
          </Animated.View>
        )}

        {transaction.roomId && (
          <Animated.View 
            entering={FadeInDown.delay(300).duration(400)}
            className="bg-white rounded-2xl p-5 border border-gray-100"
          >
            <Text className="text-base font-bold text-[#112D4E] mb-3">Thông tin phòng</Text>
            
            {/* Room ID */}
            {transaction.roomId._id && (
              <DetailRow 
                label="Mã phòng" 
                value={transaction.roomId._id} 
                copyable 
              />
            )}
            
            {/* Room Name */}
            <DetailRow 
              label="Tên phòng" 
              value={transaction.roomId.name || 'Không có tên'}
            />
            
            {/* Room Address */}
            {transaction.roomId.address && (
              <DetailRow 
                label="Địa chỉ" 
                value={transaction.roomId.address}
              />
            )}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value, copyable = false }: { label: string; value: string; copyable?: boolean }) {
  return (
    <View className="flex-row justify-between py-3 border-b border-gray-50 last:border-0">
      <Text className="text-gray-500 flex-1">{label}</Text>
      <View className="flex-row items-center flex-[2] justify-end">
        <Text className="text-[#112D4E] font-medium text-right ml-2" numberOfLines={1} ellipsizeMode="middle">
          {value}
        </Text>
        {copyable && (
          <TouchableOpacity className="ml-1.5 p-1">
            <Ionicons name="copy-outline" size={14} color="#A0AEC0" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
