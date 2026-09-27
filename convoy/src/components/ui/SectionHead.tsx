import { View, Text, Pressable } from "react-native";
import { Icon } from "./Icon";

interface Props {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHead({ title, action, onAction }: Props) {
  return (
    <View className="px-5 pt-6 pb-3 flex-row items-center justify-between">
      <Text className="text-white text-[17px] font-black tracking-tight">{title}</Text>
      {action && (
        <Pressable onPress={onAction} className="flex-row items-center gap-1">
          <Text className="text-primary text-[12px] font-extrabold">{action}</Text>
          <Icon name="chevronRight" size={14} color="#FF7B6B" strokeWidth={2.6} />
        </Pressable>
      )}
    </View>
  );
}