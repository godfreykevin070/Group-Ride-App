import { View, Text } from "react-native";
import { Icon } from "./Icon";

interface Props {
  icon: keyof typeof import("./Icon").Icons;
  title: string;
  text: string;
}

export function EmptyState({ icon, title, text }: Props) {
  return (
    <View className="px-10 py-16 items-center">
      <View className="w-20 h-20 rounded-full bg-surface border border-white/8 items-center justify-center mb-5">
        <Icon name={icon} size={32} color="rgba(240,243,248,0.35)" />
      </View>
      <Text className="text-white text-[18px] font-extrabold tracking-tight text-center">{title}</Text>
      <Text className="text-white/60 text-[13px] mt-2 leading-5 text-center">{text}</Text>
    </View>
  );
}