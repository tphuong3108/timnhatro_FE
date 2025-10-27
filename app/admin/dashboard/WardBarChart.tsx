import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import ChartCardWrapper from "@/components/admin/ChartCardWrapper";

export default function WardBarChart() {
  const { width } = useWindowDimensions();
  const chartWidth = width * 0.9;
  const chartHeight = width < 380 ? 220 : 200;

  const wardData = [
    { ward: "Quận 1", totalRooms: 35 },
    { ward: "Thủ Đức", totalRooms: 28 },
    { ward: "Bình Thạnh", totalRooms: 42 },
    { ward: "Gò Vấp", totalRooms: 31 },
    { ward: "Tân Bình", totalRooms: 26 },
    { ward: "Phú Nhuận", totalRooms: 22 },
    { ward: "Quận Bình Tân", totalRooms: 14 },
  ];

  const displayedData = wardData.slice(0, 5);

  const formatLabel = (label: string) => {
    return label.length > 8 ? label.slice(0, 7) + "…" : label;
  };

  const chartData = {
    labels: displayedData.map((item) => formatLabel(item.ward)),
    datasets: [
      {
        data: displayedData.map((item) => item.totalRooms),
        color: () => "#3F72AF",
      },
    ],
  };

  return (
    <ChartCardWrapper>
      <Text
        style={{
          fontSize: 17,
          fontWeight: "600",
          color: "#112D4E",
          marginBottom: 9,
        }}
      >
        Số lượng phòng theo khu vực
      </Text>
      <View style={{ alignItems: "center" }}>
        <BarChart
          data={chartData}
          width={chartWidth}
          height={chartHeight}
          fromZero
          showValuesOnTopOfBars
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(63, 114, 175, ${opacity})`,
            labelColor: () => "#3F72AF",
            barPercentage: 0.8,
            decimalPlaces: 0,
            propsForLabels: {
              transform: [{ rotate: "-35deg" }],
              fontSize: 13,
            },
            propsForBackgroundLines: {
              strokeWidth: 0,
            },
          }}
          style={{
            borderRadius: 12,
            marginLeft: -20,
          }}
        />
      </View>
    </ChartCardWrapper>
  );
}
