import { View, Text } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { useApp } from "../../context/AppContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ToastHost() {
  const { toasts } = useApp();
  const insets = useSafeAreaInsets();
  if (!toasts.length) return null;
  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", left: 0, right: 0, bottom: 100 + insets.bottom, alignItems: "center", zIndex: 9999 }}
    >
      {toasts.slice(-1).map((t) => (
        <Animated.View
          key={t.id}
          entering={FadeInDown.duration(250)}
          exiting={FadeOutDown.duration(200)}
          className="px-5 py-3 rounded-full bg-surface-2 border border-white/12 max-w-[90%]"
        >
          <Text className="text-white text-[13px] font-bold">{t.msg}</Text>
        </Animated.View>
      ))}
    </View>
  );
}