import { Pressable, Text } from "react-native";
import { Icon } from "./Icon";

interface Props {
  label: string;
  icon: keyof typeof import("./Icon").Icons;
  onPress: () => void;
  variant?: "default" | "primary" | "rose" | "mint";
  wide?: boolean;
}

export function SheetAction({ label, icon, onPress, variant = "default", wide }: Props) {
  const bg = variant === "primary" ? "bg-primary" : variant === "rose" ? "bg-rose" : variant === "mint" ? "bg-mint" : "bg-surface-2 border border-white/8";
  const fg = variant === "mint" ? "#0B0E15" : variant === "primary" || variant === "rose" ? "#fff" : "#F0F3F8";
  return (
    <Pressable
      onPress={onPress}
      className={`${bg} rounded-[14px] py-[14px] items-center justify-center flex-row gap-2 ${wide ? "col-span-2" : ""}`}
    >
      <Icon name={icon} size={16} color={fg} strokeWidth={2.6} />
      <Text style={{ color: fg }} className="text-[13px] font-extrabold">{label}</Text>
    </Pressable>
  );
}