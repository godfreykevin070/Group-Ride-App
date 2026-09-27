import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../src/context/AppContext";
import { Icon } from "../../src/components/ui/Icon";
import { shareRideJournal } from "../../src/lib/share";

export default function RideJournal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state } = useApp();
  const ride = state.rides.find((r) => r.id === id);

  // ✅ Only bail if the RIDE is missing — activeRideId being null is fine
  if (!ride) {
    return (
      <SafeAreaView className="flex-1 bg-bg items-center justify-center" edges={["top"]}>
        <Text className="text-white/60 text-[14px]">Journal not found</Text>
        <Pressable onPress={() => router.replace("/(tabs)/rides")} className="mt-4 bg-primary rounded-full px-5 py-3">
          <Text className="text-white font-extrabold">Back to rides</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const journal = ride.journal || [];
  const startedAt = ride.startedAt ? new Date(ride.startedAt) : new Date(ride.date);
  const endedAt = ride.endedAt ? new Date(ride.endedAt) : null;
  const duration = endedAt ? Math.round((endedAt.getTime() - startedAt.getTime()) / 60000) : null;

  const share = (p: "whatsapp" | "twitter" | "instagram" | "native") =>
    shareRideJournal(ride.title, ride.distance, ride.riders.length, journal.length, p);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View className="flex-row items-center gap-3 px-4 py-3">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface border border-white/8 items-center justify-center">
            <Icon name="back" size={20} />
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase">Ride journal</Text>
            <Text className="text-white text-[15px] font-extrabold mt-0.5">{ride.title}</Text>
          </View>
          <Pressable onPress={() => share("native")} className="w-10 h-10 rounded-full bg-surface border border-white/8 items-center justify-center">
            <Icon name="share" size={18} />
          </Pressable>
        </View>

        <View className="mx-5 rounded-[26px] overflow-hidden" style={{ height: 180, backgroundColor: "#1D242F" }}>
          <Image source={{ uri: ride.cover }} style={{ width: "100%", height: "100%" }} />
          <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(11,14,21,0.5)" }} />
          <View style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
            <Text className="text-primary text-[10px] font-black tracking-widest uppercase">
              {startedAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </Text>
            <Text className="text-white text-[20px] font-black tracking-tight mt-1">{ride.title}</Text>
          </View>
        </View>

        <View className="flex-row gap-2.5 px-5 pt-4">
          <Box label="Distance" value={`${ride.distance}`} unit="km" />
          <Box label="Duration" value={duration ? `${Math.floor(duration / 60)}h ${duration % 60}m` : "--"} />
          <Box label="Riders" value={`${ride.riders.length}`} />
        </View>

        {journal.length === 0 ? (
          <View className="items-center px-10 py-16">
            <View className="w-20 h-20 rounded-full bg-surface border border-white/8 items-center justify-center mb-5">
              <Icon name="camera" size={32} color="rgba(240,243,248,0.35)" />
            </View>
            <Text className="text-white text-[18px] font-extrabold">No captures yet</Text>
            <Text className="text-white/60 text-[13px] mt-2 text-center leading-5">Photos and videos taken at checkpoints during the ride appear here.</Text>
          </View>
        ) : (
          <>
            <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mx-5 mt-7 mb-3">Moments ({journal.length})</Text>
            <View className="flex-row flex-wrap gap-2.5 px-5">
              {journal.map((j) => (
                <View key={j.id} className="rounded-[16px] overflow-hidden relative" style={{ width: "48%", aspectRatio: 1, backgroundColor: "#1D242F" }}>
                  {j.data ? <Image source={{ uri: j.data }} style={{ width: "100%", height: "100%" }} /> : null}
                  <View style={{ position: "absolute", top: 8, left: 8, backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                    <Text className="text-amber text-[9px] font-black tracking-wider uppercase">{j.checkpointName}</Text>
                  </View>
                  {j.type === "video" && (
                    <View style={{ position: "absolute", top: 8, right: 8, width: 24, height: 24, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.7)", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="play" size={12} color="#fff" strokeWidth={2.8} />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mx-5 mt-7 mb-3">Timeline</Text>
        <View className="px-5">
          <TimelineItem color="#7CE5B0" textColor="#0B0E15" label="A" title={ride.from.name} sub={`Started at ${startedAt.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}`} />
          {ride.checkpoints.map((cp, i) => {
            const captures = journal.filter((j) => j.checkpointId === cp.id);
            return <TimelineItem key={cp.id} color="#FFB454" textColor="#000" label={`${i + 1}`} title={cp.name} sub={captures.length ? `${captures.length} capture${captures.length === 1 ? "" : "s"}` : "No captures"} />;
          })}
          <TimelineItem color="#FF7B6B" textColor="#fff" label="B" title={ride.to.name} sub={endedAt ? `Ended at ${endedAt.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}` : "Destination"} last />
        </View>

        <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mx-5 mt-7 mb-3">Share this journal</Text>
        <View className="flex-row gap-3 px-5">
          <ShareBtn icon="chat" color="#25D366" label="WhatsApp" onPress={() => share("whatsapp")} />
          <ShareBtn icon="twitter" color="#1DA1F2" label="X" onPress={() => share("twitter")} />
          <ShareBtn icon="instagram" color="#DD2A7B" label="Instagram" onPress={() => share("instagram")} />
          <ShareBtn icon="share" color="#252E3C" label="More" onPress={() => share("native")} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Box({ label, value, unit }: any) {
  return (
    <View className="flex-1 p-3.5 rounded-[20px] bg-surface border border-white/8 items-center">
      <Text className="text-white/35 text-[9px] font-black tracking-widest uppercase">{label}</Text>
      <View className="flex-row items-baseline mt-1.5">
        <Text className="text-white text-[20px] font-black tracking-tighter">{value}</Text>
        {unit && <Text className="text-white/60 text-[10px] font-bold ml-1">{unit}</Text>}
      </View>
    </View>
  );
}

function TimelineItem({ color, textColor, label, title, sub, last }: any) {
  return (
    <View className="flex-row gap-3 py-3">
      <View style={{ backgroundColor: color }} className="w-6 h-6 rounded-full items-center justify-center">
        <Text style={{ color: textColor }} className="text-[11px] font-black">{label}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-white text-[13px] font-extrabold">{title}</Text>
        <Text className="text-white/35 text-[11px] mt-0.5">{sub}</Text>
      </View>
    </View>
  );
}

function ShareBtn({ icon, color, label, onPress }: any) {
  return (
    <Pressable onPress={onPress} className="flex-1 items-center gap-2 py-3.5 rounded-[14px] bg-surface border border-white/8">
      <View style={{ backgroundColor: color }} className="w-10 h-10 rounded-full items-center justify-center">
        <Icon name={icon} size={20} color="#fff" strokeWidth={2.4} />
      </View>
      <Text className="text-white/60 text-[10px] font-extrabold">{label}</Text>
    </Pressable>
  );
}