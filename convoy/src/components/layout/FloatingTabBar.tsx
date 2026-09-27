import { View, Pressable, Platform, Text } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Icon } from "../ui/Icon";

const ICONS = {
  index: "home",
  clubs: "chat",
  rides: "route",
  friends: "users",
  profile: "user",
} as const;

interface Route {
  key: string;
  name: string;
}

interface Props {
  state: { index: number; routes: Route[] };
  navigation: {
    emit: (e: any) => { defaultPrevented: boolean };
    navigate: (n: string) => void;
  };
  unread?: number;
}

function TabItem({
  icon,
  focused,
  onPress,
  badge,
}: {
  icon: any;
  focused: boolean;
  onPress: () => void;
  badge?: number;
}) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = withSpring(0.86))}
      onPressOut={() => (scale.value = withSpring(1))}
      className="flex-1 h-[52px] items-center justify-center relative"
    >
      <Animated.View style={anim}>
        <Icon
          name={icon}
          size={22}
          color={focused ? "#FF7B6B" : "rgba(240,243,248,0.4)"}
          strokeWidth={focused ? 2.6 : 2.2}
        />
      </Animated.View>
      {focused && (
        <View className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
      )}
      {!!badge && badge > 0 && (
        <View className="absolute top-2 right-[22px] min-w-[16px] h-4 rounded-lg bg-primary items-center justify-center px-1 border-2 border-bg">
          <Text className="text-white text-[9px] font-black">{badge}</Text>
        </View>
      )}
    </Pressable>
  );
}

function Inner({ state, navigation, unread }: Props) {
  return (
    <View className="flex-row items-center justify-around h-16 px-2">
      {state.routes.map((route, i) => {
        const focused = state.index === i;
        const icon = ICONS[route.name as keyof typeof ICONS];
        if (!icon) return null;
        const badge = route.name === "clubs" ? unread : 0;
        return (
          <TabItem
            key={route.key}
            icon={icon}
            focused={focused}
            badge={badge}
            onPress={() => {
              const ev = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !ev.defaultPrevented) navigation.navigate(route.name);
            }}
          />
        );
      })}
    </View>
  );
}

export function FloatingTabBar({ state, navigation, unread = 0 }: Props) {
  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === "ios";

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: insets.bottom + 16,
        // ✅ Critical: force the bar above screen content on both platforms
        zIndex: 9999,
        elevation: 9999,
      }}
    >
      <View
        style={{
          borderRadius: 32,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.14)",
          shadowColor: "#000",
          shadowOpacity: 0.6,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 10 },
          elevation: 20,
          backgroundColor: "rgba(21,26,35,0.55)",
        }}
      >
        {isIOS ? (
          <BlurView intensity={90} tint="dark" style={{ backgroundColor: "transparent" }}>
            <Inner state={state} navigation={navigation} unread={unread} />
          </BlurView>
        ) : (
          <View style={{ backgroundColor: "rgba(21,26,35,0.88)" }}>
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: "rgba(255,255,255,0.10)",
              }}
            />
            <Inner state={state} navigation={navigation} unread={unread} />
          </View>
        )}
      </View>
    </View>
  );
}