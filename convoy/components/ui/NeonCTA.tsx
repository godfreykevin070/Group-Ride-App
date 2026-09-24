import { View, Text, Pressable } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ArrowUpRight } from "lucide-react-native";
import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle: string;
  ctaText?: string;
  onPress?: () => void;
  icon?: ReactNode;
  delay?: number;
  variant?: "lime" | "red" | "purple";
}

const BG = {
  lime: "#D4FF3A",
  red: "#FF3B30",
  purple: "#8B5CF6",
};

export function NeonCTA({
  title,
  subtitle,
  ctaText = "Turn it ON",
  onPress,
  icon,
  delay = 0,
  variant = "lime",
}: Props) {
  const scale = useSharedValue(1);
  const bg = BG[variant];
  const textColor = variant === "red" ? "#fff" : "#000";

  const s = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    // OUTER: only handles the entering (layout) animation
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500).springify()}
      className="mx-4"
    >
      {/* INNER: only handles the press-scale transform */}
      <Animated.View style={s}>
        <Pressable
          onPressIn={() => (scale.value = withSpring(0.98))}
          onPressOut={() => (scale.value = withSpring(1))}
          onPress={onPress}
          className="rounded-[28px] p-5 relative overflow-hidden"
          style={{
            backgroundColor: bg,
            shadowColor: bg,
            shadowOpacity: 0.5,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 12 },
            elevation: 14,
          }}
        >
          <View
            className="absolute top-4 right-4 w-7 h-7 rounded-full items-center justify-center"
            style={{
              backgroundColor: variant === "red" ? "rgba(0,0,0,0.2)" : "#000",
            }}
          >
            <ArrowUpRight size={14} color="#fff" strokeWidth={3} />
          </View>

          <View className="flex-row items-center">
            <View className="flex-1 pr-20">
              {icon && <View className="mb-2">{icon}</View>}
              <Text
                className="text-[32px] leading-[34px]"
                style={{
                  color: textColor,
                  fontWeight: "900",
                  letterSpacing: -1.2,
                }}
              >
                {title}
              </Text>
              <Text
                className="text-[13px] mt-2 leading-[18px]"
                style={{
                  color:
                    variant === "red"
                      ? "rgba(255,255,255,0.85)"
                      : "rgba(0,0,0,0.7)",
                  fontWeight: "600",
                }}
              >
                {subtitle}
              </Text>

              {ctaText && (
                <Pressable
                  onPress={onPress}
                  className="self-start mt-4 rounded-full px-5 py-3"
                  style={{
                    backgroundColor:
                      variant === "red" ? "rgba(0,0,0,0.3)" : "#000",
                  }}
                >
                  <Text
                    className="text-white text-[13px]"
                    style={{ fontWeight: "800" }}
                  >
                    {ctaText}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}