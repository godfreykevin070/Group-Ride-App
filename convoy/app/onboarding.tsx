import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../src/context/AppContext";
import { AVATAR_OPTIONS } from "../src/constants/presets";
import { PrimaryButton } from "../src/components/ui/PrimaryButton";
import { GhostButton } from "../src/components/ui/GhostButton";
import { Icon } from "../src/components/ui/Icon";
import { pickImageFromLibrary } from "../src/lib/media";

const isImageUri = (s: string) =>
  s.startsWith("http") || s.startsWith("file://") || s.startsWith("data:") || s.startsWith("content://");

export default function Onboarding() {
  const router = useRouter();
  const { setUser } = useApp();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [avatar, setAvatar] = useState("bike");

  const onUpload = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) setAvatar(uri);
  };

  const finish = () => {
    setUser({
      name: name.trim(),
      handle: handle.trim() || `@${name.toLowerCase().replace(/\s+/g, "")}`,
      avatar,
      onboardedAt: Date.now(),
    });
    router.replace("/");
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-bg">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: 60 }}>
        <View className="w-16 h-16 rounded-[18px] items-center justify-center mb-6" style={{ backgroundColor: "#FF7B6B" }}>
          <Icon name="bike" size={30} color="#0B0E15" strokeWidth={2.4} />
        </View>

        {step === 0 && (
          <>
            <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase">Welcome to Convoy</Text>
            <Text className="text-white text-[32px] font-black tracking-tighter mt-2 leading-9">
              Ride together,{"\n"}stay connected.
            </Text>
            <Text className="text-white/60 text-[14px] font-medium mt-3 leading-5">
              Plan rides, chat with your club, and track the whole crew live on a map.
            </Text>
          </>
        )}

        {step === 1 && (
          <>
            <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase">Step 1 of 2</Text>
            <Text className="text-white text-[32px] font-black tracking-tighter mt-2 leading-9">
              What should{"\n"}we call you?
            </Text>

            <View className="mt-7">
              <Text className="text-white/35 text-[11px] font-black tracking-wider uppercase mb-2">Display name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Arjun Rider"
                placeholderTextColor="rgba(240,243,248,0.35)"
                autoFocus
                className="bg-surface border border-white/8 rounded-[14px] px-4 py-[14px] text-white text-[15px] font-semibold"
              />
            </View>
            <View className="mt-4">
              <Text className="text-white/35 text-[11px] font-black tracking-wider uppercase mb-2">
                Handle (optional)
              </Text>
              <TextInput
                value={handle}
                onChangeText={setHandle}
                placeholder="@arjunrides"
                placeholderTextColor="rgba(240,243,248,0.35)"
                autoCapitalize="none"
                className="bg-surface border border-white/8 rounded-[14px] px-4 py-[14px] text-white text-[15px] font-semibold"
              />
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase">Step 2 of 2</Text>
            <Text className="text-white text-[32px] font-black tracking-tighter mt-2 leading-9">
              Pick your{"\n"}avatar.
            </Text>
            <Text className="text-white/60 text-[14px] font-medium mt-3">You can change this later.</Text>

            {/* Upload from gallery */}
            <Pressable
              onPress={onUpload}
              className="mt-6 rounded-[16px] p-4 flex-row items-center gap-3"
              style={{ backgroundColor: "rgba(255,123,107,0.08)", borderWidth: 1, borderColor: "rgba(255,123,107,0.25)" }}
            >
              <View className="w-14 h-14 rounded-full items-center justify-center overflow-hidden" style={{ backgroundColor: "#1D242F" }}>
                {isImageUri(avatar) ? (
                  <Image source={{ uri: avatar }} style={{ width: "100%", height: "100%" }} />
                ) : (
                  <Icon name="image" size={22} color="#FF7B6B" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-white text-[14px] font-extrabold">Upload from gallery</Text>
                <Text className="text-white/50 text-[11px] mt-0.5">Pick a square photo of yourself</Text>
              </View>
              <Icon name="chevronRight" size={16} color="rgba(240,243,248,0.4)" />
            </Pressable>

            <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mt-7 mb-3">
              Or pick an icon
            </Text>
            <View className="flex-row flex-wrap gap-3">
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
          </>
        )}

        <View style={{ flex: 1 }} />

        <View className="mt-10 gap-3">
          {step === 0 && <PrimaryButton label="Get started" onPress={() => setStep(1)} icon="arrowRight" />}
          {step === 1 && (
            <>
              <PrimaryButton label="Continue" onPress={() => setStep(2)} icon="arrowRight" disabled={!name.trim()} />
              <GhostButton label="Back" onPress={() => setStep(0)} />
            </>
          )}
          {step === 2 && (
            <>
              <PrimaryButton label="Enter Convoy" onPress={finish} icon="sparkles" />
              <GhostButton label="Back" onPress={() => setStep(1)} />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}