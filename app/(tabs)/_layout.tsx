import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { ActivityIndicator, View } from "react-native";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const router = useRouter();
  const [appReady, setAppReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const hasNavigated = useRef(false);

  useEffect(() => {
    async function initApp() {
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
      } catch (e) {
        console.error("Init error:", e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    }

    initApp();
  }, []);

  useEffect(() => {
    if (appReady && initialRoute && !hasNavigated.current) {
      hasNavigated.current = true;
      router.replace(
        initialRoute as "/" | "/(tabs)" | "/auth/login" | "/modal"
      );
    }
  }, [appReady, initialRoute, router]);

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
