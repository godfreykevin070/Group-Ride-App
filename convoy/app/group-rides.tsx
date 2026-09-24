import { View, Text, Pressable, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Users, Plus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { GROUP_RIDES } from "../constants/mockData";

export default function GroupRides() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View className="px-4 pt-12 pb-4 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="w-11 h-11 rounded-full bg-[#0C0E12] border border-white/10 items-center justify-center"
          >
            <ArrowLeft size={20} color="#fff" strokeWidth={2.6} />
          </Pressable>
          <Text
            className="text-white text-[15px]"
            style={{ fontWeight: "800" }}
          >
            Group Rides
          </Text>
          <Pressable className="w-11 h-11 rounded-full bg-[#D4FF3A] items-center justify-center">
            <Plus size={20} color="#000" strokeWidth={3} />
          </Pressable>
        </View>

        {/* Create card */}
        <Animated.View
          entering={FadeInDown.duration(500).springify()}
          className="mx-4 rounded-[28px] overflow-hidden border border-white/8"
        >
          <LinearGradient
            colors={["#00D68F", "#004D3D", "#000"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 22 }}
          >
            <Users size={32} color="#fff" strokeWidth={2.4} />
            <Text
              className="text-white text-[28px] leading-[30px] mt-4"
              style={{ fontWeight: "900", letterSpacing: -1 }}
            >
              Create a ride
            </Text>
            <Text
              className="text-white/70 text-[14px] mt-2"
              style={{ fontWeight: "600" }}
            >
              Set destination, invite riders, everyone tracks live.
            </Text>
            <Pressable
              className="self-start mt-5 bg-white rounded-full px-5 py-3"
            >
              <Text
                className="text-black text-[14px]"
                style={{ fontWeight: "900" }}
              >
                Get started
              </Text>
            </Pressable>
          </LinearGradient>
        </Animated.View>

        <Text
          className="text-white text-[22px] mx-4 mt-10 mb-3"
          style={{ fontWeight: "900", letterSpacing: -0.6 }}
        >
          Discover
        </Text>

        {GROUP_RIDES.map((ride, i) => (
          <Animated.View
            key={ride.id}
            entering={FadeInDown.delay(i * 120).duration(500).springify()}
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
                  "rgba(0,0,0,0.7)",
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
                  className="text-white text-[22px] leading-[24px]"
                  style={{ fontWeight: "900", letterSpacing: -0.8 }}
                >
                  {ride.title}
                </Text>
                <View className="flex-row items-center justify-between mt-2">
                  <Text
                    className="text-white/70 text-[12px]"
                    style={{ fontWeight: "700" }}
                  >
                    {ride.date} · {ride.distance} km
                  </Text>
                  <Text
                    className="text-[#D4FF3A] text-[12px]"
                    style={{ fontWeight: "900" }}
                  >
                    {ride.riders}/{ride.max} joined
                  </Text>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}