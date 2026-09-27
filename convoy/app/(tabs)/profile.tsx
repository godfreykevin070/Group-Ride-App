import { View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../../src/components/layout/ScreenContainer";
import { Avatar } from "../../src/components/ui/Avatar";
import { Icon } from "../../src/components/ui/Icon";
import { SectionHead } from "../../src/components/ui/SectionHead";
import { useApp } from "../../src/context/AppContext";

export default function Profile() {
  const router = useRouter();
  const { state, addSosContact, removeSosContact, reset } = useApp();
  const user = state.user;

  // ✅ Guard before any usage — hooks above are fine
  if (!user) return null;

  const done = state.rides.filter((r) => r.riders.includes(user.name) && r.status === "completed");
  const km = done.reduce((s, r) => s + (r.distance || 0), 0);
  const journalCount = done.reduce((s, r) => s + (r.journal?.length || 0), 0);

  const onAddSos = () => {
    Alert.prompt?.("Contact name", undefined, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Next",
        onPress: (name?: string) => {
          if (!name) return;
          Alert.prompt?.("Phone number", undefined, [
            { text: "Cancel", style: "cancel" },
            { text: "Add", onPress: (phone?: string) => phone && addSosContact({ name, phone }) },
          ]);
        },
      },
    ]);
  };

  return (
    <ScreenContainer>
      {/* ============ Header with edit button ============ */}
      <View className="px-5 pt-3 pb-2 flex-row items-start justify-between">
        <View>
          <Text className="text-white/60 text-[13px] font-semibold">Your account</Text>
          <Text className="text-white text-[28px] font-black tracking-tighter mt-1">Profile</Text>
        </View>
        <Pressable
          onPress={() => router.push("/profile-edit")}
          className="w-11 h-11 rounded-full bg-surface border border-white/8 items-center justify-center"
        >
          <Icon name="pencil" size={18} />
        </Pressable>
      </View>

      {/* ============ Profile card — tappable to edit ============ */}
      <Pressable
        onPress={() => router.push("/profile-edit")}
        className="mx-5 mt-4 p-5 rounded-[26px] flex-row items-center gap-4"
        style={{
          backgroundColor: "rgba(255,123,107,0.1)",
          borderWidth: 1,
          borderColor: "rgba(255,123,107,0.15)",
        }}
      >
        <Avatar person={user} size={72} borderColor="#FF7B6B" />
        <View className="flex-1 min-w-0">
          <Text className="text-white text-[20px] font-black tracking-tight" numberOfLines={1}>
            {user.name}
          </Text>
          <Text className="text-white/60 text-[12px] font-semibold mt-1">{user.handle}</Text>
        </View>
        <View
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(255,123,107,0.2)" }}
        >
          <Icon name="pencil" size={14} color="#FF7B6B" strokeWidth={2.6} />
        </View>
      </Pressable>

      {/* ============ Lifetime stats ============ */}
      <View className="px-5 pt-6">
        <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase">
          Lifetime distance
        </Text>
        <View className="flex-row items-baseline mt-2">
          <Text className="text-white text-[52px] font-black tracking-tighter leading-[54px]">
            {km.toLocaleString()}
          </Text>
          <Text className="text-white/60 text-[18px] font-bold ml-2">km</Text>
        </View>
        <Text className="text-white/60 text-[13px] font-medium mt-1.5">
          Across {done.length} ride{done.length === 1 ? "" : "s"}
        </Text>
      </View>

      <View className="px-5 pt-6 flex-row gap-2.5">
        <Tile label="Friends" value={state.friends.length} />
        <Tile label="Clubs" value={state.clubs.length} />
        <Tile label="Photos" value={journalCount} />
      </View>

      {/* ============ Emergency contacts ============ */}
      <SectionHead title="Emergency contacts" action="Add" onAction={onAddSos} />
      <View className="mx-5 bg-surface border border-white/8 rounded-[20px] overflow-hidden">
        {state.sosContacts.length === 0 ? (
          <Pressable onPress={onAddSos} className="flex-row items-center gap-3 p-4">
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(255,92,122,0.12)" }}
            >
              <Icon name="userPlus" size={18} color="#FF5C7A" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-[13px] font-bold">Add an emergency contact</Text>
              <Text className="text-white/35 text-[11px] mt-0.5">They'll be alerted when you press SOS</Text>
            </View>
          </Pressable>
        ) : (
          state.sosContacts.map((c) => (
            <View
              key={c.id}
              className="flex-row items-center gap-3 p-4 border-b border-white/4 last:border-b-0"
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(124,229,176,0.12)" }}
              >
                <Icon name="shield" size={18} color="#7CE5B0" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-[13px] font-bold">{c.name}</Text>
                <Text className="text-white/35 text-[11px] mt-0.5">{c.phone}</Text>
              </View>
              <Pressable onPress={() => removeSosContact(c.id)}>
                <Icon name="trash" size={16} color="rgba(240,243,248,0.35)" />
              </Pressable>
            </View>
          ))
        )}
      </View>

      {/* ============ Settings ============ */}
      <SectionHead title="Settings" />
      <View className="mx-5 bg-surface border border-white/8 rounded-[20px] overflow-hidden mb-10">
        <Pressable
          onPress={() => router.push("/profile-edit")}
          className="flex-row items-center gap-3 p-4 border-b border-white/4"
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(255,180,84,0.12)" }}
          >
            <Icon name="pencil" size={18} color="#FFB454" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-[13px] font-bold">Edit profile</Text>
          </View>
          <Icon name="chevronRight" size={16} color="rgba(240,243,248,0.35)" />
        </Pressable>

        <Pressable
          onPress={() =>
            Alert.alert("Reset", "Delete all data?", [
              { text: "Cancel" },
              { text: "Reset", style: "destructive", onPress: reset },
            ])
          }
          className="flex-row items-center gap-3 p-4"
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(255,92,122,0.12)" }}
          >
            <Icon name="logout" size={18} color="#FF5C7A" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-[13px] font-bold">Reset app</Text>
          </View>
          <Icon name="chevronRight" size={16} color="rgba(240,243,248,0.35)" />
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

function Tile({ label, value }: { label: string; value: number }) {
  return (
    <View className="flex-1 p-3.5 rounded-[20px] bg-surface border border-white/8 items-center">
      <Text className="text-white/35 text-[10px] font-black tracking-widest uppercase">
        {label}
      </Text>
      <Text className="text-white text-[24px] font-black tracking-tighter mt-1">{value}</Text>
    </View>
  );
}