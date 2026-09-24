import { View, Text, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Clock, ChevronRight } from "lucide-react-native";

interface Props {
  eyebrow?: string;
  round?: string;
  title: string;
  city: string;
  date: string;
  countdown?: { days: number; hours: number; minutes: number };
  image?: string;
  onPress?: () => void;
  delay?: number;
}

export function HeroGradientCard({
  eyebrow = "Next ride",
  round,
  title,
  city,
  date,
  countdown,
  image,
  onPress,
  delay = 0,
}: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(600).springify()}
      className="mx-4 rounded-[28px] overflow-hidden"
      style={{
        shadowColor: "#00D68F",
        shadowOpacity: 0.35,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 12,
      }}
    >
      <Pressable onPress={onPress}>
        <View className="relative">
          {/* Background image */}
          {image && (
            <Image
              source={{ uri: image }}
              className="absolute inset-0 w-full h-full"
              resizeMode="cover"
            />
          )}

          {/* Gradient overlay */}
          <LinearGradient
            colors={[
              "rgba(0,0,0,0.1)",
              "rgba(0,20,15,0.7)",
              "rgba(0,20,15,0.98)",
            ]}
            locations={[0, 0.5, 1]}
            style={{
              paddingTop: 140,
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}
          >
            {round && (
              <Text
                className="text-white/60 text-[11px]"
                style={{ fontWeight: "700", letterSpacing: 1.4 }}
              >
                {round}
              </Text>
            )}
            <Text
              className="text-white text-[38px] leading-[42px] mt-1"
              style={{ fontWeight: "900", letterSpacing: -1.2 }}
            >
              {title}
            </Text>
            <Text
              className="text-[#D4FF3A] text-[20px] mt-1"
              style={{ fontWeight: "800", letterSpacing: -0.4 }}
            >
              {city}
            </Text>
            <Text
              className="text-white/70 text-[15px] mt-1"
              style={{ fontWeight: "600" }}
            >
              {date}
            </Text>

            {countdown && (
              <View className="mt-5">
                <Text
                  className="text-white/60 text-[11px]"
                  style={{ fontWeight: "700", letterSpacing: 1.2 }}
                >
                  {eyebrow.toUpperCase()}
                </Text>
                <View className="flex-row items-end gap-3 mt-2">
                  <CountUnit value={countdown.days} label="Days" />
                  <CountUnit value={countdown.hours} label="Hours" />
                  <CountUnit value={countdown.minutes} label="Minutes" />
                </View>
              </View>
            )}

            <Pressable
              onPress={onPress}
              className="self-end mt-5 flex-row items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2.5"
            >
              <Clock size={15} color="#fff" strokeWidth={2.6} />
              <Text
                className="text-white text-[13px]"
                style={{ fontWeight: "700" }}
              >
                View ride
              </Text>
              <ChevronRight size={14} color="#fff" strokeWidth={2.6} />
            </Pressable>
          </LinearGradient>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <View>
      <Text
        className="text-[#D4FF3A] text-[36px] leading-[38px]"
        style={{
          fontWeight: "900",
          letterSpacing: -1.5,
          fontVariant: ["tabular-nums"],
        }}
      >
        {String(value).padStart(2, "0")}
      </Text>
      <Text
        className="text-white/50 text-[10px] mt-0.5"
        style={{ fontWeight: "700", letterSpacing: 0.6 }}
      >
        {label}
      </Text>
    </View>
  );
}