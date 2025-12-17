import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import * as Font from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
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
        await Font.loadAsync({
          InterRegular: Inter_400Regular,
          InterMedium: Inter_500Medium,
          InterSemiBold: Inter_600SemiBold,
          InterBold: Inter_700Bold,
          ...Ionicons.font,
          ...AntDesign.font,
        });

        setInitialRoute("/");
      } catch {
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
  }, [appReady, initialRoute, router]);

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

          {/* Admin */}
          <Stack.Screen name="admin" />

          {/* Modal */}
          <Stack.Screen name="modal" />
        </Stack>
        <StatusBar style="auto" />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
