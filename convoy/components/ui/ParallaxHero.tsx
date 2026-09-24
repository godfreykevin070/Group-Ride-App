import { View, Text, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { ArrowLeft } from "lucide-react-native";
import { ReactNode } from "react";

interface Props {
  /** Source URI for the hero image. */
  image: string;
  /** Vertical space reserved for the hero. Default 400. */
  height?: number;
  /** Small uppercase label above the title (e.g. "R12 · MODERATE"). */
  eyebrow?: string;
  /** Main title — huge display text. */
  title: string;
  /** Optional subtitle under the title. */
  subtitle?: string;
  /** Shared value from `useScreenScroll()` in the parent screen. */
  scrollY: SharedValue<number>;
  /** Optional back button handler. Omit to hide the button. */
  onBack?: () => void;
  /** Optional custom bottom slot — buttons, chips, etc. */
  bottomSlot?: ReactNode;
  /** Parallax strength multiplier. Default 0.5. */
  parallaxStrength?: number;
}

export function ParallaxHero({
  image,
  height = 400,
  eyebrow,
  title,
  subtitle,
  scrollY,
  onBack,
  bottomSlot,
  parallaxStrength = 0.5,
}: Props) {
  const imageStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-100, 0, height],
      [-height * parallaxStrength, 0, height * 0.5],
      "clamp"
    );
    const scale = interpolate(
      scrollY.value,
      [-100, 0, height],
      [1.3, 1, 1.15],
      "clamp"
    );
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, height * 0.5],
      [1, 0],
      "clamp"
    );
    return { opacity };
  });

  return (
    <View style={{ height, overflow: "hidden" }}>
      {/* Parallax image layer */}
      <Animated.View style={[{ flex: 1 }, imageStyle]}>
        <Image
          source={{ uri: image }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Gradient + content overlay */}
      <Animated.View
        style={[
          {
            position: "absolute",
            inset: 0,
            justifyContent: "flex-end",
            padding: 20,
          },
          contentStyle,
        ]}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.75)", "#000000"]}
          locations={[0, 0.6, 1]}
          style={{ position: "absolute", inset: 0 }}
        />

        <View className="relative">
          {eyebrow && (
            <Text
              className="text-[#D4FF3A] text-[12px]"
              style={{ fontWeight: "900", letterSpacing: 1.4 }}
            >
              {eyebrow}
            </Text>
          )}
          <Text
            className="text-white text-[38px] leading-[40px] mt-1"
            style={{ fontWeight: "900", letterSpacing: -1.4 }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              className="text-white/70 text-[15px] mt-1"
              style={{ fontWeight: "700" }}
            >
              {subtitle}
            </Text>
          )}

          {bottomSlot && <View className="mt-5">{bottomSlot}</View>}
        </View>
      </Animated.View>

      {/* Back button — stays put even as content fades */}
      {onBack && (
        <Pressable
          onPress={onBack}
          className="absolute left-4 w-11 h-11 rounded-full bg-black/50 border border-white/10 items-center justify-center"
          style={{ top: 48 }}
        >
          <ArrowLeft size={20} color="#fff" strokeWidth={2.6} />
        </Pressable>
      )}
    </View>
  );
}