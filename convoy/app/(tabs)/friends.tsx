import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../../src/components/layout/ScreenContainer";
import { FriendRow } from "../../src/components/ui/FriendRow";
import { EmptyState } from "../../src/components/ui/EmptyState";
import { PrimaryButton } from "../../src/components/ui/PrimaryButton";
import { Icon } from "../../src/components/ui/Icon";
import { SectionHead } from "../../src/components/ui/SectionHead";
import { useApp } from "../../src/context/AppContext";

export default function Friends() {
  const router = useRouter();
  const { state } = useApp();
  const [mode, setMode] = useState<"list" | "board">("list");
  if (!state.user) return null;

  const completed = state.rides.filter((r) => r.status === "completed");
  const board = [state.user, ...state.friends]
    .map((p) => {
      const rides = completed.filter((r) => r.riders.includes(p.name));
      const km = rides.reduce((s, r) => s + (r.distance || 0), 0);
      return { person: p, rides: rides.length, km, isMe: p.name === state.user!.name };
    })
    .sort((a, b) => b.km - a.km);

  return (
    <ScreenContainer>
      <View className="px-5 pt-3 pb-2 flex-row items-end justify-between">
        <View>
          <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase">Your crew</Text>
          <Text className="text-white text-[30px] font-black tracking-tighter mt-1">Friends</Text>
        </View>
        <Pressable onPress={() => router.push("/invite")} className="w-11 h-11 rounded-full bg-primary items-center justify-center">
          <Icon name="userPlus" size={20} color="#fff" strokeWidth={2.6} />
        </Pressable>
      </View>

      <View className="mx-5 mt-4 flex-row bg-surface border border-white/8 rounded-full p-1.5">
        {(["list", "board"] as const).map((m) => (
          <Pressable
            key={m}
            onPress={() => setMode(m)}
            className={`flex-1 py-2.5 rounded-full items-center ${mode === m ? "bg-primary" : ""}`}
          >
            <Text className={`text-[13px] font-extrabold ${mode === m ? "text-white" : "text-white/60"}`}>
              {m === "list" ? "All Friends" : "Leaderboard"}
            </Text>
          </Pressable>
        ))}
      </View>

      {state.friends.length === 0 ? (
        <>
          <EmptyState icon="users" title="No friends yet" text="Invite riders to build your convoy." />
          <View className="px-5"><PrimaryButton label="Invite friends" icon="plus" onPress={() => router.push("/invite")} /></View>
        </>
      ) : mode === "list" ? (
        <>
          <SectionHead title={`${state.friends.length} friend${state.friends.length === 1 ? "" : "s"}`} />
          <View className="mx-5 bg-surface border border-white/8 rounded-[20px] overflow-hidden">
            {state.friends.map((f) => {
              const rides = completed.filter((r) => r.riders.includes(f.name));
              const km = rides.reduce((s, r) => s + (r.distance || 0), 0);
              return <FriendRow key={f.id} friend={f} rides={rides.length} km={km} />;
            })}
          </View>
        </>
      ) : (
        <>
          <SectionHead title={`Season ${new Date().getFullYear()}`} />
          <View className="mx-5 bg-surface border border-white/8 rounded-[20px] overflow-hidden">
            {board.map((b, i) => (
              <FriendRow
                key={b.person.name}
                friend={{ ...b.person, id: b.person.name, status: "idle", addedAt: 0 }}
                rides={b.rides}
                km={b.km}
                rank={i + 1}
              />
            ))}
          </View>
        </>
      )}
    </ScreenContainer>
  );
}