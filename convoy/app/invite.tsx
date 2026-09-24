import { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { X, Zap, ZapOff, Users } from "lucide-react-native";

export default function Invite() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [scanned, setScanned] = useState(false);

  const scanY = useSharedValue(0);

  useEffect(() => {
    scanY.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanY.value * 240 }],
  }));

  // Fallback if permissions haven't resolved yet
  if (!permission) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white/60 text-[14px]">Loading camera…</Text>
      </View>
    );
  }

  // Permission not granted yet
  if (!permission.granted) {
    return (
      <LinearGradient
        colors={["#0F2818", "#000000"]}
        style={{ flex: 1 }}
      >
        <View className="flex-row justify-end px-4 pt-14">
          <Pressable
            onPress={() => router.back()}
            className="w-11 h-11 rounded-full bg-white/10 border border-white/15 items-center justify-center"
          >
            <X size={20} color="#fff" strokeWidth={2.6} />
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center px-8">
          <View className="w-24 h-24 rounded-full bg-[#D4FF3A]/15 items-center justify-center mb-6">
            <Users size={40} color="#D4FF3A" strokeWidth={2.4} />
          </View>
          <Text
            className="text-white text-[26px] text-center"
            style={{ fontWeight: "900", letterSpacing: -1 }}
          >
            Scan to Invite
          </Text>
          <Text
            className="text-white/60 text-[14px] text-center mt-3 leading-[20px]"
            style={{ fontWeight: "600" }}
          >
            We need camera access to scan your friend's QR code and add them
            to your convoy.
          </Text>

          <Pressable
            onPress={requestPermission}
            className="mt-8 rounded-full px-6 py-4"
            style={{ backgroundColor: "#D4FF3A" }}
          >
            <Text
              className="text-black text-[15px]"
              style={{ fontWeight: "900" }}
            >
              Grant camera access
            </Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={({ data }) => {
          if (scanned) return;
          setScanned(true);
          // handle scanned QR — for now, go back after a beat
          setTimeout(() => router.back(), 600);
        }}
      />

      {/* Dark vignette */}
      <LinearGradient
        colors={[
          "rgba(0,0,0,0.85)",
          "rgba(0,0,0,0.4)",
          "rgba(0,0,0,0.4)",
          "rgba(0,0,0,0.9)",
        ]}
        locations={[0, 0.3, 0.7, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Top bar */}
      <View className="flex-row justify-between items-center px-4 pt-14">
        <Text
          className="text-white text-[20px]"
          style={{ fontWeight: "900", letterSpacing: -0.6 }}
        >
          Scan QR
        </Text>
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => setTorch((t) => !t)}
            className="w-11 h-11 rounded-full bg-white/10 border border-white/15 items-center justify-center"
          >
            {torch ? (
              <Zap size={18} color="#D4FF3A" strokeWidth={2.6} />
            ) : (
              <ZapOff size={18} color="#fff" strokeWidth={2.6} />
            )}
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            className="w-11 h-11 rounded-full bg-white/10 border border-white/15 items-center justify-center"
          >
            <X size={20} color="#fff" strokeWidth={2.6} />
          </Pressable>
        </View>
      </View>

      {/* Scan frame */}
      <View className="flex-1 items-center justify-center">
        <View
          className="w-[260px] h-[260px] rounded-[32px] relative overflow-hidden"
          style={{ borderWidth: 2, borderColor: "rgba(255,255,255,0.15)" }}
        >
          {/* Corner brackets */}
          <View className="absolute top-0 left-0 w-10 h-10 border-t-[4px] border-l-[4px] border-[#D4FF3A] rounded-tl-[32px]" />
          <View className="absolute top-0 right-0 w-10 h-10 border-t-[4px] border-r-[4px] border-[#D4FF3A] rounded-tr-[32px]" />
          <View className="absolute bottom-0 left-0 w-10 h-10 border-b-[4px] border-l-[4px] border-[#D4FF3A] rounded-bl-[32px]" />
          <View className="absolute bottom-0 right-0 w-10 h-10 border-b-[4px] border-r-[4px] border-[#D4FF3A] rounded-br-[32px]" />

          {/* Animated scan line */}
          <Animated.View
            style={[
              {
                position: "absolute",
                left: 20,
                right: 20,
                height: 2,
                backgroundColor: "#D4FF3A",
                shadowColor: "#D4FF3A",
                shadowOpacity: 1,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 0 },
              },
              scanLineStyle,
            ]}
          />
        </View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(500).springify()}
          className="mt-8 px-10"
        >
          <Text
            className="text-white text-[15px] text-center"
            style={{ fontWeight: "700" }}
          >
            {scanned ? "Rider found!" : "Point at your friend's Convoy QR"}
          </Text>
          <Text
            className="text-white/50 text-[13px] text-center mt-2"
            style={{ fontWeight: "600" }}
          >
            We'll add them to your convoy automatically.
          </Text>
        </Animated.View>
      </View>

      {/* Bottom actions */}
      <View className="px-4 pb-10 gap-3">
        <Pressable
          className="rounded-full py-4 items-center justify-center"
          style={{ backgroundColor: "#D4FF3A" }}
        >
          <Text
            className="text-black text-[14px]"
            style={{ fontWeight: "900" }}
          >
            Show my QR instead
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.back()}
          className="rounded-full py-4 items-center justify-center border border-white/15 bg-white/5"
        >
          <Text
            className="text-white text-[14px]"
            style={{ fontWeight: "800" }}
          >
            Cancel
          </Text>
        </Pressable>
      </View>
    </View>
  );
}