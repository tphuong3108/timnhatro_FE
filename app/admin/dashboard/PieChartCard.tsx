import ChartCardWrapper from "@/components/admin/ChartCardWrapper";
import React from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

export default function PieChartCard({ title, data }: any) {
  const { width } = useWindowDimensions();
  const chartWidth = width * 0.9;

  const chartData = (data ?? []).map((item: any, i: number) => ({
    name: item?.name ?? "Unknown",
    population: item?.value ?? 0,
    color:
      item?.color ||
      ["#A7C7E7", "#FFDAB9", "#B2E0B2", "#C5E1F9", "#F7A8B8"][i % 5],
    legendFontColor: "#444",
    legendFontSize: 13,
  }));
  
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
          data={chartData}
          width={chartWidth}
          height={width < 380 ? 180 : 210}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="10"
          hasLegend
          chartConfig={{
            color: (opacity = 1) => `rgba(17, 45, 78, ${opacity})`,
          }}
        />
      </View>
    </ChartCardWrapper>
  );
}
