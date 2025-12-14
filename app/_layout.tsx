import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { View, ActivityIndicator, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../contexts/AuthContext";
SplashScreen.preventAutoHideAsync().catch(() => {});

type RoutePath = "/" | "/(tabs)" | "/auth/login" | "/modal";

export default function RootLayout() {
  const router = useRouter();
  const [appReady, setAppReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<RoutePath | null>(null);
  const hasNavigated = useRef(false);

  useEffect(() => {
    async function prepareApp() {
      try {
        await AsyncStorage.removeItem("hasSeenIntro");

        await Font.loadAsync({
          InterRegular: Inter_400Regular,
          InterMedium: Inter_500Medium,
          InterSemiBold: Inter_600SemiBold,
          InterBold: Inter_700Bold,
          ...Ionicons.font,
          ...AntDesign.font,
        });

        const [token, guestMode] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("guestMode"),
        ]);

        setInitialRoute("/");
      } catch (err) {
      } finally {
        setAppReady(true);
      }
    }

    prepareApp();
  }, []);

  useEffect(() => {
    if (appReady && initialRoute && !hasNavigated.current) {
      hasNavigated.current = true;
      setTimeout(() => {
        router.replace(initialRoute);
        SplashScreen.hideAsync().catch(() => {});
      }, Platform.OS === "web" ? 100 : 0);
    }
  }, [appReady, initialRoute]);

  if (!appReady) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3F72AF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DefaultTheme}>
        <AuthProvider>

       
        <Stack
          screenOptions={{
            headerShown: false,
             animation: "fade",
            gestureEnabled: true,
            gestureDirection: "horizontal",
          }}
        >
          {/* Tabs chính */}
          <Stack.Screen name="(tabs)" />

          {/* Auth */}
          <Stack.Screen name="auth" />

          {/* Màn hình chi tiết phòng */}
          <Stack.Screen
            name="room"
            options={{
              gestureEnabled: true,
              gestureDirection: "horizontal",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen name="user" />

          {/* Modal */}
          <Stack.Screen name="modal" />
        </Stack>
        <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
