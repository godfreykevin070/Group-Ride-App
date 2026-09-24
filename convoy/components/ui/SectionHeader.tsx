import { View, Text, Pressable } from "react-native";
import { ChevronRight } from "lucide-react-native";

interface Props {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: Props) {
  return (
    <View className="mx-4 mt-8 mb-4 flex-row items-center justify-between">
      <Text
        className="text-white text-[22px]"
        style={{ fontWeight: "900", letterSpacing: -0.6 }}
      >
        {title}
      </Text>
      {action && (
        <Pressable onPress={onAction} className="flex-row items-center">
          <Text
            className="text-[#D4FF3A] text-[13px]"
            style={{ fontWeight: "800" }}
          >
            {action}
          </Text>
          <ChevronRight size={16} color="#D4FF3A" strokeWidth={2.6} />
        </Pressable>
      )}
    </View>
  );
}