import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
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
        <View className="flex-1 bg-black">
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#000000" },
              animation: "fade_from_bottom",
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="ride/[id]" />
            <Stack.Screen
              name="group-rides"
              options={{ presentation: "modal" }}
            />
            <Stack.Screen name="expenses" options={{ presentation: "modal" }} />
            <Stack.Screen name="sos" options={{ presentation: "modal" }} />
          </Stack>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}