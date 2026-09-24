import { View, Text, Image } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

interface Props {
  image?: string;
  color?: string;
  size?: number;
}

export function Bike3D({ image, color = "#D4FF3A", size = 180 }: Props) {
  const glow = useSharedValue(0.6);

  useEffect(() => {
    glow.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: glow.value }],
  }));

  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center"
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            width: size * 0.9,
            height: size * 0.9,
            borderRadius: size,
            backgroundColor: color,
          },
          glowStyle,
        ]}
      />
      {image ? (
        <Image
          source={{ uri: image }}
          style={{ width: size * 0.95, height: size * 0.95 }}
          resizeMode="contain"
        />
      ) : (
        <Text style={{ fontSize: size * 0.6 }}>🏍️</Text>
      )}
    </View>
  );
}