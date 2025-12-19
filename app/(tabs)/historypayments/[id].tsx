import { paymentApi } from "@/services/paymentApi";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

export default function HostPaymentDetailScreen() {
  const { id, transactionData } = useLocalSearchParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ưu tiên lấy dữ liệu từ params truyền sang để tránh gọi API nhiều lần
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

    // Nếu không có dữ liệu truyền sang thì mới gọi API
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await paymentApi.getHostPaymentDetail(id as string);
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

  const handleCopyId = (text: string) => {
    Alert.alert("Mã giao dịch", text, [{ text: "OK" }]);
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
      {/* Header */}
      <View className="px-5 pt-6 pb-2 bg-white border-b border-gray-100">
        <Text className="text-xl font-bold text-[#112D4E] text-center">Chi tiết giao dịch</Text>
      </View>

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
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

        {/* Transaction Info */}
        <Animated.View 
          entering={FadeInDown.delay(100).duration(400)}
          className="bg-white rounded-2xl p-5 border border-gray-100 mb-4"
        >
          <Text className="text-base font-bold text-[#112D4E] mb-3">Thông tin giao dịch</Text>
          
          <DetailRow 
            label="Mã giao dịch" 
            value={transaction._id} 
            copyable 
            onCopy={() => handleCopyId(transaction._id)}
          />
          <DetailRow 
            label="Loại dịch vụ" 
            value={transaction.type === "premium" ? "Nâng cấp Premium" : "Thanh toán thường"} 
          />
          <DetailRow 
            label="Ngày tạo" 
            value={new Date(transaction.createdAt).toLocaleString("vi-VN")} 
          />
          <DetailRow label="Phương thức" value="VNPay" />
          
          {transaction.orderId && (
            <DetailRow 
              label="Mã đơn hàng" 
              value={transaction.orderId} 
              copyable 
              onCopy={() => handleCopyId(transaction.orderId)}
            />
          )}
        </Animated.View>

        {/* Premium Info - if available */}
        {transaction.durationDays && (
          <Animated.View 
            entering={FadeInDown.delay(200).duration(400)}
            className="bg-white rounded-2xl p-5 border border-gray-100 mb-4"
          >
            <Text className="text-base font-bold text-[#112D4E] mb-3">Gói Premium</Text>
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-yellow-50 items-center justify-center">
                <Ionicons name="star" size={20} color="#F9A825" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-bold text-[#112D4E]">
                  {transaction.durationDays} ngày Premium
                </Text>
                {transaction.premiumExpiry && (
                  <Text className="text-gray-500">
                    Hết hạn: {new Date(transaction.premiumExpiry).toLocaleDateString("vi-VN")}
                  </Text>
                )}
              </View>
            </View>
          </Animated.View>
        )}

        {/* Room Info */}
        {transaction.roomId && (
          <Animated.View 
            entering={FadeInDown.delay(300).duration(400)}
            className="bg-white rounded-2xl p-5 border border-gray-100"
          >
            <Text className="text-base font-bold text-[#112D4E] mb-3">Thông tin phòng</Text>
            
            {/* Room ID */}
            {(typeof transaction.roomId !== 'string' && transaction.roomId._id) && (
              <DetailRow 
                label="Mã phòng" 
                value={transaction.roomId._id} 
                copyable 
                onCopy={() => handleCopyId(transaction.roomId._id)}
              />
            )}
            
            {/* Room Name */}
            <DetailRow 
              label="Tên phòng" 
              value={typeof transaction.roomId === 'string' 
                ? transaction.roomId 
                : transaction.roomId.name || 'Không có tên'}
            />
            
            {/* Room Address */}
            {(typeof transaction.roomId !== 'string' && transaction.roomId.address) && (
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

function DetailRow({ 
  label, 
  value, 
  copyable = false,
  onCopy 
}: { 
  label: string; 
  value: string; 
  copyable?: boolean;
  onCopy?: () => void;
}) {
  return (
    <View className="flex-row justify-between py-3 border-b border-gray-50 last:border-0">
      <Text className="text-gray-500 flex-1">{label}</Text>
      <View className="flex-row items-center flex-[2] justify-end">
        <Text 
          className="text-[#112D4E] font-medium text-right ml-2" 
          numberOfLines={1} 
          ellipsizeMode="middle"
        >
          {value}
        </Text>
        {copyable && (
          <TouchableOpacity className="ml-1.5 p-1" onPress={onCopy}>
            <Ionicons name="copy-outline" size={14} color="#A0AEC0" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
