import { useState, useRef } from "react";
import { View, Text, Pressable, ScrollView, Linking, Share, Vibration, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../src/context/AppContext";
import { Icon } from "../src/components/ui/Icon";

export default function SOS() {
  const router = useRouter();
  const { state, addSosContact } = useApp();
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHold = () => {
    let count = 3;
    setHoldProgress(count);
    holdTimer.current = setInterval(() => {
      count -= 1;
      setHoldProgress(count);
      if (count <= 0) {
        clearInterval(holdTimer.current!);
        holdTimer.current = null;
        trigger("hold");
      }
    }, 1000);
  };

  const cancelHold = () => {
    if (holdTimer.current) {
      clearInterval(holdTimer.current);
      holdTimer.current = null;
    }
    setHoldProgress(0);
  };

  const trigger = async (kind: "alert" | "location" | "hold" | "call") => {
    if (kind === "call") {
      Linking.openURL("tel:112");
      return;
    }
    if (!state.sosContacts.length) return addSosContact({ name: "Emergency", phone: "112" });
    const msg = `EMERGENCY from ${state.user?.name ?? "Someone"}.`;
    if (kind === "alert") {
      await Share.share({ message: msg }).catch(() => {});
    } else if (kind === "hold") {
      Vibration.vibrate([200, 100, 200, 100, 200]);
      Alert.alert("SOS Triggered", "Your contacts have been notified.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#1a0810]" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <View className="flex-row items-center gap-4 mb-6">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface border border-white/8 items-center justify-center">
            <Icon name="x" size={20} />
          </Pressable>
          <Text className="text-white text-[15px] font-extrabold">Emergency</Text>
        </View>

        <View className="items-center pt-10">
          <Pressable
            onPressIn={startHold}
            onPressOut={cancelHold}
            className="w-40 h-40 rounded-full items-center justify-center"
            style={{ backgroundColor: "#FF5C7A", shadowColor: "#FF5C7A", shadowOpacity: 0.6, shadowRadius: 30, shadowOffset: { width: 0, height: 0 } }}
          >
            <Text className="text-[44px] mb-1">🚨</Text>
            <Text className="text-white text-[13px] font-black tracking-widest">SOS</Text>
            <Text className="text-white/75 text-[9px] font-bold tracking-widest mt-0.5">
              {holdProgress > 0 ? `HOLD ${holdProgress}…` : "HOLD 3s"}
            </Text>
          </Pressable>
          <Text className="text-white text-[26px] font-black tracking-tight mt-8 text-center">Emergency SOS</Text>
          <Text className="text-white/60 text-[13px] font-medium mt-2.5 text-center px-8 leading-5">Hold the button to alert your emergency contacts with your live location.</Text>
        </View>

        <View className="gap-2.5 mt-10">
          <ActionBtn label="Send SOS alert" icon="radio" variant="primary" onPress={() => trigger("alert")} />
          <ActionBtn label="Share live location" icon="pin" onPress={() => trigger("location")} />
          <ActionBtn label="Call emergency services" icon="phone" onPress={() => trigger("call")} />
        </View>

        <View className="mt-8 bg-surface border border-white/8 rounded-[20px] p-4">
          <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mb-3">Emergency contacts</Text>
          {state.sosContacts.length === 0 ? (
            <View className="items-center py-5">
              <Text className="text-white/35 text-[13px]">No contacts yet.</Text>
              <Pressable onPress={() => Alert.prompt?.("Contact name", undefined, [{ text: "Cancel" }, { text: "Add", onPress: (name?: string) => name && addSosContact({ name, phone: "112" }) }])} className="mt-3 bg-surface-2 rounded-[14px] px-4 py-3 flex-row items-center gap-2">
                <Icon name="userPlus" size={16} />
                <Text className="text-white text-[13px] font-extrabold">Add contact</Text>
              </Pressable>
            </View>
          ) : (
            state.sosContacts.map((c) => (
              <View key={c.id} className="flex-row items-center gap-3 py-2.5 border-b border-white/4 last:border-b-0">
                <View className="w-10 h-10 rounded-full bg-surface-2 items-center justify-center">
                  <Text className="text-[15px] font-black">{c.name[0]}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white text-[13px] font-bold">{c.name}</Text>
                  <Text className="text-white/35 text-[11px] mt-0.5">{c.phone}</Text>
                </View>
                <Pressable onPress={() => Linking.openURL(`tel:${c.phone}`)} className="w-9 h-9 rounded-full bg-mint items-center justify-center">
                  <Icon name="phone" size={15} color="#0B0E15" strokeWidth={2.6} />
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionBtn({ label, icon, onPress, variant = "default" }: any) {
  const bg = variant === "primary" ? "#FF5C7A" : "#151A23";
  return (
    <Pressable onPress={onPress} style={{ backgroundColor: bg }} className="py-4 rounded-[14px] items-center justify-center flex-row gap-2.5 border border-white/8">
      <Icon name={icon} size={18} color="#fff" strokeWidth={2.4} />
      <Text className="text-white text-[14px] font-extrabold">{label}</Text>
    </Pressable>
  );
}