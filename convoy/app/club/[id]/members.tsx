import { View, Text, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../../src/context/AppContext";
import { Icon } from "../../../src/components/ui/Icon";
import { Avatar } from "../../../src/components/ui/Avatar";

export default function ManageMembers() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state, addMember, removeMember } = useApp();
  const club = state.clubs.find((c) => c.id === id);
  if (!club || !state.user) return null;

  const members = club.memberIds.map((mid) => state.friends.find((f) => f.id === mid)).filter(Boolean);
  const nonMembers = state.friends.filter((f) => !club.memberIds.includes(f.id));

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <View className="flex-row items-center gap-3 mb-5">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-surface border border-white/8 items-center justify-center">
            <Icon name="x" size={20} />
          </Pressable>
          <Text className="text-white text-[20px] font-black tracking-tight">Manage members</Text>
        </View>

        <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mb-3">Current members ({members.length + 1})</Text>
        <View className="bg-surface border border-white/8 rounded-[20px] overflow-hidden mb-6">
          <View className="flex-row items-center gap-3 px-4 py-3.5 border-b border-white/4">
            <Avatar person={state.user} size={44} />
            <View className="flex-1"><Text className="text-white text-[15px] font-extrabold">{state.user.name} (you)</Text><Text className="text-white/35 text-[12px] mt-0.5">Creator</Text></View>
          </View>
          {members.map((m) => (
            <View key={m!.id} className="flex-row items-center gap-3 px-4 py-3.5 border-b border-white/4 last:border-b-0">
              <Avatar person={m!} size={44} />
              <View className="flex-1"><Text className="text-white text-[15px] font-extrabold">{m!.name}</Text><Text className="text-white/35 text-[12px] mt-0.5">Member</Text></View>
              <Pressable onPress={() => removeMember(club.id, m!.id)} className="w-10 h-10 rounded-full items-center justify-center">
                <Icon name="userMinus" size={18} color="rgba(240,243,248,0.5)" />
              </Pressable>
            </View>
          ))}
        </View>

        <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mb-3">Add friends</Text>
        {nonMembers.length === 0 ? (
          <View className="rounded-[14px] p-5 items-center border border-dashed border-white/12">
            <Text className="text-white/35 text-[13px] text-center">All your friends are already in this club.</Text>
            <Pressable onPress={() => router.replace("/invite")} className="mt-3 bg-primary rounded-full px-5 py-3 flex-row items-center gap-2">
              <Icon name="userPlus" size={16} color="#fff" strokeWidth={2.6} />
              <Text className="text-white text-[13px] font-extrabold">Invite a new friend</Text>
            </Pressable>
          </View>
        ) : (
          <View className="bg-surface border border-white/8 rounded-[20px] overflow-hidden">
            {nonMembers.map((f) => (
              <View key={f.id} className="flex-row items-center gap-3 px-4 py-3.5 border-b border-white/4 last:border-b-0">
                <Avatar person={f} size={44} />
                <View className="flex-1"><Text className="text-white text-[15px] font-extrabold">{f.name}</Text><Text className="text-white/35 text-[12px] mt-0.5">Tap + to add</Text></View>
                <Pressable onPress={() => addMember(club.id, f.id)} className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                  <Icon name="plus" size={16} color="#fff" strokeWidth={3} />
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}