import { View, Text, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface Props {
  options: [string, string];
  value: number;
  onChange: (i: number) => void;
  delay?: number;
}

export function SplitToggle({ options, value, onChange, delay = 0 }: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400).springify()}
      className="mx-4 flex-row bg-[#0C0E12] border border-white/8 rounded-full p-1.5"
    >
      {options.map((opt, i) => {
        const active = i === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(i)}
            className="flex-1 items-center justify-center py-3 rounded-full"
            style={{
              backgroundColor: active ? "#fff" : "transparent",
            }}
          >
            <Text
              className="text-[15px]"
              style={{
                color: active ? "#000" : "rgba(255,255,255,0.6)",
                fontWeight: "800",
              }}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
}