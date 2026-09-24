import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Star, ArrowRight, Keyboard } from "lucide-react-native";

export function StarGlassBar({
  onPress,
  delay = 0,
}: {
  onPress?: () => void;
  delay?: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500).springify()}
      className="mx-4 mt-4"
    >
      <Pressable
        onPress={onPress}
        className="rounded-full overflow-hidden border border-white/8"
      >
        <LinearGradient
          colors={["#1A1D24", "#0E1015"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 18,
            paddingVertical: 14,
          }}
        >
          <Keyboard size={18} color="#fff" strokeWidth={2.4} />
          <View className="flex-row items-center gap-3 mx-4 flex-1 justify-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                size={22}
                color="rgba(255,255,255,0.25)"
                strokeWidth={2.2}
              />
            ))}
          </View>
          <ArrowRight size={20} color="#fff" strokeWidth={2.8} />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}