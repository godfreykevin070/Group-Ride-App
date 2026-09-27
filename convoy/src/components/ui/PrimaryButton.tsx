import { Pressable, Text, ActivityIndicator } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { Icon } from "./Icon";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  label: string;
  onPress: () => void;
  icon?: keyof typeof import("./Icon").Icons;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function PrimaryButton({ label, onPress, icon, disabled, loading, fullWidth }: Props) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPressIn={() => (scale.value = withSpring(0.97))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        anim,
        { backgroundColor: "#FF7B6B", opacity: disabled ? 0.5 : 1 },
      ]}
      className={`py-[18px] rounded-full flex-row items-center justify-center gap-2 ${fullWidth ? "w-full" : ""}`}
    >
      {loading ? <ActivityIndicator color="#fff" /> : (
        <>
          {icon && <Icon name={icon} size={18} color="#fff" strokeWidth={2.6} />}
          <Text className="text-white text-[15px] font-extrabold">{label}</Text>
        </>
      )}
    </AnimatedPressable>
  );
}