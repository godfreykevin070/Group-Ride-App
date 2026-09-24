import { View, Text, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Users, Calendar, MapPin, Navigation } from "lucide-react-native";

import { ParallaxHero } from "../../components/ui/ParallaxHero";
import { useScreenScroll } from "../../hooks/useScreenScroll";
import { UPCOMING_RIDES, UPCOMING_RIDE } from "../../constants/mockData";

export default function RideDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const ride = UPCOMING_RIDES.find((r) => r.id === id) ?? UPCOMING_RIDE;

  const { scrollY, scrollHandler } = useScreenScroll();

  return (
    <View className="flex-1 bg-black">
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <ParallaxHero
          image={ride.image}
          eyebrow={`${ride.round} · ${ride.difficulty.toUpperCase()}`}
          title={ride.title}
          subtitle={`${ride.startPoint} → ${ride.city}`}
          scrollY={scrollY}
          onBack={() => router.back()}
          height={400}
          parallaxStrength={0.5}
        />

        {/* Stats row overlapping the hero */}
        <View className="mx-4 -mt-6 flex-row gap-3 z-10">
          <StatBlock label="Distance" value={`${ride.distance}`} unit="km" />
          <StatBlock label="Duration" value={ride.duration} />
          <StatBlock label="Riders" value={`${ride.participants}`} />
        </View>

        {/* Organizer */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(500).springify()}
          className="mx-4 mt-6 flex-row items-center gap-3 bg-[#0C0E12] border border-white/8 rounded-[22px] p-4"
        >
          <View className="w-12 h-12 rounded-full bg-[#D4FF3A]/15 items-center justify-center">
            <Users size={20} color="#D4FF3A" strokeWidth={2.6} />
          </View>
          <View className="flex-1">
            <Text
              className="text-white/50 text-[11px]"
              style={{ fontWeight: "800", letterSpacing: 1 }}
            >
              ORGANIZER
            </Text>
            <Text
              className="text-white text-[16px] mt-0.5"
              style={{ fontWeight: "900" }}
            >
              {ride.organizer}
            </Text>
          </View>
        </Animated.View>

        {/* Date + start */}
        <View className="mx-4 mt-4 bg-[#0C0E12] border border-white/8 rounded-[22px] p-5">
          <Row Icon={Calendar} label="Date" value={ride.date} />
          <View className="h-4" />
          <Row Icon={MapPin} label="Start" value={ride.startPoint} />
        </View>

        {/* Checkpoints */}
        <Text
          className="text-white text-[22px] mx-4 mt-8 mb-3"
          style={{ fontWeight: "900", letterSpacing: -0.6 }}
        >
          Checkpoints
        </Text>
        <View className="mx-4 bg-[#0C0E12] border border-white/6 rounded-[22px] p-4">
          {ride.checkpoints.map((cp, i) => (
            <View
              key={cp}
              className={`flex-row items-center gap-3 py-3 ${
                i < ride.checkpoints.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <View
                className="w-7 h-7 rounded-full items-center justify-center"
                style={{
                  backgroundColor:
                    i === 0 ? "#D4FF3A" : "rgba(255,255,255,0.08)",
                }}
              >
                <Text
                  className="text-[12px]"
                  style={{
                    color: i === 0 ? "#000" : "rgba(255,255,255,0.5)",
                    fontWeight: "900",
                  }}
                >
                  {i + 1}
                </Text>
              </View>
              <Text
                className="text-white flex-1 text-[15px]"
                style={{ fontWeight: "700" }}
              >
                {cp}
              </Text>
            </View>
          ))}
        </View>

        {/* Join button */}
        <View className="mx-4 mt-8">
          <Pressable
            className="rounded-full py-5 flex-row items-center justify-center gap-2"
            style={{
              backgroundColor: "#D4FF3A",
              shadowColor: "#D4FF3A",
              shadowOpacity: 0.5,
              shadowRadius: 20,
              shadowOffset: { width: 0, height: 10 },
            }}
          >
            <Navigation size={18} color="#000" strokeWidth={2.8} />
            <Text
              className="text-black text-[16px]"
              style={{ fontWeight: "900" }}
            >
              Join Ride
            </Text>
          </Pressable>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

function StatBlock({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <View className="flex-1 bg-white rounded-[18px] p-3 mt-3">
      <Text
        className="text-black/50 text-[10px]"
        style={{ fontWeight: "800", letterSpacing: 1 }}
      >
        {label.toUpperCase()}
      </Text>
      <View className="flex-row items-baseline mt-1">
        <Text
          className="text-black text-[22px]"
          style={{ fontWeight: "900", letterSpacing: -0.9 }}
        >
          {value}
        </Text>
        {unit && (
          <Text
            className="text-black/50 text-[11px] ml-1"
            style={{ fontWeight: "700" }}
          >
            {unit}
          </Text>
        )}
      </View>
    </View>
  );
}

function Row({
  Icon,
  label,
  value,
}: {
  Icon: any;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="w-9 h-9 rounded-full bg-white/6 items-center justify-center">
        <Icon size={16} color="#D4FF3A" strokeWidth={2.6} />
      </View>
      <View className="flex-1">
        <Text
          className="text-white/50 text-[11px]"
          style={{ fontWeight: "800", letterSpacing: 1 }}
        >
          {label.toUpperCase()}
        </Text>
        <Text
          className="text-white text-[15px] mt-0.5"
          style={{ fontWeight: "800" }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}