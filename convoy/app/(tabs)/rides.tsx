import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../../src/components/layout/ScreenContainer";
import { StatTile } from "../../src/components/ui/StatTile";
import { RideCard } from "../../src/components/ui/RideCard";
import { EmptyState } from "../../src/components/ui/EmptyState";
import { PrimaryButton } from "../../src/components/ui/PrimaryButton";
import { SectionHead } from "../../src/components/ui/SectionHead";
import { useApp } from "../../src/context/AppContext";

export default function Rides() {
  const router = useRouter();
  const { state } = useApp();
  const mine = state.rides.filter((r) => state.user && r.riders.includes(state.user.name));
  const upcoming = mine.filter((r) => r.status === "upcoming").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const completed = mine.filter((r) => r.status === "completed").sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const km = completed.reduce((s, r) => s + (r.distance || 0), 0);

  return (
    <ScreenContainer>
      <View className="px-5 pt-3 pb-4">
        <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase">Your journeys</Text>
        <Text className="text-white text-[30px] font-black tracking-tighter mt-1">Rides</Text>
      </View>

      <View className="px-5 flex-row gap-2.5">
        <StatTile label="Total rides" value={mine.length} />
        <StatTile label="Distance" value={km.toLocaleString()} unit="km" color="#FF7B6B" bg="rgba(255,123,107,0.15)" />
      </View>

      {mine.length === 0 ? (
        <>
          <EmptyState icon="route" title="No rides yet" text="Plan your first ride with your club and it'll show up here." />
          <View className="px-5"><PrimaryButton label="Plan a ride" icon="plus" onPress={() => router.push("/plan-ride")} /></View>
        </>
      ) : (
        <>
          {upcoming.length > 0 && (
            <>
              <SectionHead title="Upcoming" />
              {upcoming.map((r) => <RideCard key={r.id} ride={r} isUpcoming onPress={() => router.push(`/ride/${r.id}`)} />)}
            </>
          )}
          {completed.length > 0 && (
            <>
              <SectionHead title="Completed" />
              {completed.map((r) => <RideCard key={r.id} ride={r} isUpcoming={false} onPress={() => router.push(`/ride/${r.id}`)} />)}
            </>
          )}
        </>
      )}
    </ScreenContainer>
  );
}