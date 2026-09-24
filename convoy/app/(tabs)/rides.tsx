import { useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ChevronRight } from "lucide-react-native";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { SplitToggle } from "../../components/ui/SplitToggle";
import { MetricDisplay } from "../../components/ui/MetricDisplay";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { RECENT_RIDES, UPCOMING_RIDES } from "../../constants/mockData";

export default function Rides() {
  const [tab, setTab] = useState(0);

  return (
    <ScreenContainer>
      <View className="px-4 pt-3 pb-4">
        <Text
          className="text-white text-[34px] leading-[36px]"
          style={{ fontWeight: "900", letterSpacing: -1.4 }}
        >
          Rides
        </Text>
      </View>

      <SplitToggle
        options={["Upcoming", "Completed"]}
        value={tab}
        onChange={setTab}
      />

      {tab === 0 ? (
        <>
          <View className="mt-8">
            {UPCOMING_RIDES.map((ride, i) => (
              <Animated.View
                key={ride.id}
                entering={FadeInDown.delay(i * 100).duration(500).springify()}
                className="mx-4 mb-4 rounded-[24px] overflow-hidden border border-white/8"
              >
                <View style={{ height: 160 }}>
                  <Image
                    source={{ uri: ride.image }}
                    style={{ width: "100%", height: "100%" }}
                  />
                  <LinearGradient
                    colors={[
                      "rgba(0,0,0,0.1)",
                      "rgba(0,0,0,0.6)",
                      "rgba(0,0,0,0.95)",
                    ]}
                    locations={[0, 0.5, 1]}
                    style={{
                      position: "absolute",
                      inset: 0,
                      padding: 16,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Text
                      className="text-white/50 text-[11px]"
                      style={{ fontWeight: "800", letterSpacing: 1.2 }}
                    >
                      {ride.round} · {ride.startPoint}
                    </Text>
                    <Text
                      className="text-white text-[22px] leading-[24px] mt-1"
                      style={{ fontWeight: "900", letterSpacing: -0.8 }}
                    >
                      {ride.title}
                    </Text>
                    <View className="flex-row items-center gap-4 mt-2">
                      <Text
                        className="text-white/70 text-[12px]"
                        style={{ fontWeight: "700" }}
                      >
                        {ride.date}
                      </Text>
                      <Text
                        className="text-white/70 text-[12px]"
                        style={{ fontWeight: "700" }}
                      >
                        {ride.distance} km
                      </Text>
                      <Text
                        className="text-[#D4FF3A] text-[12px]"
                        style={{ fontWeight: "800" }}
                      >
                        {ride.participants} riders
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              </Animated.View>
            ))}
          </View>

          <MetricDisplay
            eyebrow="Next departure"
            value="12D 08H"
            caption="Until Coorg Coffee Trail"
            delay={400}
          />
        </>
      ) : (
        <>
          <MetricDisplay
            eyebrow="Total completed"
            value="47 RIDES"
            caption="Across 3,240 km"
            delay={100}
          />
          <MetricDisplay
            eyebrow="Race lap record"
            value="1:43.009"
            caption="Yercaud Hill Climb"
            delay={200}
          />

          <SectionHeader title="Recent" />
          {RECENT_RIDES.map((ride, i) => (
            <Animated.View
              key={ride.id}
              entering={FadeInDown.delay(300 + i * 80).duration(500).springify()}
              className="mx-4 mb-3 rounded-[20px] overflow-hidden border border-white/8"
            >
              <View className="flex-row h-[100px]">
                <Image
                  source={{ uri: ride.image }}
                  style={{ width: 100, height: "100%" }}
                />
                <View className="flex-1 bg-[#0C0E12] px-4 justify-center">
                  <Text
                    className="text-white text-[16px]"
                    style={{ fontWeight: "900", letterSpacing: -0.4 }}
                  >
                    {ride.title}
                  </Text>
                  <Text
                    className="text-white/50 text-[11px] mt-1"
                    style={{ fontWeight: "600" }}
                  >
                    {ride.date}
                  </Text>
                  <View className="flex-row items-center gap-3 mt-2">
                    <Text
                      className="text-white text-[14px]"
                      style={{ fontWeight: "900" }}
                    >
                      {ride.distance}
                      <Text
                        className="text-white/50 text-[11px]"
                        style={{ fontWeight: "600" }}
                      >
                        {" "}
                        km
                      </Text>
                    </Text>
                    <Text
                      className="text-white text-[14px]"
                      style={{ fontWeight: "900" }}
                    >
                      {ride.duration}
                    </Text>
                  </View>
                </View>
                <View className="justify-center pr-4">
                  <View
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: ride.color }}
                  />
                </View>
              </View>
            </Animated.View>
          ))}
        </>
      )}
    </ScreenContainer>
  );
}