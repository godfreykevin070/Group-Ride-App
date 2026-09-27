import { Pressable, Text } from "react-native";

interface Props {
  label: string;
  onPress: () => void;
  icon?: keyof typeof import("./Icon").Icons;
}

export function GhostButton({ label, onPress, icon }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="py-[14px] rounded-full border border-white/10 items-center justify-center flex-row gap-2"
    >
      {icon && <Icon name={icon} size={16} color="#F0F3F8" />}
      <Text className="text-white text-[14px] font-bold">{label}</Text>
    </Pressable>
  );
}

import { Icon } from "./Icon";