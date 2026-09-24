import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Phone, MapPin, Radio } from "lucide-react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SAFETY_CONTACTS } from "../constants/mockData";

export default function SOS() {
  const router = useRouter();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.15, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <LinearGradient
      colors={["#1A0000", "#000000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <View className="px-4 pt-12 pb-4">
        <Pressable
          onPress={() => router.back()}
          className="w-11 h-11 rounded-full bg-[#0C0E12] border border-white/10 items-center justify-center"
        >
          <ArrowLeft size={20} color="#fff" strokeWidth={2.6} />
        </Pressable>
      </View>

      <View className="flex-1 items-center px-6">
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          className="items-center mt-12"
        >
          <View className="w-40 h-40 items-center justify-center">
            <Animated.View
              style={[
                pulseStyle,
                {
                  position: "absolute",
                  width: 160,
                  height: 160,
                  borderRadius: 100,
                  backgroundColor: "rgba(255,59,48,0.15)",
                },
              ]}
            />
            <Pressable
              className="w-36 h-36 rounded-full items-center justify-center"
              style={{
                backgroundColor: "#FF3B30",
                shadowColor: "#FF3B30",
                shadowOpacity: 0.9,
                shadowRadius: 40,
                shadowOffset: { width: 0, height: 0 },
                elevation: 20,
              }}
            >
              <Text className="text-white text-[16px]" style={{ fontWeight: "900", letterSpacing: 1.2 }}>
                SOS
              </Text>
              <Text className="text-white/80 text-[10px] mt-1" style={{ fontWeight: "700" }}>
                HOLD
              </Text>
            </Pressable>
          </View>

          <Text
            className="text-white text-[30px] mt-8 text-center"
            style={{ fontWeight: "900", letterSpacing: -1.2 }}
          >
            Emergency SOS
          </Text>
          <Text
            className="text-white/60 text-[14px] text-center mt-2 px-4"
            style={{ fontWeight: "600", lineHeight: 20 }}
          >
            Hold the button to alert your emergency contacts with your live
            location and ride details.
          </Text>
        </Animated.View>

        <View className="w-full mt-12 gap-3">
          <Pressable
            className="rounded-full py-4 flex-row items-center justify-center gap-3"
            style={{ backgroundColor: "#D4FF3A" }}
          >
            <Radio size={18} color="#000" strokeWidth={2.8} />
            <Text className="text-black text-[15px]" style={{ fontWeight: "900" }}>
              Send SOS Alert
            </Text>
          </Pressable>
          <Pressable
            className="rounded-full py-4 flex-row items-center justify-center gap-3 border border-white/15 bg-white/5"
          >
            <MapPin size={18} color="#fff" strokeWidth={2.4} />
            <Text className="text-white text-[15px]" style={{ fontWeight: "800" }}>
              Share Location
            </Text>
          </Pressable>
        </View>

        <View className="w-full mt-10">
          <Text
            className="text-white/50 text-[12px] mb-3"
            style={{ fontWeight: "800", letterSpacing: 1.4 }}
          >
            EMERGENCY CONTACTS
          </Text>
          <View className="bg-[#0C0E12] border border-white/8 rounded-[24px] p-4">
            {SAFETY_CONTACTS.map((c, i) => (
              <View
                key={c.id}
                className={`flex-row items-center gap-3 py-3 ${
                  i < SAFETY_CONTACTS.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                <View className="w-11 h-11 rounded-full bg-white/6 items-center justify-center">
                  <Text style={{ fontSize: 16 }}>👤</Text>
                </View>
                <View className="flex-1">
                  <Text
                    className="text-white text-[15px]"
                    style={{ fontWeight: "800" }}
                  >
                    {c.name}
                  </Text>
                  <Text
                    className="text-white/50 text-[12px] mt-0.5"
                    style={{ fontWeight: "600" }}
                  >
                    {c.phone}
                  </Text>
                </View>
                <Pressable
                  className="w-10 h-10 rounded-full bg-[#00D68F] items-center justify-center"
                >
                  <Phone size={16} color="#000" strokeWidth={2.8} />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}