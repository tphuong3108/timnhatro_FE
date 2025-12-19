import FilterStatusPayment, {
    PaymentStatus,
} from "@/components/filters/FilterStatusPayment";
import { paymentApi } from "@/services/paymentApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Transaction {
    _id: string;
    type: string;
    amount: number;
    status: "pending" | "success" | "failed";
    roomId?: { name: string };
    createdAt: string;
}

export default function HostPaymentHistory() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [payments, setPayments] = useState<Transaction[]>([]);
    const [showFilterModal, setShowFilterModal] = useState(false);

    const [filter, setFilter] = useState({
        status: "" as PaymentStatus,
    });

    const fetchPayments = useCallback(async (isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            const queryParams: any = {};

            if (filter.status) queryParams.status = filter.status;

            const response = await paymentApi.getHostPaymentHistory(queryParams);
            setPayments(response.data.data || []);
        } catch (error) {
            console.error("Error fetching host payments:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [filter.status]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    useEffect(() => {
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
        if (status === "failed") return "#F38181"; // Đổi sang màu đỏ nhạt cho đồng bộ
        return "#F9A825";
    };

    const getStatusIcon = (status: string) => {
        if (status === "success") return "checkmark-circle-outline";
        if (status === "failed") return "close-circle-outline";
        return "time-outline";
    };

    return (
        <View className="flex-1 bg-white p-4">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
                <View>
                    <Text className="text-4xl font-bold text-[#112D4E]">
                        Lịch sử giao dịch
                    </Text>
                    <Text className="text-gray-500 text-xs">Theo dõi các khoản thanh toán của bạn</Text>
                </View>

                <TouchableOpacity
                    className="p-3 bg-gray-50 rounded-2xl border border-gray-100"
                    onPress={() => setShowFilterModal(true)}
                >
                    <Ionicons name="filter" size={20} color="#3F72AF" />
                </TouchableOpacity>
            </View>

            {/* List Content */}
            {loading && payments.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3F72AF" />
                    <Text className="mt-4 text-gray-500">Đang tải dữ liệu...</Text>
                </View>
            ) : (
                <FlatList
                    data={payments}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl 
                            refreshing={refreshing || (loading && payments.length > 0)} 
                            onRefresh={onRefresh} 
                            colors={["#3F72AF"]} 
                        />
                    }
                    renderItem={({ item }) => {
                        const color = getStatusColor(item.status);

                        return (
                            <View
                                className="bg-white rounded-3xl p-5 mb-4 border border-gray-100 shadow-sm"
                            >
                                <View className="flex-row justify-between items-center mb-3">
                                    <View className="flex-row items-center">
                                        <View className="w-10 h-10 rounded-2xl bg-blue-50 items-center justify-center mr-3">
                                            <Ionicons name="receipt" size={20} color="#3F72AF" />
                                        </View>
                                        <Text className="text-base font-bold text-[#112D4E]">
                                            {item.type === "premium"
                                                ? "Nâng cấp Premium"
                                                : "Thanh toán"}
                                        </Text>
                                    </View>
                                    <View 
                                        className="px-3 py-1 rounded-full"
                                        style={{ backgroundColor: `${color}15` }}
                                    >
                                        <Text style={{ color, fontWeight: "bold", fontSize: 11 }}>
                                            {item.status.toUpperCase()}
                                        </Text>
                                    </View>
                                </View>

                                <View className="space-y-2">
                                    <View className="flex-row items-center">
                                        <Ionicons name="cash-outline" size={16} color="#718096" />
                                        <Text className="ml-2 text-gray-600">
                                            Số tiền: <Text className="font-bold text-[#112D4E]">{item.amount?.toLocaleString()} VND</Text>
                                        </Text>
                                    </View>

                                    {item.roomId && (
                                        <View className="flex-row items-center">
                                            <Ionicons name="home-outline" size={16} color="#718096" />
                                            <Text className="ml-2 text-gray-600">
                                                Phòng: <Text className="font-medium text-[#3F72AF]">{item.roomId.name}</Text>
                                            </Text>
                                        </View>
                                    )}

                                    <View className="flex-row items-center pt-2 border-t border-gray-50 mt-2">
                                        <Ionicons name="calendar-outline" size={14} color="#A0AEC0" />
                                        <Text className="ml-2 text-gray-400 text-xs">
                                            {new Date(item.createdAt).toLocaleString("vi-VN")}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                    ListEmptyComponent={
                        !loading ? (
                            <View className="flex-1 justify-center items-center py-20">
                                <Ionicons name="receipt-outline" size={64} color="#E2E8F0" />
                                <Text className="mt-4 text-gray-400 text-lg">Không có giao dịch nào</Text>
                            </View>
                        ) : null
                    }
                />
            )}

            <FilterStatusPayment
                visible={showFilterModal}
                status={filter.status}
                onClose={() => setShowFilterModal(false)}
                onApply={(newStatus) => {
                    setFilter((f) => ({ ...f, status: newStatus }));
                    setShowFilterModal(false);
                }}
            />
        </View>
    );
}
