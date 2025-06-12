import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/constants/colors";
import { useAuthStore } from "@/store/useAuthStore";
import { useStore } from "@/store/useStore";

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  const { initializeAuth } = useAuthStore();
  const { fetchChallenges, fetchUserData } = useStore();

  useEffect(() => {
    // Initialize authentication state
    initializeAuth();
  }, []);

  // Fetch user data and challenges when authenticated
  const { isAuthenticated } = useAuthStore();
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
      fetchChallenges();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '600',
          },
          headerTintColor: colors.primary,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="premium" options={{ 
          title: "Premium Subscription",
          presentation: "modal",
        }} />
        <Stack.Screen name="profile" options={{ 
          title: "Your Profile",
        }} />
      </Stack>
    </>
  );
}