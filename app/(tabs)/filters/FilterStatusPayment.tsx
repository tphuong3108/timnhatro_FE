import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export type PaymentStatus = "" | "pending" | "success" | "failed";

interface FilterStatusPaymentProps {
    visible: boolean;
    status: PaymentStatus;
    onClose: () => void;
    onApply: (status: PaymentStatus) => void;
}

export default function FilterStatusPayment({
    visible,
    status,
    onClose,
    onApply
}: FilterStatusPaymentProps) {

    const statuses = [
        { key: "", label: "Tất cả" },
        { key: "pending", label: "PENDING" },
        { key: "success", label: "SUCCESS" },
        { key: "failed", label: "FAILED" },
    ] as { key: PaymentStatus; label: string }[];

    const [selected, setSelected] = React.useState<PaymentStatus>(status);

    const applyFilter = () => {
        onApply(selected);
        onClose();
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/40">
                <View className="w-72 bg-white p-4 rounded-2xl">
                    <Text className="text-lg font-semibold text-[#112D4E] mb-3">
                        Lọc giao dịch
                    </Text>

                    {statuses.map((item) => (
                        <TouchableOpacity
                            key={item.key}
                            onPress={() => setSelected(item.key)}
                            className={`p-2 rounded-lg mb-2 ${
                                selected === item.key ? "bg-[#3F72AF]" : "bg-gray-200"
                            }`}
                        >
                            <Text
                                className={`text-center font-semibold ${
                                    selected === item.key ? "text-white" : "text-[#112D4E]"
                                }`}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        onPress={applyFilter}
                        className="bg-[#112D4E] py-3 rounded-lg mt-2"
                    >
                        <Text className="text-white text-center font-bold">Áp dụng</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} className="py-2 mt-2">
                        <Text className="text-center text-gray-600 font-medium">Hủy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
