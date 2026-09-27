import { useRef, useState } from "react";
import { View, Text, Pressable, Share, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import QRCode from "react-native-qrcode-svg";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { useApp } from "../src/context/AppContext";
import { Icon } from "../src/components/ui/Icon";

const INVITE_PREFIX = "https://convoy.app/join/";

export default function Invite() {
  const router = useRouter();
  const { state, addFriend, toast } = useApp();
  const [sharing, setSharing] = useState(false);
  const qrRef = useRef<View>(null);

  const inviteUrl = `${INVITE_PREFIX}${state.meta.installId}`;

  const shareLink = async () => {
    try {
      await Share.share({
        title: "Convoy",
        message: `Join me on Convoy — the app for motorbike riders. ${inviteUrl}`,
      });
    } catch {}
  };

  const shareQrImage = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      if (!qrRef.current) return;
      const captured = await captureRef(qrRef, {
        format: "png",
        quality: 1,
      });
      const uri = captured.startsWith("file://") ? captured : `file://${captured}`;

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: "Invite friends to Convoy",
        });
      } else {
        await Share.share({ url: uri });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert("Share failed", message);
    } finally {
      setSharing(false);
    }
  };

  const simulate = () => {
    const names = ["Rahul M.", "Priya S.", "Vikram K.", "Aditi R.", "Karan T.", "Neha B."];
    const existing = new Set(state.friends.map((f) => f.name));
    const avail = names.filter((n) => !existing.has(n));
    if (!avail.length) return toast("All demo friends added");
    addFriend(avail[0]);
    toast(`${avail[0]} joined your crew!`);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="flex-row items-center gap-3 px-5 py-4">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface border border-white/8 items-center justify-center"
        >
          <Icon name="x" size={20} />
        </Pressable>
        <Text className="text-white text-[20px] font-black tracking-tight">Invite friends</Text>
      </View>

      <View className="items-center pt-6">
        <View
          ref={qrRef}
          collapsable={false}
          style={{
            backgroundColor: "#fff",
            borderRadius: 28,
            padding: 20,
            shadowColor: "#FF7B6B",
            shadowOpacity: 0.3,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 10 },
          }}
        >
          <QRCode
            value={inviteUrl}
            size={200}
            color="#0B0E15"
            backgroundColor="#fff"
          />
        </View>

        <Text className="text-white text-[22px] font-black tracking-tight mt-8 text-center">
          Your convoy starts here
        </Text>
        <Text className="text-white/60 text-[13px] font-medium mt-2.5 text-center px-10 leading-5">
          Share this QR with your friends.
        </Text>
      </View>

      <View className="flex-1" />

      <View className="px-5 pb-10 gap-2.5">
        <Pressable
          onPress={shareLink}
          className="bg-primary rounded-[14px] py-4 items-center justify-center flex-row gap-2"
        >
          <Icon name="share" size={18} color="#fff" strokeWidth={2.4} />
          <Text className="text-white text-[14px] font-extrabold">Share invite link</Text>
        </Pressable>

        <Pressable
          onPress={shareQrImage}
          disabled={sharing}
          className="bg-surface border border-white/8 rounded-[14px] py-4 items-center justify-center flex-row gap-2"
          style={{ opacity: sharing ? 0.5 : 1 }}
        >
          <Icon name="image" size={18} strokeWidth={2.4} />
          <Text className="text-white text-[14px] font-extrabold">
            {sharing ? "Preparing…" : "Share QR image"}
          </Text>
        </Pressable>

        <Pressable
          onPress={simulate}
          className="bg-surface border border-white/8 rounded-[14px] py-4 items-center justify-center flex-row gap-2"
        >
          <Icon name="userPlus" size={18} strokeWidth={2.4} />
          <Text className="text-white text-[14px] font-extrabold">Simulate friend accepting</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}