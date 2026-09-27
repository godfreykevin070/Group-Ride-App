import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Message } from "../../constants/types";
import { fmtTime } from "../../lib/format";
import { Icon } from "./Icon";

interface Props {
  message: Message;
  isMe: boolean;
  onPlanPress?: () => void;
  onRsvp?: (joining: boolean) => void;
  userJoined?: boolean;
}

export function ChatBubble({ message, isMe, onPlanPress, onRsvp, userJoined }: Props) {
  const senderName = isMe ? "You" : message.from.split(" ")[0];

  if (message.type === "system") {
    return (
      <View className="items-center my-1">
        <View className="px-3 py-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}>
          <Text className="text-white/35 text-[11px] font-semibold">{message.text}</Text>
        </View>
      </View>
    );
  }

  if (message.type === "ride-plan") {
    return (
      <View className={`max-w-[78%] ${isMe ? "self-end items-end" : "self-start"}`}>
        {!isMe && <Text className="text-primary text-[11px] font-extrabold px-1.5 mb-0.5">{senderName}</Text>}
        <View className="w-[260px] rounded-[20px] border border-white/12 overflow-hidden" style={{ backgroundColor: "#1D242F" }}>
          <View style={{ height: 100 }}>
            {message.cover && (
              <Image source={{ uri: message.cover }} style={{ width: "100%", height: "100%" }} />
            )}
          </View>
          <View className="p-[14px]">
            <Text className="text-primary text-[10px] font-black tracking-wider">RIDE PLAN</Text>
            <Text className="text-white text-[16px] font-black tracking-tight mt-1">{message.title}</Text>
            <View className="flex-row gap-3 mt-2">
              <View className="flex-row items-center gap-1">
                <Icon name="calendar" size={12} color="rgba(240,243,248,0.6)" />
                <Text className="text-white/60 text-[11px] font-bold">{message.dateLabel}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Icon name="route" size={12} color="rgba(240,243,248,0.6)" />
                <Text className="text-white/60 text-[11px] font-bold">{message.distance} km</Text>
              </View>
            </View>
            <View className="flex-row gap-1.5 mt-3.5">
              <View className="flex-1 bg-mint rounded-full py-2 flex-row items-center justify-center gap-1">
                <Icon name="check" size={12} color="#0B0E15" strokeWidth={3} />
                <Text className="text-black text-[12px] font-extrabold">{userJoined ? "Joined" : "I'm in"}</Text>
              </View>
              <View className="flex-1 rounded-full py-2 items-center justify-center" style={{ backgroundColor: "rgba(255,180,84,0.15)" }}>
                <Text className="text-amber text-[12px] font-extrabold">Maybe</Text>
              </View>
            </View>
          </View>
        </View>
        <Text className="text-white/35 text-[10px] font-semibold px-1.5 mt-1">{fmtTime(message.ts)}</Text>
      </View>
    );
  }

  if (message.type === "location") {
    return (
      <View className={`max-w-[78%] ${isMe ? "self-end items-end" : "self-start"}`}>
        {!isMe && <Text className="text-primary text-[11px] font-extrabold px-1.5 mb-0.5">{senderName}</Text>}
        <View className="w-[220px] rounded-[20px] border border-white/12 overflow-hidden" style={{ backgroundColor: "#1D242F" }}>
          <LinearGradient colors={["#1a2028", "#0F131A"]} style={{ height: 100, justifyContent: "center", alignItems: "center" }}>
            <View className="w-5 h-5 rounded-full bg-primary border-[3px] border-white" />
          </LinearGradient>
          <View className="p-3">
            <Text className="text-white text-[12px] font-bold">{message.label || "Shared location"}</Text>
          </View>
        </View>
        <Text className="text-white/35 text-[10px] font-semibold px-1.5 mt-1">{fmtTime(message.ts)}</Text>
      </View>
    );
  }

  return (
    <View className={`max-w-[78%] ${isMe ? "self-end items-end" : "self-start"}`}>
      {!isMe && <Text className="text-primary text-[11px] font-extrabold px-1.5 mb-0.5">{senderName}</Text>}
      <View
        className={`px-3.5 py-2.5 rounded-[18px] ${isMe ? "bg-primary" : "bg-surface-2"}`}
        style={{ borderTopLeftRadius: isMe ? 18 : 6, borderTopRightRadius: isMe ? 6 : 18 }}
      >
        <Text className={`text-[14px] font-medium leading-5 ${isMe ? "text-white" : "text-white"}`}>{message.text}</Text>
      </View>
      <Text className="text-white/35 text-[10px] font-semibold px-1.5 mt-1">{fmtTime(message.ts)}</Text>
    </View>
  );
}