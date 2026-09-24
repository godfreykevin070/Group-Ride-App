import { View, Text, Pressable, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Sparkles, User } from "lucide-react-native";
import { GRADIENTS } from "../../constants/theme";

interface Props {
  title: string;
  subtitle: string;
  variant?: "emerald" | "pink" | "purple" | "orange";
  showAvatar?: boolean;
  avatarUri?: string;
}

const GRAD_MAP = {
  emerald: GRADIENTS.emerald,
  pink: GRADIENTS.pink,
  purple: GRADIENTS.purple,
  orange: GRADIENTS.orange,
};

export function PillHeader({
  title,
  subtitle,
  variant = "emerald",
  showAvatar = true,
  avatarUri,
}: Props) {
  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify()}
      className="px-4 pt-3 pb-4"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <View className="rounded-full overflow-hidden">
            <LinearGradient
              colors={GRAD_MAP[variant]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <View className="w-9 h-9 rounded-full bg-black/25 items-center justify-center mr-3">
                <Sparkles size={18} color="#fff" strokeWidth={2.6} />
              </View>
              <View className="flex-1">
                <Text
                  className="text-white text-[17px]"
                  style={{ fontWeight: "900", letterSpacing: -0.3 }}
                >
                  {title}
                </Text>
                <Text
                  className="text-white/85 text-[12px] mt-0.5"
                  style={{ fontWeight: "600" }}
                >
                  {subtitle}
                </Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {showAvatar && (
          <Pressable
            className="w-11 h-11 rounded-full bg-white/8 border border-white/15 items-center justify-center overflow-hidden"
            style={{
              shadowColor: "#fff",
              shadowOpacity: 0.15,
              shadowRadius: 12,
            }}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} className="w-full h-full" />
            ) : (
              <User size={20} color="#fff" strokeWidth={2.4} />
            )}
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}