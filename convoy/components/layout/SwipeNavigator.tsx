import { View, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useRouter, usePathname, type Href } from "expo-router";
import { runOnJS } from "react-native-reanimated";
import { ReactNode } from "react";


const TAB_ROUTES: Href[] = [
  "/",
  "/rides",
  "/track",
  "/garage",
  "/profile",
];

const { width } = Dimensions.get("window");
const SWIPE_DISTANCE = Math.max(80, width * 0.2);

export function SwipeNavigator({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const idx = TAB_ROUTES.findIndex((r) => r === pathname);

  const navigateTo = (dir: "left" | "right") => {
    if (idx === -1) return;
    const next = dir === "left" ? idx + 1 : idx - 1;
    if (next >= 0 && next < TAB_ROUTES.length) {
      router.replace(TAB_ROUTES[next]);
    }
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-40, 40])
    .failOffsetY([-20, 20])
    .onEnd((e) => {
      if (Math.abs(e.translationX) > SWIPE_DISTANCE) {
        runOnJS(navigateTo)(e.translationX < 0 ? "left" : "right");
      }
    });

  return (
    <GestureDetector gesture={pan}>
      <View style={{ flex: 1 }}>{children}</View>
    </GestureDetector>
  );
}