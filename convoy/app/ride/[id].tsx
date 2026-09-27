import { Fragment } from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useApp } from "../../src/context/AppContext";
import { Icon } from "../../src/components/ui/Icon";

export default function RideDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state, startRide, updateRide, deleteRide } = useApp();
  const ride = state.rides.find((r) => r.id === id);
  if (!ride || !state.user) return null;

  const joined = ride.riders.includes(state.user.name);
  const isCreator = ride.createdBy === state.user.name;
  const dt = new Date(ride.date);
  const hasJournal = (ride.journal || []).length > 0;

  return (
    <ScrollView className="flex-1 bg-bg" contentContainerStyle={{ paddingBottom: 60 }}>
      <View style={{ height: 220, position: "relative" }}>
        <Image source={{ uri: ride.cover }} style={{ width: "100%", height: "100%" }} />
        <View style={{ position: "absolute", inset: 0, backgroundColor: "rgba(11,14,21,0.5)" }} />
        <Pressable
          onPress={() => router.back()}
          className="absolute top-12 left-5 w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <Icon name="back" size={20} />
        </Pressable>
        <View className="absolute bottom-5 left-5 right-5">
          <Text className="text-primary text-[10px] font-black tracking-widest uppercase">{ride.difficulty}</Text>
          <Text className="text-white text-[24px] font-black tracking-tight mt-1">{ride.title}</Text>
        </View>
      </View>

      <View className="flex-row gap-2.5 px-5 pt-5">
        <Mini label="Distance" value={`${ride.distance}`} unit="km" />
        <Mini label="Date" value={`${dt.getDate()}`} unit={dt.toLocaleDateString("en-IN", { month: "short" })} />
        <Mini label="Riders" value={`${ride.riders.length}`} />
      </View>

      <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mx-5 mt-7 mb-3">Route</Text>
      <View className="mx-5 bg-surface border border-white/8 rounded-[20px] p-4">
        <RouteStep label="A" name={ride.from.name} color="#7CE5B0" textColor="#0B0E15" />
        {ride.checkpoints.map((cp, i) => (
          <Fragment key={cp.id}>
            <View className="ml-[11px] h-5 border-l-2 border-dashed border-white/12" />
            <RouteStep label={`${i + 1}`} name={cp.name} color="#FFB454" textColor="#000" />
          </Fragment>
        ))}
        <View className="ml-[11px] h-5 border-l-2 border-dashed border-white/12" />
        <RouteStep label="B" name={ride.to.name} color="#FF7B6B" textColor="#fff" />
      </View>

      {hasJournal && (
        <>
          <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mx-5 mt-7 mb-3">
            Journal ({ride.journal.length})
          </Text>
          <View className="mx-5 flex-row flex-wrap gap-2.5">
            {ride.journal.slice(0, 4).map((j) => (
              <Pressable
                key={j.id}
                onPress={() => router.push({ pathname: "/ride/journal", params: { id: ride.id } })}
                className="rounded-[16px] overflow-hidden"
                style={{ width: "48%", aspectRatio: 1, backgroundColor: "#1D242F" }}
              >
                {j.data ? <Image source={{ uri: j.data }} style={{ width: "100%", height: "100%" }} /> : null}
              </Pressable>
            ))}
          </View>
        </>
      )}

      <View className="px-5 mt-8 flex-row gap-2.5">
        {ride.status === "upcoming" && joined && (
          <Pressable
            onPress={() => { startRide(ride.id); router.push("/ride/live"); }}
            className="flex-1 bg-primary rounded-[14px] py-4 items-center flex-row justify-center gap-2"
          >
            <Icon name="play" size={16} color="#fff" strokeWidth={2.6} />
            <Text className="text-white text-[13px] font-extrabold">Start ride</Text>
          </Pressable>
        )}
        {ride.status === "upcoming" && !joined && (
          <Pressable
            onPress={() => updateRide(ride.id, { riders: [...ride.riders, state.user!.name] })}
            className="flex-1 bg-mint rounded-[14px] py-4 items-center flex-row justify-center gap-2"
          >
            <Icon name="check" size={16} color="#0B0E15" strokeWidth={2.8} />
            <Text className="text-black text-[13px] font-extrabold">Join ride</Text>
          </Pressable>
        )}
        {ride.status === "completed" && hasJournal && (
          <Pressable
            onPress={() => router.push({ pathname: "/ride/journal", params: { id: ride.id } })}
            className="flex-1 bg-primary rounded-[14px] py-4 items-center flex-row justify-center gap-2"
          >
            <Icon name="book" size={16} color="#fff" strokeWidth={2.6} />
            <Text className="text-white text-[13px] font-extrabold">Ride journal</Text>
          </Pressable>
        )}
        {ride.status === "completed" && !hasJournal && (
          <View className="flex-1 items-center py-4">
            <Text className="text-mint text-[13px] font-bold">Completed</Text>
          </View>
        )}
        {isCreator && ride.status === "upcoming" && (
          <Pressable
            onPress={() => { deleteRide(ride.id); router.back(); }}
            className="flex-1 bg-surface-2 rounded-[14px] py-4 items-center flex-row justify-center gap-2"
          >
            <Icon name="trash" size={16} strokeWidth={2.4} />
            <Text className="text-white text-[13px] font-extrabold">Cancel</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

function Mini({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <View className="flex-1 p-3.5 rounded-[20px] bg-surface border border-white/8 items-center">
      <Text className="text-white/35 text-[9px] font-black tracking-widest uppercase">{label}</Text>
      <View className="flex-row items-baseline mt-1.5">
        <Text className="text-white text-[22px] font-black tracking-tighter">{value}</Text>
        {unit && <Text className="text-white/60 text-[11px] font-bold ml-1">{unit}</Text>}
      </View>
    </View>
  );
}

function RouteStep({ label, name, color, textColor }: { label: string; name: string; color: string; textColor: string }) {
  return (
    <View className="flex-row items-center gap-3 py-1.5">
      <View style={{ backgroundColor: color }} className="w-6 h-6 rounded-full items-center justify-center">
        <Text style={{ color: textColor }} className="text-[11px] font-black">{label}</Text>
      </View>
      <Text className="text-white text-[14px] font-bold">{name}</Text>
    </View>
  );
}