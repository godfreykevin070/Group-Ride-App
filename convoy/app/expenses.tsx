import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Plus } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { EXPENSES, EXPENSE_SUMMARY } from "../constants/mockData";
import { MetricDisplay } from "../components/ui/MetricDisplay";

export default function Expenses() {
  const router = useRouter();
  const total = EXPENSES.reduce((s, e) => s + e.amount, 0);

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
            Expenses
          </Text>
          <Pressable className="w-11 h-11 rounded-full bg-[#D4FF3A] items-center justify-center">
            <Plus size={20} color="#000" strokeWidth={3} />
          </Pressable>
        </View>

        <View className="mx-4 rounded-[28px] p-6" style={{ backgroundColor: "#00D68F" }}>
          <Text
            className="text-black/70 text-[12px]"
            style={{ fontWeight: "800", letterSpacing: 1.4 }}
          >
            THIS MONTH
          </Text>
          <Text
            className="text-black text-[52px] leading-[54px] mt-2"
            style={{ fontWeight: "900", letterSpacing: -2.2 }}
          >
            ₹{EXPENSE_SUMMARY.thisMonth.toLocaleString()}
          </Text>
        </View>

        <View className="mx-4 mt-4 flex-row gap-3">
          <View className="flex-1 bg-white rounded-[20px] p-4">
            <Text
              className="text-black/60 text-[10px]"
              style={{ fontWeight: "800", letterSpacing: 1 }}
            >
              FUEL
            </Text>
            <Text
              className="text-black text-[26px] mt-1"
              style={{ fontWeight: "900", letterSpacing: -1 }}
            >
              ₹{EXPENSE_SUMMARY.fuel}
            </Text>
          </View>
          <View className="flex-1 bg-[#4A6CF7] rounded-[20px] p-4">
            <Text
              className="text-white/70 text-[10px]"
              style={{ fontWeight: "800", letterSpacing: 1 }}
            >
              FOOD
            </Text>
            <Text
              className="text-white text-[26px] mt-1"
              style={{ fontWeight: "900", letterSpacing: -1 }}
            >
              ₹{EXPENSE_SUMMARY.food}
            </Text>
          </View>
        </View>

        <View className="mx-4 mt-3 flex-row gap-3">
          <View className="flex-1 bg-[#FF6B35] rounded-[20px] p-4">
            <Text
              className="text-white/70 text-[10px]"
              style={{ fontWeight: "800", letterSpacing: 1 }}
            >
              TOLL
            </Text>
            <Text
              className="text-white text-[26px] mt-1"
              style={{ fontWeight: "900", letterSpacing: -1 }}
            >
              ₹{EXPENSE_SUMMARY.toll}
            </Text>
          </View>
          <View className="flex-1 bg-[#8B5CF6] rounded-[20px] p-4">
            <Text
              className="text-white/70 text-[10px]"
              style={{ fontWeight: "800", letterSpacing: 1 }}
            >
              MAINTENANCE
            </Text>
            <Text
              className="text-white text-[22px] mt-1"
              style={{ fontWeight: "900", letterSpacing: -0.8 }}
            >
              ₹{EXPENSE_SUMMARY.maintenance}
            </Text>
          </View>
        </View>

        <Text
          className="text-white text-[22px] mx-4 mt-10 mb-3"
          style={{ fontWeight: "900", letterSpacing: -0.6 }}
        >
          Recent
        </Text>

        <View className="mx-4 bg-[#0C0E12] border border-white/6 rounded-[24px] overflow-hidden">
          {EXPENSES.map((e, i) => (
            <Animated.View
              key={e.id}
              entering={FadeInDown.delay(i * 60).duration(400)}
              className={`flex-row items-center gap-3 px-4 py-4 ${
                i < EXPENSES.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <View
                className="w-11 h-11 rounded-full items-center justify-center"
                style={{ backgroundColor: e.color + "22" }}
              >
                <View
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: e.color }}
                />
              </View>
              <View className="flex-1">
                <Text
                  className="text-white text-[15px]"
                  style={{ fontWeight: "800" }}
                >
                  {e.category}
                </Text>
                <Text
                  className="text-white/50 text-[12px] mt-0.5"
                  style={{ fontWeight: "600" }}
                >
                  {e.note}
                </Text>
              </View>
              <View className="items-end">
                <Text
                  className="text-white text-[16px]"
                  style={{ fontWeight: "900" }}
                >
                  ₹{e.amount}
                </Text>
                <Text
                  className="text-white/40 text-[11px] mt-0.5"
                  style={{ fontWeight: "600" }}
                >
                  {e.date}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <MetricDisplay
          eyebrow="Total spending"
          value={`₹${total.toLocaleString()}`}
          caption="Across all categories this month"
          delay={400}
        />
      </ScrollView>
    </View>
  );
}