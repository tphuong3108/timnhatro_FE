import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";
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

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        await Font.loadAsync({
          InterRegular: Inter_400Regular,
          InterMedium: Inter_500Medium,
          InterSemiBold: Inter_600SemiBold,
          InterBold: Inter_700Bold,
        });

        const token = await AsyncStorage.getItem("token");

        if (token) {
          router.replace("/(tabs)" as any);
        } else {
          router.replace("/" as any);
        }

        setLoaded(true);
        await SplashScreen.hideAsync();
      } catch (err) {
        console.error("App load error:", err);
      } finally {
        setCheckingAuth(false);
      }
    }

    load();
  }, [router]);

  if (!loaded || checkingAuth) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3F72AF" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="auth/forgot-password" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
