import { View, Text, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  ChevronRight,
  Flame,
  TrendingUp,
  Clock,
  Award,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react-native";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { RIDER_STATS, USER } from "../../constants/mockData";

const MENU = [
  { Icon: Award, label: "My achievements" },
  { Icon: TrendingUp, label: "Riding statistics" },
  { Icon: Clock, label: "Ride history" },
  { Icon: Settings, label: "Settings" },
  { Icon: HelpCircle, label: "Help & support" },
  { Icon: LogOut, label: "Sign out" },
];

export default function Profile() {
  return (
    <ScreenContainer>
      {/* Page heading */}
      <View className="px-4 pt-3 pb-4">
        <Text
          className="text-white text-[34px] leading-[36px] mt-1"
          style={{ fontWeight: "900", letterSpacing: -1.4 }}
        >
          Profile
        </Text>
      </View>
      
      {/* Split hero: text left, face right, black gradient over the photo */}
      <Animated.View
        entering={FadeInDown.duration(500).springify()}
        className="mx-4 rounded-[28px] overflow-hidden border border-white/8"
        style={{ height: 200 }}
      >
        <View className="flex-1 relative">
          {/* Photo on the right ~55% */}
          <View
            className="absolute right-0 top-0 bottom-0"
            style={{ width: "55%" }}
          >
            <Image
              source={{ uri: USER.avatar }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
            {/* Black gradient fading from left → right */}
            <LinearGradient
              colors={[
                "#000000",
                "transparent",
                "transparent",
                "transparent",
              ]}
              locations={[0, 0.35, 0.7, 1]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          </View>

          {/* Solid black base on the left */}
          <LinearGradient
            colors={["#0C0E12", "transparent", "transparent"]}
            locations={[0, 0.6, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            pointerEvents="none"
          />

          {/* Text content on the left */}
          <View className="flex-1 justify-center pl-5 pr-[60%] z-10">
            <Text
              className="text-white/50 text-[11px]"
              style={{ fontWeight: "800", letterSpacing: 1.4 }}
            >
              RIDER
            </Text>
            <Text
              className="text-white text-[26px] leading-[28px] mt-2"
              style={{ fontWeight: "900", letterSpacing: -1 }}
            >
              {USER.name}
            </Text>
            <Text
              className="text-white/60 text-[13px] mt-1"
              style={{ fontWeight: "600" }}
            >
              {USER.handle}
            </Text>
            <View className="flex-row items-center gap-1.5 mt-3 self-start bg-[#D4FF3A]/15 rounded-full px-2.5 py-1">
              <Flame size={12} color="#D4FF3A" strokeWidth={2.6} />
              <Text
                className="text-[#D4FF3A] text-[11px]"
                style={{ fontWeight: "900", letterSpacing: 0.6 }}
              >
                {USER.level}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Big stat blocks */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(500).springify()}
        className="mx-4 mt-6 pb-6 border-b border-white/8"
      >
        <Text
          className="text-white/50 text-[13px]"
          style={{ fontWeight: "800", letterSpacing: 1 }}
        >
          LIFETIME DISTANCE
        </Text>
        <Text
          className="text-white text-[52px] leading-[56px] mt-2"
          style={{ fontWeight: "900", letterSpacing: -2 }}
        >
          3,240 KM
        </Text>
        <Text
          className="text-white/70 text-[15px] mt-1"
          style={{ fontWeight: "600" }}
        >
          Across 47 rides in 12 months
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(180).duration(500).springify()}
        className="mx-4 mt-6 pb-6 border-b border-white/8"
      >
        <Text
          className="text-white/50 text-[13px]"
          style={{ fontWeight: "800", letterSpacing: 1 }}
        >
          AVERAGE SPEED
        </Text>
        <Text
          className="text-white text-[52px] leading-[56px] mt-2"
          style={{ fontWeight: "900", letterSpacing: -2 }}
        >
          42 km/h
        </Text>
        <Text
          className="text-white/70 text-[15px] mt-1"
          style={{ fontWeight: "600" }}
        >
          Max speed {RIDER_STATS.maxSpeed} km/h
        </Text>
      </Animated.View>

      {/* Small stat grid */}
      <View className="mx-4 mt-6 flex-row gap-3">
        <View className="flex-1 bg-white rounded-[22px] p-4">
          <Text
            className="text-black/60 text-[10px]"
            style={{ fontWeight: "800", letterSpacing: 1 }}
          >
            STREAK
          </Text>
          <Text
            className="text-black text-[32px] leading-[34px] mt-1"
            style={{ fontWeight: "900", letterSpacing: -1.4 }}
          >
            {RIDER_STATS.streakDays}d
          </Text>
        </View>
        <View className="flex-1 bg-[#00D68F] rounded-[22px] p-4">
          <Text
            className="text-black/70 text-[10px]"
            style={{ fontWeight: "800", letterSpacing: 1 }}
          >
            RIDING TIME
          </Text>
          <Text
            className="text-black text-[26px] leading-[28px] mt-1"
            style={{ fontWeight: "900", letterSpacing: -1 }}
          >
            {RIDER_STATS.ridingTime}
          </Text>
        </View>
      </View>

      {/* Menu */}
      <View className="mx-4 mt-8 bg-[#0C0E12] border border-white/6 rounded-[24px] overflow-hidden">
        {MENU.map((item, i) => (
          <Pressable
            key={item.label}
            className={`flex-row items-center gap-3 px-4 py-4 ${
              i < MENU.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            <View className="w-9 h-9 rounded-full bg-white/6 items-center justify-center">
              <item.Icon size={17} color="#fff" strokeWidth={2.4} />
            </View>
            <Text
              className="text-white flex-1 text-[15px]"
              style={{ fontWeight: "700" }}
            >
              {item.label}
            </Text>
            <ChevronRight
              size={18}
              color="rgba(255,255,255,0.3)"
              strokeWidth={2.4}
            />
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}