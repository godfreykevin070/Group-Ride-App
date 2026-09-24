import { View, Text } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import {
  Repeat,
  Gauge,
  Route,
  TrendingUp,
  type LucideIcon,
} from "lucide-react-native";

const ICON_MAP: Record<string, LucideIcon> = {
  laps: Repeat,
  speed: Gauge,
  turns: Route,
  elevation: TrendingUp,
};

interface Item {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export function ColoredStatStack({
  items,
  header,
  delay = 0,
}: {
  items: Item[];
  header?: { left: string; right: string };
  delay?: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500).springify()}
      className="mx-4 rounded-[28px] bg-[#0C0E12] p-4 border border-white/6"
    >
      {header && (
        <View className="flex-row items-center justify-between mb-4 px-1">
          <Text
            className="text-white/50 text-[13px]"
            style={{ fontWeight: "800", letterSpacing: 1.2 }}
          >
            {header.left}
          </Text>
          <Text
            className="text-white text-[15px]"
            style={{ fontWeight: "900", letterSpacing: -0.3 }}
          >
            {header.right}
          </Text>
        </View>
      )}

      <View className="gap-2.5">
        {items.map((item, i) => {
          const Icon = ICON_MAP[item.icon] ?? Gauge;
          return (
            <Animated.View
              key={item.label}
              entering={FadeInRight.delay(delay + 100 + i * 60).duration(450)}
              className="flex-row gap-2"
            >
              {/* Left: value card */}
              <View className="flex-1 bg-white rounded-[20px] px-5 py-4 justify-center">
                <Text
                  className="text-black text-[38px] leading-[40px]"
                  style={{ fontWeight: "900", letterSpacing: -1.8 }}
                >
                  {item.value}
                </Text>
                <Text
                  className="text-black/60 text-[12px] mt-1"
                  style={{ fontWeight: "700" }}
                >
                  {item.label}
                </Text>
              </View>

              {/* Right: colored icon button */}
              <View
                className="w-[68px] rounded-[20px] items-center justify-center"
                style={{
                  backgroundColor: item.color,
                  shadowColor: item.color,
                  shadowOpacity: 0.5,
                  shadowRadius: 14,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 8,
                }}
              >
                <Icon size={28} color="#fff" strokeWidth={2.6} />
              </View>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );
}