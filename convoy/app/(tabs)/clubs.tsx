import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../../src/components/layout/ScreenContainer";
import { ClubRow } from "../../src/components/ui/ClubRow";
import { EmptyState } from "../../src/components/ui/EmptyState";
import { PrimaryButton } from "../../src/components/ui/PrimaryButton";
import { Icon } from "../../src/components/ui/Icon";
import { useApp } from "../../src/context/AppContext";

export default function Clubs() {
  const router = useRouter();
  const { state } = useApp();
  const [q, setQ] = useState("");
  const clubs = [...state.clubs]
    .sort((a, b) => {
      const al = a.messages[a.messages.length - 1]?.ts || a.createdAt;
      const bl = b.messages[b.messages.length - 1]?.ts || b.createdAt;
      return bl - al;
    })
    .filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <ScreenContainer>
      <View className="px-5 pt-3 pb-2 flex-row items-end justify-between">
        <View>
          <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase">Chats & Plans</Text>
          <Text className="text-white text-[30px] font-black tracking-tighter mt-1">Clubs</Text>
        </View>
        <Pressable onPress={() => router.push("/club/create")} className="w-11 h-11 rounded-full bg-primary items-center justify-center" style={{ shadowColor: "#FF7B6B", shadowOpacity: 0.4, shadowRadius: 10 }}>
          <Icon name="plus" size={20} color="#fff" strokeWidth={2.8} />
        </Pressable>
      </View>

      <View className="mx-5 mt-4 flex-row items-center gap-2.5 bg-surface border border-white/8 rounded-[14px] px-4 py-3">
        <Icon name="search" size={18} color="rgba(240,243,248,0.35)" />
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search clubs"
          placeholderTextColor="rgba(240,243,248,0.35)"
          className="flex-1 text-white text-[14px] font-semibold"
        />
      </View>

      {clubs.length === 0 ? (
        <>
          <EmptyState icon="chat" title="No clubs yet" text="Create a club to start chatting with your crew and planning rides together." />
          <View className="px-5"><PrimaryButton label="Create your first club" icon="plus" onPress={() => router.push("/club/create")} /></View>
        </>
      ) : (
        <View className="mx-5 mt-4">
          {clubs.map((c) => (
            <ClubRow key={c.id} club={c} onPress={() => router.push(`/club/${c.id}`)} />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}