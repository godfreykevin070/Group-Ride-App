import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { View, Text, Pressable, Linking } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../../src/context/AppContext";
import { LiveMap, LiveMapHandle } from "../../src/components/map/LiveMap";
import { Icon } from "../../src/components/ui/Icon";
import { geo, GeoFix } from "../../src/lib/geo";
import { fetchRoute, buildCumulative, pointAtKm } from "../../src/lib/routing";
import { haversine } from "../../src/lib/format";
import { currentStepIndex, iconForStep, fmtDistance, fmtEta } from "../../src/lib/navigation";
import {
  HEAD_SLOW_KM, TAIL_CATCHUP_KM, NOTIFY_COOLDOWN_MS, CHECKPOINT_RADIUS_KM, SIM_RIDER_COUNT,
} from "../../src/constants/presets";
import * as ImagePicker from "expo-image-picker";

const SHEET_COLLAPSED = 200;
const SHEET_EXPANDED = 520;

export default function LiveRide() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, updateRide, endRide, addJournal, showBanner, toast, setRidePaused } = useApp();
  const ride = state.rides.find((r) => r.id === state.activeRideId);
  const mapRef = useRef<LiveMapHandle>(null);

  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [gps, setGps] = useState<GeoFix | null>(null);
  const [etaMin, setEtaMin] = useState<string>("--");
  const [sub, setSub] = useState("Calculating route…");
  const [routeReady, setRouteReady] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [nearCheckpoint, setNearCheckpoint] = useState<{ id: string; name: string } | null>(null);
  const [followMode, setFollowMode] = useState(true);

  const sheetH = sheetExpanded ? SHEET_EXPANDED : SHEET_COLLAPSED;
  const toggleSheet = () => setSheetExpanded((v) => !v);

  /* -------- Route + geolocation init -------- */
  useEffect(() => {
    if (!ride) return;
    let mounted = true;

    (async () => {
      const route = await fetchRoute(ride.from, ride.to);
      if (!mounted) return;
      if (route) {
        const cum = buildCumulative(route.coords);
        updateRide(ride.id, {
          routeData: { coords: route.coords, cum, steps: route.steps },
        });
        setEtaMin(Math.round(route.duration / 60).toString());
        setSub(`${ride.from.name} → ${ride.to.name} · ${(route.distance / 1000).toFixed(1)} km`);
        setRouteReady(true);

        const sims = state.friends.slice(0, SIM_RIDER_COUNT).map((f, i) => ({
          name: f.name, avatar: f.avatar,
          speedKmh: 42 + Math.random() * 15,
          progressKm: 1 + i * 3,
        }));
        const positions: any = { ...ride.riderPositions };
        sims.forEach((s) => {
          const pt = pointAtKm(route.coords, cum, s.progressKm);
          positions[s.name] = { lat: pt.lat, lng: pt.lng, ts: Date.now(), progressKm: s.progressKm, simulated: true };
        });
        updateRide(ride.id, { simulatedRiders: sims, riderPositions: positions });
      } else {
        setSub(`${ride.from.name} → ${ride.to.name}`);
      }
    })();

    geo.start();
    const unsub = geo.subscribe((fix) => {
      if (!fix) return;
      setGps(fix);
      mapRef.current?.post({ type: "me", lat: fix.latitude, lng: fix.longitude });

      const r = state.rides.find((x) => x.id === state.activeRideId);
      if (!r) return;

      let progressKm = 0;
      if (r.routeData) {
        let best = Infinity;
        for (let i = 0; i < r.routeData.coords.length; i += 8) {
          const d = haversine(
            { lat: fix.latitude, lng: fix.longitude },
            { lat: r.routeData.coords[i][0], lng: r.routeData.coords[i][1] }
          );
          if (d < best) { best = d; progressKm = r.routeData.cum[i]; }
        }
      }
      updateRide(r.id, {
        riderPositions: {
          ...(r.riderPositions || {}),
          [state.user!.name]: { lat: fix.latitude, lng: fix.longitude, ts: Date.now(), progressKm, simulated: false },
        },
      });
    });

    return () => { unsub(); geo.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ride?.id]);

  /* -------- Push route to map -------- */
  useEffect(() => {
    if (!mapReady || !routeReady) return;
    const r = state.rides.find((x) => x.id === state.activeRideId);
    if (r?.routeData) mapRef.current?.post({ type: "route", coords: r.routeData.coords });
  }, [mapReady, routeReady, state.activeRideId]);

  /* -------- Push riders to map -------- */
  useEffect(() => {
    if (!mapReady || !ride) return;
    mapRef.current?.post({
      type: "riders",
      positions: ride.riderPositions || {},
      headName: ride.headName,
      tailName: ride.tailName,
    });
  }, [mapReady, ride?.riderPositions, ride?.headName, ride?.tailName]);

  /* -------- Simulated riders tick -------- */
  useEffect(() => {
    if (!routeReady || !ride?.routeData || ride.paused) return;
    const interval = setInterval(() => {
      const r = state.rides.find((x) => x.id === state.activeRideId);
      if (!r?.routeData || !r.simulatedRiders || r.paused) return;
      const { coords, cum } = r.routeData;
      const total = cum[cum.length - 1];
      const newPositions = { ...(r.riderPositions || {}) };
      const newSims = r.simulatedRiders.map((s) => {
        const newProgress = Math.min(total, s.progressKm + (s.speedKmh * 2) / 3600);
        const pt = pointAtKm(coords, cum, newProgress);
        newPositions[s.name] = { lat: pt.lat, lng: pt.lng, ts: Date.now(), progressKm: newProgress, simulated: true };
        return { ...s, progressKm: newProgress };
      });
      updateRide(r.id, { simulatedRiders: newSims, riderPositions: newPositions });
    }, 2000);
    return () => clearInterval(interval);
  }, [routeReady, ride?.id, state.activeRideId, updateRide, ride?.paused]);

  /* -------- Head/tail detection -------- */
  useEffect(() => {
    if (!ride || ride.paused) return;
    const positions = ride.riderPositions || {};
    const entries = Object.entries(positions).filter(([, p]) => p.progressKm != null);
    if (entries.length >= 2) {
      const sorted = entries.map(([name, p]) => ({ name, progress: p.progressKm })).sort((a, b) => b.progress - a.progress);
      const head = sorted[0], second = sorted[1], tail = sorted[sorted.length - 1], secondLast = sorted[sorted.length - 2];

      if (ride.headName !== head.name || ride.tailName !== tail.name) {
        updateRide(ride.id, { headName: head.name, tailName: tail.name });
      }
      if (head.progress - second.progress > HEAD_SLOW_KM && head.name === state.user!.name) {
        const cooldown = ride.notifications?.find((n) => n.to === head.name && n.type === "slow_down" && Date.now() - n.ts < NOTIFY_COOLDOWN_MS);
        if (!cooldown) {
          showBanner({ title: "Slow down", sub: `You're ${(head.progress - second.progress).toFixed(1)} km ahead`, variant: "amber" });
          updateRide(ride.id, { notifications: [...(ride.notifications || []), { id: Math.random().toString(36).slice(2), to: head.name, type: "slow_down", msg: "", ts: Date.now() }] });
        }
      }
      if (secondLast.progress - tail.progress > TAIL_CATCHUP_KM && tail.name === state.user!.name) {
        const cooldown = ride.notifications?.find((n) => n.to === tail.name && n.type === "catch_up" && Date.now() - n.ts < NOTIFY_COOLDOWN_MS);
        if (!cooldown) {
          showBanner({ title: "Catch up", sub: `You're ${(secondLast.progress - tail.progress).toFixed(1)} km behind`, variant: "rose" });
          updateRide(ride.id, { notifications: [...(ride.notifications || []), { id: Math.random().toString(36).slice(2), to: tail.name, type: "catch_up", msg: "", ts: Date.now() }] });
        }
      }
    }

    const me = positions[state.user!.name];
    if (me && ride.checkpoints.length) {
      const near = ride.checkpoints.find((cp) => cp.lat && cp.lng && haversine(me, { lat: cp.lat, lng: cp.lng }) < CHECKPOINT_RADIUS_KM);
      setNearCheckpoint(near ? { id: near.id, name: near.name } : null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ride?.riderPositions, ride?.headName, ride?.tailName, ride?.paused]);

  /* -------- Follow user when in follow mode -------- */
  useEffect(() => {
    if (!followMode || !gps) return;
    mapRef.current?.post({ type: "follow", lat: gps.latitude, lng: gps.longitude });
  }, [followMode, gps?.latitude, gps?.longitude]);

  /* -------- Compute current navigation step -------- */
  const navInfo = useMemo(() => {
    if (!ride?.routeData?.steps?.length) return null;
    const me = ride.riderPositions?.[state.user!.name];
    const progressKm = me?.progressKm ?? 0;
    const idx = currentStepIndex(ride.routeData.steps, progressKm);
    const step = ride.routeData.steps[idx];
    const next = ride.routeData.steps[idx + 1];

    // Distance to next turn
    const nextKm = next?.cumStartKm ?? ride.routeData.cum[ride.routeData.cum.length - 1];
    const distanceToTurnM = Math.max(0, (nextKm - progressKm) * 1000);

    // Remaining time estimate
    const totalKm = ride.routeData.cum[ride.routeData.cum.length - 1];
    const remainingKm = Math.max(0, totalKm - progressKm);
    const totalDuration = ride.routeData.steps.reduce((s, st) => s + st.duration, 0);
    const remainingSec = totalKm > 0 ? (remainingKm / totalKm) * totalDuration : 0;

    return {
      instruction: next ? next.instruction : step.instruction,
      maneuver: next ? next.maneuver : step.maneuver,
      modifier: next ? next.modifier : step.modifier,
      road: next ? next.road : step.road,
      distanceToTurnM,
      eta: fmtEta(remainingSec),
      remainingKm,
    };
  }, [ride?.routeData, ride?.riderPositions, state.user?.name]);

  /* -------- Actions -------- */
  const captureMedia = useCallback(async () => {
    if (!ride) return;
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"],
      quality: 0.6,
      videoMaxDuration: 30,
    });
    if (res.canceled || !res.assets?.length) return;
    const asset = res.assets[0];
    addJournal(ride.id, {
      id: Math.random().toString(36).slice(2, 11),
      checkpointId: nearCheckpoint?.id || ride.checkpoints[0]?.id || "on-road",
      checkpointName: nearCheckpoint?.name || "On the road",
      type: asset.type === "video" ? "video" : "photo",
      data: asset.uri,
      author: state.user!.name,
      ts: Date.now(),
    });
    toast(nearCheckpoint ? `Captured at ${nearCheckpoint.name}` : "Added to journal");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ride?.id, nearCheckpoint]);

  const togglePause = () => {
    if (!ride) return;
    const next = !ride.paused;
    setRidePaused(ride.id, next);
    toast(next ? "Ride paused" : "Ride resumed");
  };

  const endRideNow = () => {
    if (!ride) return;
    const rideId = ride.id;
    endRide();
    setTimeout(() => router.replace({ pathname: "/ride/journal", params: { id: rideId } }), 100);
  };

  const openNearby = (type: "fuel" | "food" | "hospital") => {
    if (!gps) return toast("Waiting for location");
    const q = type === "fuel" ? "fuel+station" : type === "food" ? "restaurant" : "hospital";
    Linking.openURL(`https://www.google.com/maps/search/${q}/@${gps.latitude},${gps.longitude},14z`);
  };

  if (!ride) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white/60">No active ride</Text>
        <Pressable onPress={() => router.back()} className="mt-4 bg-primary rounded-full px-5 py-3">
          <Text className="text-white font-extrabold">Go back</Text>
        </Pressable>
      </View>
    );
  }

  const paused = !!ride.paused;

  return (
    <View className="flex-1 bg-black">
      <LiveMap ref={mapRef} ride={ride} onReady={() => setMapReady(true)} />

      {/* ============ NAVIGATION BANNER (top) ============ */}
      {navInfo && (
        <View style={{ position: "absolute", top: insets.top + 8, left: 16, right: 16 }}>
          <View
            className="rounded-[20px] p-4 flex-row items-center gap-4"
            style={{
              backgroundColor: "rgba(11,14,21,0.95)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.14)",
              shadowColor: "#000", shadowOpacity: 0.6, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 12,
            }}
          >
            <View className="w-14 h-14 rounded-[14px] bg-primary items-center justify-center">
              <Icon name={iconForStep({ maneuver: navInfo.maneuver, modifier: navInfo.modifier, instruction: "", road: "", distance: 0, duration: 0, location: [0, 0], cumStartKm: 0 } as any)} size={26} color="#fff" strokeWidth={2.8} />
            </View>
            <View className="flex-1 min-w-0">
              <Text className="text-white text-[17px] font-black tracking-tight" numberOfLines={1}>
                {navInfo.instruction}
              </Text>
              <View className="flex-row items-center gap-3 mt-1">
                <Text className="text-primary text-[13px] font-extrabold">
                  in {fmtDistance(navInfo.distanceToTurnM)}
                </Text>
                <Text className="text-white/50 text-[12px] font-bold">
                  · {navInfo.eta} left
                </Text>
              </View>
            </View>
          </View>

          {/* Compact controls row */}
          <View className="flex-row justify-between mt-2">
            <Pressable
              onPress={() => router.back()}
              className="w-11 h-11 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(11,14,21,0.95)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)" }}
            >
              <Icon name="chevronDown" size={20} />
            </Pressable>
            <View className="flex-row gap-2">
              <View
                className="rounded-full px-3 py-2.5 flex-row items-center gap-1.5"
                style={{ backgroundColor: "rgba(11,14,21,0.95)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)" }}
              >
                <Icon name="crosshair" size={13} color={gps ? "#7CE5B0" : "#FF5C7A"} strokeWidth={2.4} />
                <Text className="text-white text-[12px] font-extrabold">{gps ? `±${Math.round(gps.accuracy)}m` : "GPS…"}</Text>
              </View>
              <Pressable
                onPress={() => setFollowMode((v) => !v)}
                className="w-11 h-11 rounded-full items-center justify-center"
                style={{
                  backgroundColor: followMode ? "#FF7B6B" : "rgba(11,14,21,0.95)",
                  borderWidth: 1,
                  borderColor: followMode ? "#FF7B6B" : "rgba(255,255,255,0.14)",
                }}
              >
                <Icon name="nav" size={18} color={followMode ? "#fff" : "#F0F3F8"} />
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Paused banner */}
      {paused && (
        <View style={{ position: "absolute", top: insets.top + (navInfo ? 130 : 68), left: 16, right: 16 }}>
          <View className="bg-amber/15 border border-amber/30 rounded-[14px] px-4 py-3 flex-row items-center gap-2">
            <Icon name="pause" size={16} color="#FFB454" strokeWidth={2.6} />
            <Text className="text-amber text-[13px] font-extrabold">Ride paused</Text>
          </View>
        </View>
      )}

      {/* ============ BOTTOM SHEET ============ */}
      <View
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          height: sheetH,
          backgroundColor: "#151A23",
          borderTopLeftRadius: 28, borderTopRightRadius: 28,
          borderTopWidth: 1, borderColor: "rgba(255,255,255,0.14)",
          paddingBottom: insets.bottom,
        }}
      >
        {/* Tap-to-toggle handle */}
        <Pressable onPress={toggleSheet} className="items-center pt-3 pb-2">
          <View className="w-12 h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.3)" }} />
          <View className="flex-row items-center gap-1 mt-2">
            <Text className="text-white/40 text-[11px] font-bold tracking-widest uppercase">
              {sheetExpanded ? "Hide" : "More"}
            </Text>
            <Icon name={sheetExpanded ? "chevronDown" : "chevronUp"} size={12} color="rgba(240,243,248,0.5)" />
          </View>
        </Pressable>

        <View className="px-5 pb-3 flex-row items-center justify-between border-b border-white/8">
          <View className="flex-1 min-w-0">
            <Text className="text-white text-[18px] font-black tracking-tight" numberOfLines={1}>{ride.title}</Text>
            <View className="flex-row items-center gap-1.5 mt-1">
              <Icon name="pin" size={12} color="rgba(240,243,248,0.6)" />
              <Text className="text-white/60 text-[12px] font-semibold" numberOfLines={1}>{sub}</Text>
            </View>
          </View>
          {etaMin !== "--" && (
            <View className="items-end ml-2">
              <Text className="text-mint text-[22px] font-black tracking-tighter">{etaMin}</Text>
              <Text className="text-white/35 text-[10px] font-black tracking-widest">MIN AWAY</Text>
            </View>
          )}
        </View>

        <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 14 }}>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <SheetBtn
                label={paused ? "Resume" : "Pause"}
                icon={paused ? "play" : "pause"}
                variant={paused ? "mint" : "default"}
                onPress={togglePause}
              />
            </View>
            <View style={{ flex: 1 }}>
              <SheetBtn label="Camera" icon="camera" variant="primary" onPress={captureMedia} />
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <View style={{ flex: 1 }}><SheetBtn label="Fuel" icon="fuel" onPress={() => openNearby("fuel")} /></View>
            <View style={{ flex: 1 }}><SheetBtn label="Food" icon="food" onPress={() => openNearby("food")} /></View>
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <View style={{ flex: 1 }}><SheetBtn label="Hospital" icon="cross" onPress={() => openNearby("hospital")} /></View>
            <View style={{ flex: 1 }}><SheetBtn label="Break" icon="coffee" onPress={() => toast("Break marked")} /></View>
          </View>

          <View style={{ marginTop: 10 }}>
            <SheetBtn label="Emergency SOS" icon="alert" variant="rose" onPress={() => router.push("/sos")} />
          </View>

          <View style={{ marginTop: 10 }}>
            <SheetBtn label="End ride & view journal" icon="flag" onPress={endRideNow} />
          </View>
        </View>
      </View>
    </View>
  );
}

function SheetBtn({ label, icon, onPress, variant = "default" }: any) {
  const bg =
    variant === "rose" ? "#FF5C7A" :
    variant === "mint" ? "#7CE5B0" :
    variant === "primary" ? "#FF7B6B" :
    "#1D242F";
  const fg = variant === "mint" ? "#0B0E15" : "#fff";
  return (
    <Pressable
      onPress={onPress}
      style={{ backgroundColor: bg, borderWidth: variant === "default" ? 1 : 0, borderColor: "rgba(255,255,255,0.08)" }}
      className="py-[14px] rounded-[14px] flex-row items-center justify-center gap-2"
    >
      <Icon name={icon} size={16} color={fg} strokeWidth={2.6} />
      <Text style={{ color: fg }} className="text-[13px] font-extrabold">{label}</Text>
    </Pressable>
  );
}