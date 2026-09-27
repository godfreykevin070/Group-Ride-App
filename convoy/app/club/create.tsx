import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../src/context/AppContext";
import { CLUB_EMOJIS } from "../../src/constants/presets";
import { Icon } from "../../src/components/ui/Icon";
import { PrimaryButton } from "../../src/components/ui/PrimaryButton";
import { Avatar } from "../../src/components/ui/Avatar";
import { pickImageFromLibrary } from "../../src/lib/media";

const isImageUri = (s: string) =>
  s.startsWith("http") || s.startsWith("file://") || s.startsWith("data:") || s.startsWith("content://");

export default function CreateClub() {
  const router = useRouter();
  const { state, addClub, toast } = useApp();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState(CLUB_EMOJIS[0]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const onUpload = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) setIcon(uri);
  };

  const submit = () => {
    if (!name.trim()) return toast("Give your club a name");
    const club = addClub(name.trim(), icon, Array.from(selected), description.trim());
    router.replace(`/club/${club.id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center gap-3 mb-5">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-surface border border-white/8 items-center justify-center"
          >
            <Icon name="x" size={20} />
          </Pressable>
          <Text className="text-white text-[20px] font-black tracking-tight">New club</Text>
        </View>

        {/* Preview */}
        <View className="items-center mb-6">
          <View
            className="w-20 h-20 rounded-[24px] items-center justify-center overflow-hidden"
            style={{ backgroundColor: "#1D242F", borderWidth: 2, borderColor: "#FF7B6B" }}
          >
            {isImageUri(icon) ? (
              <Image source={{ uri: icon }} style={{ width: "100%", height: "100%" }} />
            ) : (
              <Icon name={icon} size={36} color="#FF7B6B" strokeWidth={2.2} />
            )}
          </View>
        </View>

        <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mb-2">Club name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Sunday Riders"
          placeholderTextColor="rgba(240,243,248,0.35)"
          autoFocus
          className="bg-surface border border-white/8 rounded-[14px] px-4 py-[14px] text-white text-[15px] font-semibold"
        />

        <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mb-2 mt-5">
          Description (optional)
        </Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="A chill crew of weekend riders…"
          placeholderTextColor="rgba(240,243,248,0.35)"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          className="bg-surface border border-white/8 rounded-[14px] px-4 py-[14px] text-white text-[14px] min-h-[80px]"
        />

        {/* Upload from gallery */}
        <Pressable
          onPress={onUpload}
          className="mt-6 rounded-[16px] p-4 flex-row items-center gap-3"
          style={{ backgroundColor: "rgba(255,123,107,0.08)", borderWidth: 1, borderColor: "rgba(255,123,107,0.25)" }}
        >
          <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: "rgba(255,123,107,0.15)" }}>
            <Icon name="image" size={18} color="#FF7B6B" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-[13px] font-extrabold">Upload from gallery</Text>
            <Text className="text-white/50 text-[11px] mt-0.5">Use a picture as club icon</Text>
          </View>
          <Icon name="chevronRight" size={16} color="rgba(240,243,248,0.4)" />
        </Pressable>

        <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mt-6 mb-3">
          Or pick an icon
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {CLUB_EMOJIS.map((e) => {
            const on = icon === e;
            return (
              <Pressable
                key={e}
                onPress={() => setIcon(e)}
                className={`w-12 h-12 rounded-full items-center justify-center border-2 ${on ? "border-primary" : "border-white/8"}`}
                style={{ backgroundColor: on ? "rgba(255,123,107,0.12)" : "#151A23" }}
              >
                <Icon name={e} size={22} color={on ? "#FF7B6B" : "#F0F3F8"} strokeWidth={2.2} />
              </Pressable>
            );
          })}
        </View>

        <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mb-2 mt-7">
          Invite members (you can add more later)
        </Text>
        {state.friends.length === 0 ? (
          <Pressable
            onPress={() => router.replace("/invite")}
            className="rounded-[14px] p-5 items-center border border-dashed border-white/12"
          >
            <Text className="text-white/35 text-[13px] text-center">
              No friends yet. <Text className="text-primary font-bold">Invite some first</Text>
            </Text>
          </Pressable>
        ) : (
          <View className="gap-2">
            {state.friends.map((f) => {
              const on = selected.has(f.id);
              return (
                <Pressable
                  key={f.id}
                  onPress={() => toggle(f.id)}
                  className={`flex-row items-center gap-3 p-3 rounded-[14px] border ${on ? "border-primary" : "border-white/8"}`}
                  style={{ backgroundColor: on ? "rgba(255,123,107,0.06)" : "rgba(255,255,255,0.03)" }}
                >
                  <View
                    className={`w-6 h-6 rounded-full items-center justify-center border-2 ${
                      on ? "bg-mint border-transparent" : "border-white/20"
                    }`}
                  >
                    {on && <Icon name="check" size={12} color="#0B0E15" strokeWidth={3} />}
                  </View>
                  <Avatar person={f} size={36} />
                  <Text className="text-white text-[13px] font-bold flex-1">{f.name}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <View className="mt-10">
          <PrimaryButton label="Create club" icon="check" onPress={submit} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}