import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import { LanguageProvider, useLanguage } from "@/lib/language-context";
import {
  useFonts,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { t } = useLanguage();
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="article/[id]"
        options={{
          headerShown: true,
          headerTitle: "",
          headerBackTitle: "Back",
          headerTintColor: "#0D9488",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="symptom-checker"
        options={{
          headerShown: true,
          headerTitle: t("symptomChecker"),
          headerBackTitle: "Back",
          headerTintColor: "#0D9488",
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: "Nunito_700Bold", color: "#0F172A" },
        }}
      />
      <Stack.Screen
        name="add-visit"
        options={{
          headerShown: true,
          headerTitle: t("logPatientVisit"),
          headerBackTitle: "Back",
          headerTintColor: "#0D9488",
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: "Nunito_700Bold", color: "#0F172A" },
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="add-contact"
        options={{
          headerShown: true,
          headerTitle: t("addEmergencyContact"),
          headerBackTitle: "Back",
          headerTintColor: "#0D9488",
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: "Nunito_700Bold", color: "#0F172A" },
          presentation: "modal",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <GestureHandlerRootView>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
