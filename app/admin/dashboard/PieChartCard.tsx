import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import ChartCardWrapper from "@/components/admin/ChartCardWrapper";

export default function PieChartCard({ title, data }: any) {
  const { width } = useWindowDimensions();
  const chartWidth = width * 0.85;
  const chartHeight = 200;

  // ✅ Nếu data không hợp lệ hoặc rỗng
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <ChartCardWrapper>
        <Text className="text-gray-500 text-center">
          Không có dữ liệu để hiển thị
        </Text>
      </ChartCardWrapper>
    );
  }

  // ✅ Loại bỏ NaN / undefined / null
  const safeData = data
    .filter((item) => Number.isFinite(item.population))
    .map((item) => ({
      ...item,
      population: item.population ?? 0,
    }));

  // ✅ Nếu tất cả đều = 0 thì không vẽ chart
  const total = safeData.reduce((sum, i) => sum + i.population, 0);
  if (total === 0) {
    return (
      <ChartCardWrapper>
        <Text className="text-gray-500 text-center">
          Chưa có dữ liệu tăng trưởng
        </Text>
      </ChartCardWrapper>
    );
  }

  return (
    <ChartCardWrapper>
      <Text
        style={{
          fontSize: 16,
          fontWeight: "600",
          color: "#112D4E",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      <View style={{ alignItems: "center" }}>
        <PieChart
          data={safeData}
          width={chartWidth}
          height={chartHeight}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="10"
          hasLegend={true}
          chartConfig={{
            color: (opacity = 1) => `rgba(63, 114, 175, ${opacity})`,
            labelColor: () => "#3F72AF",
          }}
          absolute
        />
      </View>
    </ChartCardWrapper>
  );
}
