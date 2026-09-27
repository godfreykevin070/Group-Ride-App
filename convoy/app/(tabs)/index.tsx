import { View, Text, Pressable, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "../../src/components/layout/ScreenContainer";
import { Avatar } from "../../src/components/ui/Avatar";
import { Icon } from "../../src/components/ui/Icon";
import { SectionHead } from "../../src/components/ui/SectionHead";
import { SheetAction } from "../../src/components/ui/SheetAction";
import { useApp } from "../../src/context/AppContext";
import { Ride } from "../../src/constants/types";

export default function Home() {
  const router = useRouter();
  const { state } = useApp();
  const user = state.user;

  const upcoming = useMemo(
    () =>
      state.rides
        .filter((r) => r.status === "upcoming" && !!user && r.riders.includes(user.name))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0],
    [state.rides, user?.name]
  );

  const active = useMemo(
    () => state.rides.find((r) => r.id === state.activeRideId && r.status === "active"),
    [state.rides, state.activeRideId]
  );

  if (!user) return null;

  const greeting = active
    ? "Live ride in progress"
    : upcoming
    ? "Ride day is close"
    : `Hey, ${user.name.split(" ")[0]}`;

  const titleNode = active ? (
    <Text className="text-white text-[28px] font-black tracking-tighter leading-8">
      You're <Text className="text-primary">riding</Text>
    </Text>
  ) : upcoming ? (
    <Text className="text-white text-[28px] font-black tracking-tighter leading-8">
      Next: <Text className="text-primary">{upcoming.title}</Text>
    </Text>
  ) : state.friends.length === 0 ? (
    <Text className="text-white text-[28px] font-black tracking-tighter leading-8">
      Let's find your <Text className="text-primary">crew</Text>
    </Text>
  ) : (
    <Text className="text-white text-[28px] font-black tracking-tighter leading-8">
      Ready to <Text className="text-primary">ride</Text>?
    </Text>
  );

  const topFriends = state.friends.slice(0, 3);
  const hasMoreFriends = state.friends.length > 3;
  const hasFriends = state.friends.length > 0;

  return (
    <ScreenContainer>
      {/* ============================================================ */}
      {/* HEADER                                                       */}
      {/* ============================================================ */}
      <View className="px-5 pt-3 pb-2 flex-row items-start justify-between gap-3">
        <View className="flex-1 min-w-0">
          <Text className="text-white/60 text-[13px] font-semibold">{greeting}</Text>
          <View className="mt-1">{titleNode}</View>
        </View>
        <Pressable onPress={() => router.push("/(tabs)/profile")}>
          <Avatar person={user} size={44} />
        </Pressable>
      </View>

      {/* ============================================================ */}
      {/* ACTIVE RIDE — pinned above everything (safety-critical)      */}
      {/* ============================================================ */}
      {active && <ActiveHero ride={active} onPress={() => router.push("/ride/live")} />}
      {active && <ConvoyStrip />}

      {/* ============================================================ */}
      {/* 1. INVITE FRIENDS — always visible, FIRST                    */}
      {/* ============================================================ */}
      <View className="px-5 pt-4">
        <Pressable
          onPress={() => router.push("/invite")}
          className="rounded-[20px] p-4 flex-row items-center gap-3"
          style={{
            backgroundColor: "rgba(255,123,107,0.08)",
            borderWidth: 1,
            borderColor: "rgba(255,123,107,0.2)",
          }}
        >
          <View
            className="w-11 h-11 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(255,123,107,0.18)" }}
          >
            <Icon name="userPlus" size={20} color="#FF7B6B" strokeWidth={2.6} />
          </View>
          <View className="flex-1 min-w-0">
            <Text className="text-white text-[15px] font-extrabold">
              Invite friends
            </Text>
            <Text className="text-white/45 text-[11px] mt-0.5">
              Share your QR · Grow your convoy
            </Text>
          </View>
          <Icon name="chevronRight" size={18} color="#FF7B6B" />
        </Pressable>
      </View>

      {/* ============================================================ */}
      {/* 2. YOUR CREW — top 3 friends + See all                       */}
      {/* ============================================================ */}
      <SectionHead
        title={hasFriends ? `Your crew · ${state.friends.length}` : "Your crew"}
        action={hasMoreFriends ? "See all" : undefined}
        onAction={hasMoreFriends ? () => router.push("/(tabs)/friends") : undefined}
      />

      {hasFriends ? (
        <View className="mx-5 bg-surface border border-white/8 rounded-[20px] overflow-hidden">
          {topFriends.map((f, i) => {
            const done = state.rides.filter(
              (r) => r.status === "completed" && r.riders.includes(f.name)
            );
            const km = done.reduce((s, r) => s + (r.distance || 0), 0);
            return (
              <Pressable
                key={f.id}
                onPress={() => router.push("/(tabs)/friends")}
                className={`flex-row items-center gap-3 px-4 py-[14px] ${
                  i < topFriends.length - 1 || hasMoreFriends
                    ? "border-b border-white/4"
                    : ""
                }`}
              >
                <Avatar person={f} size={44} showStatus />
                <View className="flex-1 min-w-0">
                  <Text
                    className="text-white text-[15px] font-extrabold tracking-tight"
                    numberOfLines={1}
                  >
                    {f.name}
                  </Text>
                  <Text className="text-white/40 text-[12px] mt-0.5">
                    {done.length} ride{done.length === 1 ? "" : "s"} ·{" "}
                    {km.toLocaleString()} km
                  </Text>
                </View>
                <View
                  className="px-2 py-1 rounded-full"
                  style={{ backgroundColor: "rgba(124,229,176,0.12)" }}
                >
                  <Text className="text-mint text-[10px] font-black tracking-wider">
                    ONLINE
                  </Text>
                </View>
              </Pressable>
            );
          })}

          {/* See more row */}
          {hasMoreFriends && (
            <Pressable
              onPress={() => router.push("/(tabs)/friends")}
              className="flex-row items-center gap-3 px-4 py-[14px]"
            >
              <View
                className="w-11 h-11 rounded-full items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <Icon name="users" size={18} color="rgba(240,243,248,0.7)" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-[14px] font-extrabold">
                  See all {state.friends.length} friends
                </Text>
                <Text className="text-white/40 text-[11px] mt-0.5">
                  +{state.friends.length - 3} more
                </Text>
              </View>
              <Icon name="chevronRight" size={16} color="rgba(240,243,248,0.4)" />
            </Pressable>
          )}
        </View>
      ) : (
        <View
          className="mx-5 rounded-[20px] p-4"
          style={{
            backgroundColor: "rgba(109,213,237,0.08)",
            borderWidth: 1,
            borderColor: "rgba(109,213,237,0.15)",
          }}
        >
          <Text className="text-white/60 text-[13px] font-medium leading-5">
            Your crew is empty. Tap{" "}
            <Text className="text-primary font-bold">Invite friends</Text> above to
            get started.
          </Text>
        </View>
      )}

      {/* ============================================================ */}
      {/* 3. PLAN A RIDE — always visible                              */}
      {/* ============================================================ */}
      <SectionHead
        title={upcoming ? "Plan another ride" : "Plan a ride"}
        action="See all"
        onAction={() => router.push("/(tabs)/rides")}
      />
      <Pressable
        onPress={() => router.push("/plan-ride")}
        className="mx-5 mt-1 rounded-[26px] p-5"
        style={{
          backgroundColor: "rgba(255,123,107,0.12)",
          borderWidth: 1,
          borderColor: "rgba(255,123,107,0.2)",
        }}
      >
        <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase">
          {upcoming ? "It's a good day for another" : "It's a good day for it"}
        </Text>
        <Text className="text-white text-[24px] font-black tracking-tight mt-2 leading-7">
          {upcoming ? "Start a new ride plan" : "Plan your next ride"}
        </Text>
        <Text className="text-white/60 text-[13px] font-medium mt-2 leading-5">
          Pick a start, destination, and checkpoints. Everyone in your crew gets live
          tracking.
        </Text>
        <View className="self-start mt-4 bg-primary rounded-full px-5 py-3 flex-row items-center gap-2">
          <Icon name="plus" size={16} color="#fff" strokeWidth={2.8} />
          <Text className="text-white text-[14px] font-extrabold">
            Create ride plan
          </Text>
        </View>
      </Pressable>

      {/* ============================================================ */}
      {/* 4. UPCOMING RIDE                                             */}
      {/* ============================================================ */}
      {!active && upcoming && (
        <UpcomingHero
          ride={upcoming}
          onPress={() => router.push(`/ride/${upcoming.id}`)}
        />
      )}

      {/* ============================================================ */}
      {/* QUICK ACTIONS — only during an active ride                   */}
      {/* ============================================================ */}
      {active && (
        <>
          <SectionHead title="Quick actions" />
          <View className="px-5 flex-row flex-wrap gap-2.5">
            <View className="w-[48%]">
              <SheetAction
                label="Open map"
                icon="map"
                onPress={() => router.push("/ride/live")}
              />
            </View>
            <View className="w-[48%]">
              <SheetAction
                label="Club chat"
                icon="chat"
                onPress={() => router.push("/(tabs)/clubs")}
              />
            </View>
            <View className="w-full">
              <SheetAction
                label="End ride"
                icon="flag"
                variant="rose"
                onPress={() => router.push("/ride/live")}
              />
            </View>
          </View>
        </>
      )}
    </ScreenContainer>
  );
}

