import ChartCardWrapper from "@/components/admin/ChartCardWrapper";
import React from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function LineChartCard({ title, data }: any) {
  const { width } = useWindowDimensions();
  const chartWidth = width * 0.85;
  const chartHeight = width < 380 ? 180 : 220;

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
        <LineChart
          data={data}
          width={chartWidth}
          height={chartHeight}
          yAxisLabel=""
          yAxisSuffix=""
          fromZero
          bezier
          withDots={false}
          withInnerLines={false}
          withVerticalLines={false}
          withShadow={false}
          withOuterLines={false}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(17, 45, 78, ${opacity})`,
            labelColor: () => "#3F72AF",
            propsForDots: { r: "0" },
          }}
          decorator={() => (
            <View
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 1,
                backgroundColor: "#E5E7EB",
              }}
            />
          )}
          style={{
            borderRadius: 12,
            marginLeft: 0,
          }}
        />
      </View>

      {/* Ghi chú tháng này / tháng trước */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 8,
          gap: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#80afe8ff",
              borderRadius: 3,
              marginRight: 6,
            }}
          />
          <Text style={{ fontSize: 12, color: "#374151" }}>Tháng này</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: "#e2b0c1ff",
              borderRadius: 3,
              marginRight: 6,
            }}
          />
          <Text style={{ fontSize: 12, color: "#374151" }}>Tháng trước</Text>
        </View>
      </View>
    </ChartCardWrapper>
  );
}
