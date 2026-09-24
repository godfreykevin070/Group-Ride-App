import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface Props {
  eyebrow: string;
  value: string;
  caption: string;
  delay?: number;
}

export function MetricDisplay({ eyebrow, value, caption, delay = 0 }: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500).springify()}
      className="mx-4 mt-6 pb-6 border-b border-white/8"
    >
      <Text
        className="text-white/50 text-[13px]"
        style={{ fontWeight: "800", letterSpacing: 1 }}
      >
        {eyebrow.toUpperCase()}
      </Text>
      <Text
        className="text-white text-[52px] leading-[56px] mt-2"
        style={{ fontWeight: "900", letterSpacing: -2 }}
      >
        {value}
      </Text>
      <Text
        className="text-white/70 text-[15px] mt-1"
        style={{ fontWeight: "600" }}
      >
        {caption}
      </Text>
    </Animated.View>
  );
}