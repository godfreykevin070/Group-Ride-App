import { Pressable, View, Text, Image } from "react-native";
import { Club } from "../../constants/types";
import { fmtTime } from "../../lib/format";
import { useApp } from "../../context/AppContext";
import { Icon } from "./Icon";

interface Props {
  club: Club;
  onPress: () => void;
}

const isImage = (s?: string) =>
  !!s &&
  (s.startsWith("http") || s.startsWith("file://") || s.startsWith("data:") || s.startsWith("content://"));

export function ClubRow({ club, onPress }: Props) {
  const { state } = useApp();
  const last = club.messages[club.messages.length - 1];
  const memberCount = club.memberIds.length + 1;
  const preview = last
    ? `${last.from === state.user?.name ? "You" : last.from.split(" ")[0]}: ${(last.text || "Shared a location").slice(0, 50)}`
    : "No messages yet";
  const time = last ? fmtTime(last.ts) : fmtTime(club.createdAt);

  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 p-[14px] rounded-[14px] active:bg-white/5">
      <View
        className="w-[54px] h-[54px] rounded-[16px] items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#1D242F" }}
      >
        {isImage(club.emoji) ? (
          <Image source={{ uri: club.emoji }} style={{ width: "100%", height: "100%" }} />
        ) : (
          <Icon name={club.emoji} size={26} color="#FF7B6B" strokeWidth={2.2} />
        )}
      </View>
      <View className="flex-1 min-w-0">
        <View className="flex-row items-center gap-2">
          <Text className="text-white text-[15px] font-extrabold tracking-tight flex-shrink" numberOfLines={1}>
            {club.name}
          </Text>
          <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(255,123,107,0.15)" }}>
            <Text className="text-primary text-[9px] font-black tracking-wider">{memberCount}</Text>
          </View>
        </View>
        <Text className="text-white/60 text-[13px] mt-1" numberOfLines={1}>
          {preview}
        </Text>
      </View>
      <View className="items-end gap-1.5">
        <Text className="text-white/35 text-[11px] font-semibold">{time}</Text>
        {club.unread > 0 && (
          <View className="min-w-[22px] h-[22px] rounded-full bg-primary items-center justify-center px-1.5">
            <Text className="text-white text-[11px] font-extrabold">{club.unread}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}