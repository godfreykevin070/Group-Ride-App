import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { AppProvider } from "../src/context/AppContext";
import "../global.css";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const nb = NavigationBar as any;
    try {
      nb.setStyle?.("light");
      nb.setBackgroundColorAsync?.("#00000000");
      nb.setButtonStyleAsync?.("light");
    } catch {}
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <View className="flex-1 bg-bg">
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "#0B0E15" },
                animation: "fade_from_bottom",
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="onboarding" options={{ animation: "fade" }} />

              {/* Clubs */}
              <Stack.Screen name="club/[id]" />
              <Stack.Screen name="club/create" options={{ presentation: "modal" }} />
              <Stack.Screen name="club/[id]/members" options={{ presentation: "modal" }} />

              {/* Rides */}
              <Stack.Screen name="ride/[id]" />
              <Stack.Screen
                name="ride/live"
                options={{ presentation: "fullScreenModal", animation: "slide_from_bottom" }}
              />
              <Stack.Screen name="ride/journal" />
              <Stack.Screen name="plan-ride" options={{ presentation: "modal" }} />

              {/* Other modals */}
              <Stack.Screen name="invite" options={{ presentation: "modal" }} />
              <Stack.Screen name="profile-edit" options={{ presentation: "modal" }} />
              <Stack.Screen
                name="sos"
                options={{ presentation: "modal", animation: "slide_from_bottom" }}
              />
            </Stack>
          </View>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}