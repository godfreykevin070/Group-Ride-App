import { View, Text, Pressable } from "react-native";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";
import { Friend } from "../../constants/types";

interface Props {
  friend: Friend;
  rides?: number;
  km?: number;
  rank?: number;
  onPress?: () => void;
  trailing?: React.ReactNode;
}

export function FriendRow({ friend, rides, km, rank, onPress, trailing }: Props) {
  const rankStyle = rank === 1 ? "bg-gradient-to-br from-yellow-400 to-yellow-700 text-black"
    : rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-500 text-black"
    : rank === 3 ? "bg-gradient-to-br from-orange-400 to-orange-800 text-white"
    : "bg-surface-2 text-white/60";

  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 px-4 py-[14px] border-b border-white/4 last:border-b-0">
      {rank && (
        <View className={`w-7 h-7 rounded-full items-center justify-center ${rankStyle}`}>
          <Text className="text-[13px] font-black">{rank}</Text>
        </View>
      )}
      <Avatar person={friend} size={48} showStatus />
      <View className="flex-1 min-w-0">
        <Text className="text-white text-[15px] font-extrabold tracking-tight" numberOfLines={1}>{friend.name}</Text>
        {rides !== undefined && (
          <Text className="text-white/35 text-[12px] mt-0.5">{rides} ride{rides === 1 ? "" : "s"} · {(km ?? 0).toLocaleString()} km</Text>
        )}
      </View>
      {km !== undefined && (
        <View className="items-end">
          <Text className="text-mint text-[15px] font-black tracking-tight">{(km || 0).toLocaleString()}</Text>
          <Text className="text-white/35 text-[9px] font-bold tracking-widest uppercase mt-0.5">KM</Text>
        </View>
      )}
      {trailing}
    </Pressable>
  );
}