/* ================================================================ */
/*  ACTIVE HERO                                                     */
/* ================================================================ */
function ActiveHero({ ride, onPress }: { ride: Ride; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="mx-5 mt-4 rounded-[26px] overflow-hidden"
      style={{ height: 220 }}
    >
      <ImageBackground
        source={{ uri: ride.cover }}
        style={{ width: "100%", height: "100%" }}
      >
        <LinearGradient
          colors={["rgba(11,14,21,0.05)", "rgba(11,14,21,0.6)", "rgba(11,14,21,0.98)"]}
          style={{ flex: 1, padding: 20, justifyContent: "flex-end" }}
        >
          <View className="flex-row gap-2 absolute top-4 left-4 right-4">
            <View className="bg-primary rounded-full px-3 py-1.5 flex-row items-center gap-1.5">
              <View className="w-1.5 h-1.5 rounded-full bg-white" />
              <Text className="text-white text-[10px] font-black tracking-wider">
                LIVE
              </Text>
            </View>
            <View
              className="rounded-full px-3 py-1.5"
              style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            >
              <Text className="text-white text-[10px] font-black tracking-wider">
                RIDING NOW
              </Text>
            </View>
          </View>
          <Text className="text-white text-[30px] font-black tracking-tighter leading-8">
            {ride.title}
          </Text>
          <View className="flex-row items-center gap-3.5 mt-2.5">
            <View className="flex-row items-center gap-1.5">
              <Icon name="route" size={14} color="rgba(240,243,248,0.6)" />
              <Text className="text-white/60 text-[13px] font-semibold">
                {ride.from.name} → {ride.to.name}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}

/* ================================================================ */
/*  UPCOMING HERO                                                   */
/* ================================================================ */
function UpcomingHero({ ride, onPress }: { ride: Ride; onPress: () => void }) {
  const diff = new Date(ride.date).getTime() - Date.now();
  const hours = Math.max(0, Math.floor(diff / 3600000));
  const mins = Math.max(0, Math.floor((diff % 3600000) / 60000));

  return (
    <>
      <SectionHead title="Upcoming ride" action="Details" onAction={onPress} />
      <Pressable
        onPress={onPress}
        className="mx-5 rounded-[26px] overflow-hidden"
        style={{ height: 260 }}
      >
        <ImageBackground
          source={{ uri: ride.cover }}
          style={{ width: "100%", height: "100%" }}
        >
          <LinearGradient
            colors={["rgba(11,14,21,0.05)", "rgba(11,14,21,0.6)", "rgba(11,14,21,0.98)"]}
            style={{ flex: 1, padding: 20, justifyContent: "flex-end" }}
          >
            <View className="flex-row gap-2 absolute top-4 left-4 right-4">
              <View className="bg-primary rounded-full px-3 py-1.5 flex-row items-center gap-1.5">
                <View className="w-1.5 h-1.5 rounded-full bg-white" />
                <Text className="text-white text-[10px] font-black tracking-wider">
                  In {hours}h {mins}m
                </Text>
              </View>
              <View
                className="rounded-full px-3 py-1.5"
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
              >
                <Text className="text-white text-[10px] font-black tracking-wider">
                  {ride.difficulty.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text className="text-white text-[30px] font-black tracking-tighter leading-8">
              {ride.title}
            </Text>
            <View className="flex-row items-center gap-3.5 mt-2.5">
              <View className="flex-row items-center gap-1.5">
                <Icon name="pin" size={14} color="rgba(240,243,248,0.6)" />
                <Text className="text-white/60 text-[13px] font-semibold">
                  {ride.from.name} → {ride.to.name}
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Icon name="route" size={14} color="rgba(240,243,248,0.6)" />
                <Text className="text-white/60 text-[13px] font-semibold">
                  {ride.distance} km
                </Text>
              </View>
            </View>
            <View
              className="mt-3.5 p-3.5 rounded-[14px] flex-row items-center justify-between"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <View>
                <Text className="text-white/60 text-[11px] font-bold tracking-wider">
                  DEPARTS IN
                </Text>
                <View className="flex-row gap-3.5 mt-1">
                  <View className="items-center">
                    <Text className="text-primary text-[22px] font-black tracking-tighter">
                      {String(hours).padStart(2, "0")}
                    </Text>
                    <Text className="text-white/35 text-[9px] font-bold tracking-wider">
                      HRS
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-primary text-[22px] font-black tracking-tighter">
                      {String(mins).padStart(2, "0")}
                    </Text>
                    <Text className="text-white/35 text-[9px] font-bold tracking-wider">
                      MIN
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex-row">
                {ride.riders.slice(0, 3).map((n) => (
                  <View
                    key={n}
                    className="w-[30px] h-[30px] rounded-full border-2 border-black/90 items-center justify-center -ml-2.5 first:ml-0"
                    style={{ backgroundColor: "#252E3C" }}
                  >
                    <Text className="text-white text-[10px] font-black">{n[0]}</Text>
                  </View>
                ))}
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </Pressable>
    </>
  );
}

/* ================================================================ */
/*  CONVOY STRIP (only during active ride)                          */
/* ================================================================ */
function ConvoyStrip() {
  const { state } = useApp();
  const ride = state.rides.find((r) => r.id === state.activeRideId);
  if (!ride) return null;
  const names = Object.keys(ride.riderPositions || {});

  return (
    <>
      <SectionHead title="Convoy status" />
      <View className="mx-5 bg-surface border border-white/8 rounded-[20px] p-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white text-[14px] font-extrabold">
            {names.length} rider{names.length === 1 ? "" : "s"} active
          </Text>
          <View className="flex-row items-center gap-1.5">
            <View className="w-1.5 h-1.5 rounded-full bg-mint" />
            <Text className="text-mint text-[11px] font-bold">Live</Text>
          </View>
        </View>
        <View className="flex-row flex-wrap gap-3">
          {names.map((n) => (
            <View key={n} className="items-center gap-1.5 w-[60px]">
              <Avatar
                person={{ name: n, avatar: "" }}
                size={52}
                borderColor={
                  n === ride.headName
                    ? "#FFB454"
                    : n === ride.tailName
                    ? "#FF5C7A"
                    : "#7CE5B0"
                }
              />
              <Text
                className="text-white/60 text-[11px] font-bold"
                numberOfLines={1}
              >
                {n.split(" ")[0]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}