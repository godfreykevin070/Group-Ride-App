import { View, Text } from "react-native";
import { Icon } from "./Icon";

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  icon?: keyof typeof import("./Icon").Icons;
  color?: string;
  bg?: string;
}

export function StatTile({ label, value, unit, icon, color = "#F0F3F8", bg = "#151A23" }: Props) {
  return (
    <View style={{ backgroundColor: bg }} className="flex-1 rounded-[20px] border border-white/8 p-4">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-white/35 text-[9px] font-extrabold tracking-widest uppercase">{label}</Text>
        {icon && <Icon name={icon} size={14} color={color} strokeWidth={2.4} />}
      </View>
      <View className="flex-row items-baseline">
        <Text style={{ color }} className="text-[24px] font-black tracking-tighter">{value}</Text>
        {unit && <Text className="text-white/35 text-[11px] font-bold ml-1">{unit}</Text>}
      </View>
    </View>
  );
}