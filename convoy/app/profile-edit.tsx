import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../src/context/AppContext";
import { AVATAR_OPTIONS } from "../src/constants/presets";
import { Icon } from "../src/components/ui/Icon";
import { PrimaryButton } from "../src/components/ui/PrimaryButton";
import { pickImageFromLibrary } from "../src/lib/media";

const isImageUri = (s: string) =>
  s.startsWith("http") || s.startsWith("file://") || s.startsWith("data:") || s.startsWith("content://");

export default function ProfileEdit() {
  const router = useRouter();
  const { state, updateUser, toast } = useApp();
  const user = state.user;

  const [name, setName] = useState(user?.name ?? "");
  const [handle, setHandle] = useState(user?.handle ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "bike");

  if (!user) return null;

  const onUpload = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) setAvatar(uri);
  };

  const save = () => {
    if (!name.trim()) return toast("Name is required");
    updateUser({
      name: name.trim(),
      handle: handle.trim() || `@${name.trim().toLowerCase().replace(/\s+/g, "")}`,
      avatar,
    });
    toast("Profile updated");
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center gap-3 mb-6">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-surface border border-white/8 items-center justify-center"
          >
            <Icon name="x" size={20} />
          </Pressable>
          <Text className="text-white text-[20px] font-black tracking-tight">Edit profile</Text>
        </View>

        {/* Preview */}
        <View className="items-center mb-6">
          <View
            className="w-28 h-28 rounded-full items-center justify-center overflow-hidden"
            style={{ backgroundColor: "#1D242F", borderWidth: 3, borderColor: "#FF7B6B" }}
          >
            {isImageUri(avatar) ? (
              <Image source={{ uri: avatar }} style={{ width: "100%", height: "100%" }} />
            ) : (
              <Icon name={avatar} size={56} color="#FF7B6B" strokeWidth={2.2} />
            )}
          </View>
        </View>

        {/* Upload button */}
        <Pressable
          onPress={onUpload}
          className="rounded-[16px] p-4 flex-row items-center gap-3 mb-6"
          style={{ backgroundColor: "rgba(255,123,107,0.08)", borderWidth: 1, borderColor: "rgba(255,123,107,0.25)" }}
        >
          <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: "rgba(255,123,107,0.15)" }}>
            <Icon name="image" size={18} color="#FF7B6B" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-[13px] font-extrabold">Upload from gallery</Text>
            <Text className="text-white/50 text-[11px] mt-0.5">Choose a square photo</Text>
          </View>
          <Icon name="chevronRight" size={16} color="rgba(240,243,248,0.4)" />
        </Pressable>

        {/* Icon picker */}
        <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mb-3">Or pick an icon</Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          {AVATAR_OPTIONS.map((a) => {
            const on = avatar === a;
            return (
              <Pressable
                key={a}
                onPress={() => setAvatar(a)}
                className={`w-14 h-14 rounded-full items-center justify-center border-2 ${on ? "border-primary" : "border-white/8"}`}
                style={{ backgroundColor: on ? "rgba(255,123,107,0.12)" : "#151A23" }}
              >
                <Icon name={a} size={24} color={on ? "#FF7B6B" : "#F0F3F8"} strokeWidth={2.2} />
              </Pressable>
            );
          })}
        </View>

        <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mb-2">Display name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Arjun Rider"
          placeholderTextColor="rgba(240,243,248,0.35)"
          className="bg-surface border border-white/8 rounded-[14px] px-4 py-[14px] text-white text-[15px] font-semibold mb-4"
        />

        <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mb-2">Handle</Text>
        <TextInput
          value={handle}
          onChangeText={setHandle}
          placeholder="@arjunrides"
          placeholderTextColor="rgba(240,243,248,0.35)"
          autoCapitalize="none"
          className="bg-surface border border-white/8 rounded-[14px] px-4 py-[14px] text-white text-[15px] font-semibold"
        />

        <View className="mt-10">
          <PrimaryButton label="Save changes" icon="check" onPress={save} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}