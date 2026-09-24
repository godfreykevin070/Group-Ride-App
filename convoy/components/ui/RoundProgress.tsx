import { View, Text } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from "react-native-svg";
import Animated, {
  FadeInDown,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useEffect as useEffectReact } from "react";
import { COLORS } from "../../constants/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  percent: number;
  label?: string;
  right?: { label: string; value: string }[];
  delay?: number;
}

const SIZE = 160;
const STROKE = 18;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

export function RoundProgress({ percent, label, right, delay = 0 }: Props) {
  const progress = useSharedValue(0);
  const safePercent = Math.min(Math.max(percent, 0), 100);

  useEffectReact(() => {
    progress.value = withDelay(
      delay,
      withTiming(safePercent / 100, {
        duration: 1400,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [safePercent]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRC * (1 - progress.value),
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500).springify()}
      className="mx-4 flex-row items-center"
    >
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE} style={{ transform: [{ rotate: "-90deg" }] }}>
          <Defs>
            <SvgGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={COLORS.cardBlue} />
              <Stop offset="0.5" stopColor={COLORS.emerald} />
              <Stop offset="1" stopColor={COLORS.cardYellow} />
            </SvgGradient>
          </Defs>

          {/* Track */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={STROKE}
            fill="transparent"
          />

          {/* Progress */}
          <AnimatedCircle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="url(#ring)"
            strokeWidth={STROKE}
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={CIRC}
            animatedProps={animatedProps}
          />
        </Svg>

        {/* Center label */}
        <View
          className="absolute inset-0 items-center justify-center"
          style={{ transform: [{ rotate: "0deg" }] }}
        >
          <View className="w-[86px] h-[86px] rounded-full bg-[#1A1F2E] items-center justify-center">
            <Text
              className="text-white text-[30px] leading-[32px]"
              style={{ fontWeight: "900", letterSpacing: -1.5 }}
            >
              {safePercent}%
            </Text>
            {label && (
              <Text
                className="text-white/50 text-[9px] mt-0.5"
                style={{ fontWeight: "700", letterSpacing: 0.8 }}
              >
                {label}
              </Text>
            )}
          </View>
        </View>
      </View>

      {right && (
        <View className="flex-1 ml-5 gap-3">
          {right.map((row) => (
            <View key={row.label}>
              <Text
                className="text-white text-[24px] leading-[26px]"
                style={{ fontWeight: "900", letterSpacing: -1 }}
              >
                {row.value}
              </Text>
              <Text
                className="text-white/50 text-[12px] mt-0.5"
                style={{ fontWeight: "600" }}
              >
                {row.label}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
}