import { Tabs } from "expo-router";
import { View, Pressable, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  Home,
  List,
  Navigation2,
  Wrench,
  User,
  type LucideIcon,
} from "lucide-react-native";
import { SwipeNavigator } from "../../components/layout/SwipeNavigator";

const ICONS: Record<string, LucideIcon> = {
  index: Home,
  rides: List,
  track: Navigation2,
  garage: Wrench,
  profile: User,
};

interface BarProps {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (e: any) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
}

const PILL_HEIGHT = 62;
const PILL_RADIUS = 40;
const HIGHLIGHT_SIZE = 44;
const HIGHLIGHT_RADIUS = HIGHLIGHT_SIZE / 2;

function TabIcon({
  Icon,
  focused,
  onPress,
}: {
  Icon: LucideIcon;
  focused: boolean;
  onPress: () => void;
}) {
  const s = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: s.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (s.value = withSpring(0.85))}
      onPressOut={() => (s.value = withSpring(1))}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      hitSlop={6}
    >
      <Animated.View
        style={[
          animStyle,
          {
            width: HIGHLIGHT_SIZE,
            height: HIGHLIGHT_SIZE,
            // explicit numeric radius — do NOT use rounded-full here
            borderRadius: HIGHLIGHT_RADIUS,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: focused
              ? "rgba(255,255,255,0.14)"
              : "transparent",
            // ensures Android clips the rounded corners even on re-render
            overflow: "hidden",
          },
        ]}
      >
        <Icon
          size={22}
          color={focused ? "#FFFFFF" : "rgba(255,255,255,0.55)"}
          strokeWidth={focused ? 2.6 : 2.2}
        />
      </Animated.View>
    </Pressable>
  );
}

function GlassTabBar({ state, navigation }: BarProps) {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 16) + 4;

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 24,
        right: 24,
        bottom,
      }}
    >
      {/* Outer shell — owns the shadow + border + clip */}
      <View
        style={{
          borderRadius: PILL_RADIUS,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.12)",
          shadowColor: "#000",
          shadowOpacity: 0.7,
          shadowRadius: 28,
          shadowOffset: { width: 0, height: 10 },
          elevation: 22,
        }}
      >
        {/* BlurView — must ALSO carry the same radius + overflow on Android */}
        <BlurView
          intensity={Platform.OS === "ios" ? 70 : 100}
          tint="dark"
          style={{
            backgroundColor: "rgba(15,15,15,0.7)",
            borderRadius: PILL_RADIUS,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              height: PILL_HEIGHT,
              paddingHorizontal: 8,
            }}
          >
            {state.routes.map((route, index) => {
              const focused = state.index === index;
              const Icon = ICONS[route.name];
              if (!Icon) return null;
              return (
                <TabIcon
                  key={route.key}
                  Icon={Icon}
                  focused={focused}
                  onPress={() => {
                    const ev = navigation.emit({
                      type: "tabPress",
                      target: route.key,
                      canPreventDefault: true,
                    });
                    if (!focused && !ev.defaultPrevented) {
                      navigation.navigate(route.name);
                    }
                  }}
                />
              );
            })}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <SwipeNavigator>
      <Tabs
        tabBar={(props) => <GlassTabBar {...(props as unknown as BarProps)} />}
        screenOptions={{ headerShown: false, tabBarStyle: { display: "none" } }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="rides" />
        <Tabs.Screen name="track" />
        <Tabs.Screen name="garage" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </SwipeNavigator>
  );
}