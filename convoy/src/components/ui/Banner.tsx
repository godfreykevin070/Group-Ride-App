import { View, Text, Pressable } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../../context/AppContext";
import { Icon } from "./Icon";

export function Banner() {
  const { banner, dismissBanner } = useApp();
  const insets = useSafeAreaInsets();
  if (!banner) return null;
  const colors: Record<string, { bg: string; col: string; icon: any }> = {
    amber: { bg: "rgba(255,180,84,0.15)", col: "#FFB454", icon: "alert" },
    rose: { bg: "rgba(255,92,122,0.15)", col: "#FF5C7A", icon: "alertCircle" },
    mint: { bg: "rgba(124,229,176,0.15)", col: "#7CE5B0", icon: "checkCircle" },
  };
  const c = colors[banner.variant];
  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutUp.duration(250)}
      style={{ position: "absolute", top: insets.top + 8, left: 16, right: 16, zIndex: 9998 }}
    >
      <Pressable
        onPress={dismissBanner}
        className="bg-surface-2 border border-white/12 rounded-[20px] p-4 flex-row items-center gap-3"
      >
        <View style={{ backgroundColor: c.bg }} className="w-10 h-10 rounded-full items-center justify-center">
          <Icon name={c.icon} size={20} color={c.col} strokeWidth={2.6} />
        </View>
        <View className="flex-1">
          <Text className="text-white text-[14px] font-extrabold">{banner.title}</Text>
          <Text className="text-white/60 text-[12px] mt-0.5">{banner.sub}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}