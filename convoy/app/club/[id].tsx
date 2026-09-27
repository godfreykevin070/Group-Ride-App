import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../../src/context/AppContext";
import { Icon } from "../../src/components/ui/Icon";
import { ChatBubble } from "../../src/components/ui/ChatBubble";

/** True when a string looks like an image URI rather than a lucide icon name. */
const isImageUri = (s?: string) =>
  !!s &&
  (s.startsWith("http") ||
    s.startsWith("https") ||
    s.startsWith("file://") ||
    s.startsWith("data:") ||
    s.startsWith("content://"));

export default function ClubChat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state, sendMessage, markClubRead, updateRide, toast } = useApp();
  const [text, setText] = useState("");
  const scrollRef = useRef<ScrollView>(null);
  const club = state.clubs.find((c) => c.id === id);

  useEffect(() => {
    if (club) markClubRead(club.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [club?.id]);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [club?.messages.length]);

  if (!club) return null;

  const memberCount = club.memberIds.length + 1;
  const hasImageIcon = isImageUri(club.emoji);

  const send = () => {
    if (!text.trim()) return;
    sendMessage(club.id, { text: text.trim() });
    setText("");
  };

  const rsvp = (rideId: string) => {
    const ride = state.rides.find((r) => r.id === rideId);
    if (!ride || !state.user) return;
    if (!ride.riders.includes(state.user.name)) {
      updateRide(rideId, { riders: [...ride.riders, state.user.name] });
      toast("You joined the ride");
    } else toast("Already joined");
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {/* ============ HEADER ============ */}
        <View className="flex-row items-center gap-3 px-4 py-3 border-b border-white/8 bg-surface">
          <Pressable
            onPress={() => router.back()}
            className="w-[38px] h-[38px] rounded-full bg-white/5 items-center justify-center"
          >
            <Icon name="back" size={18} />
          </Pressable>

          {/* Club icon — image OR lucide icon */}
          <View
            className="w-10 h-10 rounded-[12px] items-center justify-center overflow-hidden"
            style={{ backgroundColor: "#1D242F" }}
          >
            {hasImageIcon ? (
              <Image
                source={{ uri: club.emoji }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <Icon name={club.emoji} size={20} color="#FF7B6B" strokeWidth={2.2} />
            )}
          </View>

          <View className="flex-1 min-w-0">
            <Text
              className="text-white text-[15px] font-extrabold tracking-tight"
              numberOfLines={1}
            >
              {club.name}
            </Text>
            <Text className="text-white/60 text-[11px]">
              {memberCount} member{memberCount === 1 ? "" : "s"}
            </Text>
          </View>

          <Pressable
            onPress={() => router.push(`/club/${club.id}/members`)}
            className="w-[38px] h-[38px] rounded-full bg-white/5 items-center justify-center"
          >
            <Icon name="userPlus" size={18} />
          </Pressable>
          <Pressable
            onPress={() => router.push("/plan-ride")}
            className="w-[38px] h-[38px] rounded-full bg-white/5 items-center justify-center"
          >
            <Icon name="calendarPlus" size={18} />
          </Pressable>
        </View>

        {/* ============ MESSAGES ============ */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          keyboardShouldPersistTaps="handled"
        >
          {club.messages.map((m) => (
            <ChatBubble
              key={m.id}
              message={m}
              isMe={m.from === state.user?.name}
              userJoined={
                m.rideId
                  ? state.rides
                      .find((r) => r.id === m.rideId)
                      ?.riders.includes(state.user?.name || "") ?? false
                  : false
              }
              onRsvp={() => m.rideId && rsvp(m.rideId)}
              onPlanPress={() => m.rideId && router.push(`/ride/${m.rideId}`)}
            />
          ))}
        </ScrollView>

        {/* ============ COMPOSER ============ */}
        <View className="flex-row items-center gap-2 px-4 py-3 border-t border-white/8 bg-surface">
          <Pressable
            onPress={() => router.push("/plan-ride")}
            className="w-10 h-10 rounded-full bg-white/5 items-center justify-center"
          >
            <Icon name="plus" size={20} color="#FF7B6B" strokeWidth={2.6} />
          </Pressable>
          <TextInput
            value={text}
            onChangeText={setText}
            onSubmitEditing={send}
            placeholder="Message"
            placeholderTextColor="rgba(240,243,248,0.35)"
            className="flex-1 bg-surface-2 border border-white/8 rounded-full px-4 py-3 text-white text-[14px]"
          />
          <Pressable
            onPress={send}
            className="w-10 h-10 rounded-full bg-primary items-center justify-center"
          >
            <Icon name="send" size={18} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}