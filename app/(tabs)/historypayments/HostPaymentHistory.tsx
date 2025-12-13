import { paymentApi } from "@/services/paymentApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState, useCallback } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import FilterStatusPayment, {
    PaymentStatus,
} from "../filters/FilterStatusPayment";

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
    const [payments, setPayments] = useState<Transaction[]>([]);
    const [showFilterModal, setShowFilterModal] = useState(false);

    const [filter, setFilter] = useState({
        status: "" as PaymentStatus,
    });
    const fetchPayments = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams: any = {};

            if (filter.status) queryParams.status = filter.status;

            const response = await paymentApi.getHostPaymentHistory(queryParams);
            setPayments(response.data.data || []);
        } catch (error) {
            console.error("Lỗi lấy lịch sử giao dịch:", error);
        } finally {
            setLoading(false);
        }
    }, [filter.status]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

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
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-2xl font-bold text-[#112D4E]">
                    Lịch sử giao dịch
                </Text>

                <TouchableOpacity
                    className="p-2 bg-[#3F72AF] rounded-full"
                    onPress={() => setShowFilterModal(true)}
                >
                    <Ionicons name="filter-outline" size={22} color="white" />
                </TouchableOpacity>
            </View>

            {/* Loading */}
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
                                {/* Tiêu đề giao dịch */}
                                <View className="flex-row items-center mb-2">
                                    <Ionicons name="card-outline" size={22} color="#3F72AF" />
                                    <Text className="ml-2 text-lg font-semibold text-[#112D4E]">
                                        {item.type === "premium"
                                            ? "Nâng cấp Premium"
                                            : "Thanh toán"}
                                    </Text>
                                </View>

                                {/* Số tiền */}
                                <View className="flex-row items-center mt-1">
                                    <Ionicons name="cash-outline" size={18} color="#112D4E" />
                                    <Text className="ml-2 text-gray-700">
                                        Số tiền:{" "}
                                        <Text className="font-bold">{item.amount} VND</Text>
                                    </Text>
                                </View>

                                {/* Trạng thái */}
                                <View className="flex-row items-center mt-1">
                                    <Ionicons
                                        name={getStatusIcon(item.status)}
                                        size={18}
                                        color={color}
                                    />
                                    <Text className="ml-2 text-gray-700">
                                        Trạng thái:{" "}
                                        <Text style={{ color, fontWeight: "bold" }}>
                                            {item.status.toUpperCase()}
                                        </Text>
                                    </Text>
                                </View>

                                {/* Tên phòng */}
                                {item.roomId && (
                                    <View className="flex-row items-center mt-1">
                                        <Ionicons
                                            name="home-outline"
                                            size={18}
                                            color="#112D4E"
                                        />
                                        <Text className="ml-2 text-gray-700">
                                            Phòng:{" "}
                                            <Text className="font-semibold">
                                                {item.roomId.name}
                                            </Text>
                                        </Text>
                                    </View>
                                )}

                                {/* Ngày tạo */}
                                <View className="flex-row items-center mt-2">
                                    <Ionicons
                                        name="calendar-outline"
                                        size={18}
                                        color="#3F72AF"
                                    />
                                    <Text className="ml-2 text-gray-500 text-[13px]">
                                        {new Date(item.createdAt).toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                        );
                    }}
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
