import { View, Text, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect as useEffectReact } from "react";
import {
  Satellite,
  Pause,
  Square,
  Plus,
  MoreHorizontal,
  Navigation,
} from "lucide-react-native";
import { CONVOY_RIDERS, UPCOMING_RIDE } from "../../constants/mockData";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { ColoredStatStack } from "../../components/ui/ColoredStatStack";

const TRACK_METRICS = [
  { label: "Riders", value: "04", icon: "laps", color: "#FFD60A" },
  { label: "Avg Speed", value: "42", icon: "speed", color: "#00D68F" },
  { label: "Distance", value: "8.4", icon: "turns", color: "#4A6CF7" },
  { label: "Checkpoints", value: "02", icon: "elevation", color: "#FF6B35" },
];

export default function Track() {
  const pulse = useSharedValue(0.5);
  useEffectReact(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: pulse.value }],
  }));

  return (
    <ScreenContainer>
      {/* Header */}
      <View className="px-4 pt-3 pb-4">
        <Text
          className="text-white/50 text-[12px]"
          style={{ fontWeight: "800", letterSpacing: 1.4 }}
        >
          LIVE TRACKING
        </Text>
        <Text
          className="text-white text-[34px] leading-[36px] mt-1"
          style={{ fontWeight: "900", letterSpacing: -1.4 }}
        >
          {UPCOMING_RIDE.city} Run
        </Text>
      </View>

      {/* Map area */}
      <Animated.View
        entering={FadeInDown.duration(600).springify()}
        className="mx-4 rounded-[28px] overflow-hidden border border-white/8"
        style={{ height: 320 }}
      >
        <LinearGradient
          colors={["#0F2818", "#001A10", "#000000"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {/* Route placeholder */}
          <View className="absolute inset-0 opacity-30">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                className="absolute"
                style={{
                  top: 40 + i * 45,
                  left: 20,
                  right: 20,
                  height: 1,
                  backgroundColor: "rgba(212,255,58,0.15)",
                  transform: [{ rotate: `${i % 2 === 0 ? -8 : 8}deg` }],
                }}
              />
            ))}
          </View>

          <Animated.View
            style={[pulseStyle]}
            className="w-32 h-32 rounded-full absolute"
          >
            <View
              className="w-full h-full rounded-full"
              style={{ backgroundColor: "rgba(212,255,58,0.15)" }}
            />
          </Animated.View>

          <View className="w-6 h-6 rounded-full bg-[#D4FF3A] border-4 border-black z-10" />
          <Text
            className="text-white mt-4 text-[15px] z-10"
            style={{ fontWeight: "800" }}
          >
            You are here
          </Text>
          <Text
            className="text-white/50 text-[12px] mt-1 z-10"
            style={{ fontWeight: "600" }}
          >
            4 riders in convoy
          </Text>
        </LinearGradient>
      </Animated.View>

      {/* Control row */}
      <View className="mx-4 mt-4 flex-row gap-3">
        <Pressable
          className="flex-1 bg-[#0C0E12] border border-white/8 rounded-full py-4 flex-row items-center justify-center gap-2"
        >
          <Satellite size={18} color="#fff" strokeWidth={2.4} />
          <Text className="text-white text-[13px]" style={{ fontWeight: "800" }}>
            Recenter
          </Text>
        </Pressable>
        <Pressable
          className="w-14 h-14 rounded-full bg-[#0C0E12] border border-white/8 items-center justify-center"
        >
          <Plus size={20} color="#fff" strokeWidth={2.6} />
        </Pressable>
        <Pressable
          className="w-14 h-14 rounded-full bg-[#0C0E12] border border-white/8 items-center justify-center"
        >
          <MoreHorizontal size={20} color="#fff" strokeWidth={2.6} />
        </Pressable>
      </View>

      {/* Stop + Pause */}
      <View className="mx-4 mt-3 flex-row gap-3">
        <Pressable
          className="flex-1 rounded-full py-4 flex-row items-center justify-center gap-2"
          style={{ backgroundColor: "#FF3B30" }}
        >
          <Square size={16} color="#fff" strokeWidth={2.8} />
          <Text className="text-white text-[14px]" style={{ fontWeight: "900" }}>
            Stop
          </Text>
        </Pressable>
        <Pressable
          className="flex-1 rounded-full py-4 flex-row items-center justify-center gap-2"
          style={{ backgroundColor: "#D4FF3A" }}
        >
          <Pause size={16} color="#000" strokeWidth={2.8} />
          <Text className="text-black text-[14px]" style={{ fontWeight: "900" }}>
            Pause
          </Text>
        </Pressable>
      </View>

      {/* Convoy riders */}
      <View className="px-4 mt-8 mb-4 flex-row items-center justify-between">
        <Text
          className="text-white text-[22px]"
          style={{ fontWeight: "900", letterSpacing: -0.6 }}
        >
          Convoy
        </Text>
        <Text
          className="text-white/50 text-[13px]"
          style={{ fontWeight: "700" }}
        >
          {CONVOY_RIDERS.length} riders
        </Text>
      </View>

      <View className="mx-4 flex-row gap-2 flex-wrap">
        {CONVOY_RIDERS.map((r, i) => (
          <Animated.View
            key={r.id}
            entering={FadeInDown.delay(i * 80).duration(400).springify()}
            className="w-[76px] items-center"
          >
            <View
              className="w-16 h-16 rounded-full overflow-hidden border-2"
              style={{
                borderColor: i === 0 ? "#D4FF3A" : "rgba(255,255,255,0.15)",
              }}
            >
              <Image source={{ uri: r.avatar }} className="w-full h-full" />
            </View>
            <Text
              className="text-white text-[11px] mt-2"
              style={{ fontWeight: "700" }}
            >
              {r.name}
            </Text>
            <Text
              className="text-white/50 text-[10px] mt-0.5"
              style={{ fontWeight: "600" }}
            >
              {r.speed} km/h
            </Text>
          </Animated.View>
        ))}
      </View>

      {/* Metrics stack */}
      <View className="mt-8">
        <ColoredStatStack items={TRACK_METRICS} delay={200} />
      </View>
    </ScreenContainer>
  );
}