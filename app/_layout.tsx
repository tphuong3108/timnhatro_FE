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
import { View, ActivityIndicator, Platform } from "react-native";

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
        await Font.loadAsync({
          InterRegular: Inter_400Regular,
          InterMedium: Inter_500Medium,
          InterSemiBold: Inter_600SemiBold,
          InterBold: Inter_700Bold,
        });

        const [token, hasSeenIntro, guestMode] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("hasSeenIntro"),
          AsyncStorage.getItem("guestMode"),
        ]);

        console.log("Auth check:", { token, hasSeenIntro, guestMode });

        if (!hasSeenIntro) setInitialRoute("/");
        else if (token || guestMode === "true") setInitialRoute("/(tabs)");
        else setInitialRoute("/auth/login");
      } catch (err) {
        console.error("Init error:", err);
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
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="modal" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
