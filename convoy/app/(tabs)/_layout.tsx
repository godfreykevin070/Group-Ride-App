import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { FloatingTabBar } from "../../src/components/layout/FloatingTabBar";
import { useApp } from "../../src/context/AppContext";

export default function TabsLayout() {
  const router = useRouter();
  const { state, ready } = useApp();

  useEffect(() => {
    if (!ready) return;
    if (!state.user?.onboardedAt) {
      router.replace("/onboarding");
    }
  }, [ready, state.user]);

  const totalUnread = state.clubs.reduce((s, c) => s + (c.unread || 0), 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // ✅ Do NOT set tabBarStyle — the custom FloatingTabBar owns
        // its own height and position, and this slot needs to stay visible.
      }}
      tabBar={(props) => (
        <FloatingTabBar
          state={{ index: props.state.index, routes: props.state.routes }}
          navigation={props.navigation as any}
          unread={totalUnread}
        />
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="clubs" />
      <Tabs.Screen name="rides" />
      <Tabs.Screen name="friends" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}