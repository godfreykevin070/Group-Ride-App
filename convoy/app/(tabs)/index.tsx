import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { TrendingUp, Zap } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { PillHeader } from "../../components/ui/PillHeader";
import { HeroGradientCard } from "../../components/ui/HeroGradientCard";
import { ColoredStatStack } from "../../components/ui/ColoredStatStack";
import { RoundProgress } from "../../components/ui/RoundProgress";
import { NeonCTA } from "../../components/ui/NeonCTA";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { Bike3D } from "../../components/ui/Bike3D";
import { StarGlassBar } from "../../components/ui/StarGlassBar";
import { useScreenScroll } from "../../hooks/useScreenScroll";
import {
  ACTIVE_BIKE,
  NEARBY_RIDERS,
  RIDE_METRICS,
  RIDE_PROGRESS,
  RIDER_STATS,
  UPCOMING_RIDE,
  USER,
} from "../../constants/mockData";

export default function Home() {
  const router = useRouter();
  const { scrollY, scrollHandler } = useScreenScroll();

  const bikeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [0, 200], [0, -30], "clamp") },
      { scale: interpolate(scrollY.value, [0, 200], [1, 0.9], "clamp") },
    ],
  }));

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-black">
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <PillHeader
          title="Convoy Pro"
          subtitle="Next ride in 12h 8m"
          variant="emerald"
          avatarUri={USER.avatar}
        />

        {/* Bike hero card */}
        <Animated.View
          entering={undefined}
          className="mx-4 mb-6 rounded-[28px] overflow-hidden border border-white/8 relative"
          style={{ height: 200 }}
        >
          <LinearGradient
            colors={["#0F2818", "#000000"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, flexDirection: "row" }}
          >
            <View className="flex-1 justify-center px-5">
              <Text
                className="text-white/50 text-[11px]"
                style={{ fontWeight: "800", letterSpacing: 1.4 }}
              >
                YOUR RIDE
              </Text>
              <Text
                className="text-white text-[26px] leading-[28px] mt-2"
                style={{ fontWeight: "900", letterSpacing: -1 }}
              >
                {ACTIVE_BIKE.manufacturer}
              </Text>
              <Text
                className="text-white text-[22px] leading-[24px]"
                style={{ fontWeight: "800", letterSpacing: -0.6 }}
              >
                {ACTIVE_BIKE.model}
              </Text>
              <View className="flex-row items-center gap-2 mt-3">
                <View
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: ACTIVE_BIKE.color }}
                />
                <Text
                  className="text-white/60 text-[12px]"
                  style={{ fontWeight: "700" }}
                >
                  {ACTIVE_BIKE.nickname}
                </Text>
              </View>
            </View>

            <Animated.View style={bikeStyle} className="justify-center">
              <Bike3D
                image={ACTIVE_BIKE.image}
                color={ACTIVE_BIKE.color}
                size={160}
              />
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* Quick stats grid */}
        <View className="mx-4 flex-row gap-3 mb-6">
          <View className="flex-1 bg-white rounded-[22px] p-4">
            <Text
              className="text-black text-[11px]"
              style={{ fontWeight: "800", letterSpacing: 1 }}
            >
              TOTAL RIDES
            </Text>
            <Text
              className="text-black text-[44px] leading-[46px] mt-2"
              style={{ fontWeight: "900", letterSpacing: -2 }}
            >
              {RIDER_STATS.totalRides}
            </Text>
          </View>

          <View
            className="flex-1 bg-[#D4FF3A] rounded-[22px] p-4"
            style={{
              shadowColor: "#D4FF3A",
              shadowOpacity: 0.4,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 8 },
            }}
          >
            <Text
              className="text-black/70 text-[11px]"
              style={{ fontWeight: "800", letterSpacing: 1 }}
            >
              DISTANCE
            </Text>
            <View className="flex-row items-baseline mt-2">
              <Text
                className="text-black text-[44px] leading-[46px]"
                style={{ fontWeight: "900", letterSpacing: -2 }}
              >
                3240
              </Text>
              <Text
                className="text-black/70 text-[13px] ml-1"
                style={{ fontWeight: "800" }}
              >
                km
              </Text>
            </View>
          </View>
        </View>

        <SectionHeader title="Season Progress" />
        <RoundProgress
          percent={RIDE_PROGRESS.percent}
          right={[
            {
              label: "Rides Completed",
              value: `${RIDE_PROGRESS.completed}/${RIDE_PROGRESS.total}`,
            },
            { label: "KM Covered", value: `${RIDE_PROGRESS.kmCovered}` },
            { label: "Checkpoints", value: `${RIDE_PROGRESS.lapsCompleted}` },
          ]}
        />

        <SectionHeader title="Upcoming Ride" action="View all" />
        <HeroGradientCard
          round={`Round ${UPCOMING_RIDE.round.replace("R", "")}`}
          title={UPCOMING_RIDE.title}
          city={UPCOMING_RIDE.city}
          date={UPCOMING_RIDE.date}
          countdown={UPCOMING_RIDE.countdown}
          image={UPCOMING_RIDE.image}
          onPress={() => router.push(`/ride/${UPCOMING_RIDE.id}`)}
        />

        <View className="mt-6">
          <NeonCTA
            title="Start Live Ride"
            subtitle="Track your convoy in real time, share location with riders, and log every checkpoint automatically."
            ctaText="Start now"
            onPress={() => router.push("/track")}
          />
        </View>

        <SectionHeader title="This Ride" />
        <ColoredStatStack
          header={{ left: "ROUND 15", right: UPCOMING_RIDE.city }}
          items={RIDE_METRICS}
        />

        <SectionHeader title="Riders Nearby" action="Open map" />
        <View className="mx-4 bg-[#0C0E12] border border-white/6 rounded-[24px] p-4">
          {NEARBY_RIDERS.map((r, i) => (
            <View
              key={r.id}
              className={`flex-row items-center gap-3 py-3 ${
                i < NEARBY_RIDERS.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <Image
                source={{ uri: r.avatar }}
                className="w-11 h-11 rounded-full"
              />
              <View className="flex-1">
                <Text
                  className="text-white text-[15px]"
                  style={{ fontWeight: "800" }}
                >
                  {r.name}
                </Text>
                <Text
                  className="text-white/50 text-[12px] mt-0.5"
                  style={{ fontWeight: "600" }}
                >
                  {r.distance} away
                </Text>
              </View>
              <View
                className="px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor:
                    r.status === "riding"
                      ? "rgba(0,214,143,0.15)"
                      : "rgba(255,255,255,0.06)",
                }}
              >
                <Text
                  className="text-[10px]"
                  style={{
                    color:
                      r.status === "riding"
                        ? "#00D68F"
                        : "rgba(255,255,255,0.6)",
                    fontWeight: "800",
                    letterSpacing: 0.8,
                  }}
                >
                  {r.status === "riding" ? "RIDING" : "IDLE"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <StarGlassBar />

        <View className="mt-6">
          <NeonCTA
            title="Invite riders"
            subtitle="Scan a friend's QR code to add them to your convoy instantly."
            ctaText="Invite now"
            variant="lime"
            onPress={() => router.push("/invite")}
          />
        </View>

        <SectionHeader title="Fuel & Cost" />
        <View className="mx-4 bg-[#0C0E12] border border-white/6 rounded-[24px] p-5 flex-row items-center">
          <View className="flex-1">
            <Text
              className="text-white/50 text-[12px]"
              style={{ fontWeight: "800", letterSpacing: 1 }}
            >
              MONTHLY FUEL
            </Text>
            <Text
              className="text-white text-[40px] leading-[42px] mt-1"
              style={{ fontWeight: "900", letterSpacing: -1.8 }}
            >
              ₹3,200
            </Text>
            <View className="flex-row items-center gap-1 mt-2">
              <TrendingUp size={14} color="#00D68F" strokeWidth={2.6} />
              <Text
                className="text-[#00D68F] text-[13px]"
                style={{ fontWeight: "800" }}
              >
                +12% vs last month
              </Text>
            </View>
          </View>
          <View
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(255,107,53,0.18)" }}
          >
            <Zap size={26} color="#FF6B35" strokeWidth={2.6} />
          </View>
        </View>

        <View className="h-12" />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}