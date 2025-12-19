import React from "react";
import { StyleProp, useWindowDimensions, View, ViewStyle } from "react-native";

interface Props {
  children: React.ReactNode;
  height?: number;
  style?: StyleProp<ViewStyle>;
  width?: number;
}

export default function ChartCardWrapper({ children, height, style }: Props) {
  const { width } = useWindowDimensions();
  const defaultHeight = width < 350 ? 280 : 310; 
  return (
    <View
      style={[
        {
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 6,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          elevation: 3,
          width: width * 0.92,
          height: height || defaultHeight,
          alignSelf: "center",
          justifyContent: "space-between",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
