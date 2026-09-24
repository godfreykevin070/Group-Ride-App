import { View, Text, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Plus, Wrench, Droplet, CircleDot, Cog } from "lucide-react-native";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { BIKES } from "../../constants/mockData";
import { SectionHeader } from "../../components/ui/SectionHeader";

const CHECKLIST = [
  { Icon: Droplet, label: "Engine oil", status: "OK" },
  { Icon: CircleDot, label: "Brake pads", status: "Due in 320 km" },
  { Icon: CircleDot, label: "Tyres", status: "OK" },
  { Icon: Cog, label: "Chain", status: "Lube soon" },
];

export default function Garage() {
  return (
    <ScreenContainer>
      <View className="px-4 pt-3 pb-4 flex-row items-center justify-between">
        <Text
          className="text-white text-[34px] leading-[36px]"
          style={{ fontWeight: "900", letterSpacing: -1.4 }}
        >
          Garage
        </Text>
        <Pressable
          className="w-11 h-11 rounded-full bg-[#D4FF3A] items-center justify-center"
          style={{
            shadowColor: "#D4FF3A",
            shadowOpacity: 0.5,
            shadowRadius: 14,
          }}
        >
          <Plus size={20} color="#000" strokeWidth={3} />
        </Pressable>
      </View>

      {BIKES.map((bike, i) => (
        <Animated.View
          key={bike.id}
          entering={FadeInDown.delay(i * 120).duration(550).springify()}
          className="mx-4 mb-5 rounded-[28px] overflow-hidden border border-white/8"
        >
          <View style={{ height: 200 }}>
            <Image
              source={{ uri: bike.image }}
              style={{ width: "100%", height: "100%" }}
            />
            <LinearGradient
              colors={[
                "rgba(0,0,0,0.1)",
                "rgba(0,0,0,0.55)",
                "rgba(0,0,0,0.95)",
              ]}
              locations={[0, 0.55, 1]}
              style={{
                position: "absolute",
                inset: 0,
                padding: 18,
                justifyContent: "flex-end",
              }}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text
                    className="text-white/50 text-[11px]"
                    style={{ fontWeight: "800", letterSpacing: 1.4 }}
                  >
                    {bike.manufacturer.toUpperCase()}
                  </Text>
                  <Text
                    className="text-white text-[26px] leading-[28px] mt-1"
                    style={{ fontWeight: "900", letterSpacing: -1 }}
                  >
                    {bike.model}
                  </Text>
                  <Text
                    className="text-[#D4FF3A] text-[13px] mt-1"
                    style={{ fontWeight: "800" }}
                  >
                    {bike.nickname}
                  </Text>
                </View>

                <View
                  className="px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: bike.color + "33" }}
                >
                  <Text
                    className="text-[11px]"
                    style={{ color: bike.color, fontWeight: "900" }}
                  >
                    {bike.regNo}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View className="bg-[#0C0E12] flex-row">
            <View className="flex-1 p-4 border-r border-white/5">
              <Text
                className="text-white/50 text-[10px]"
                style={{ fontWeight: "800", letterSpacing: 1 }}
              >
                ODOMETER
              </Text>
              <Text
                className="text-white text-[22px] mt-1"
                style={{ fontWeight: "900", letterSpacing: -0.8 }}
              >
                {bike.odometer.toLocaleString()}
                <Text
                  className="text-white/50 text-[12px]"
                  style={{ fontWeight: "700" }}
                >
                  {" "}
                  km
                </Text>
              </Text>
            </View>
            <View className="flex-1 p-4">
              <Text
                className="text-white/50 text-[10px]"
                style={{ fontWeight: "800", letterSpacing: 1 }}
              >
                NEXT SERVICE
              </Text>
              <Text
                className="text-white text-[22px] mt-1"
                style={{ fontWeight: "900", letterSpacing: -0.8 }}
              >
                {bike.nextService.split(" ").slice(0, 2).join(" ")}
              </Text>
            </View>
          </View>
        </Animated.View>
      ))}

      <SectionHeader title="Maintenance Checklist" />
      <View className="mx-4 bg-[#0C0E12] border border-white/6 rounded-[24px] p-4">
        {CHECKLIST.map((item, i) => (
          <View
            key={item.label}
            className={`flex-row items-center gap-3 py-3.5 ${
              i < CHECKLIST.length - 1 ? "border-b border-white/5" : ""
            }`}
          >
            <View className="w-10 h-10 rounded-full bg-white/6 items-center justify-center">
              <item.Icon size={18} color="#D4FF3A" strokeWidth={2.4} />
            </View>
            <Text
              className="text-white flex-1 text-[15px]"
              style={{ fontWeight: "700" }}
            >
              {item.label}
            </Text>
            <Text
              className="text-white/50 text-[12px]"
              style={{ fontWeight: "600" }}
            >
              {item.status}
            </Text>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}