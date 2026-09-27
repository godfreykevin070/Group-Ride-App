import { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useApp } from "../src/context/AppContext";
import { Icon } from "../src/components/ui/Icon";
import { PrimaryButton } from "../src/components/ui/PrimaryButton";
import { PickerMap, PickerMapHandle, PickerWaypoint } from "../src/components/map/PickerMap";
import { searchPlaces, reverseGeocode, PlaceResult } from "../src/lib/geocode";
import { fetchRoute } from "../src/lib/routing";
import { uid } from "../src/lib/format";
import { Ride } from "../src/constants/types";

type Point = { lat: number; lng: number; name: string };

const DAYS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(Date.now() + i * 86400000);
  return {
    iso: d.toISOString().slice(0, 10),
    day: i === 0 ? "Today" : d.toLocaleDateString("en", { weekday: "short" }),
    date: d.getDate(),
    month: d.toLocaleDateString("en", { month: "short" }),
  };
});

const TIMES = (() => {
  const t: string[] = [];
  for (let h = 5; h <= 21; h++) {
    t.push(`${String(h).padStart(2, "0")}:00`);
    t.push(`${String(h).padStart(2, "0")}:30`);
  }
  return t;
})();

function shortenPlace(name: string): string {
  const first = (name || "").split(",")[0].trim();
  const words = first.split(" ").filter(Boolean);
  if (words.length <= 2) return first;
  return words.slice(0, 2).join(" ");
}

/**
 * Trip flow:
 *   1. Pick START        → auto-advance to "to"
 *   2. Pick END          → auto-advance to "via"
 *   3. Add optional STOPOVERS (checkpoints)  → "Add stop" button
 *   4. Tap "Next"        → moves to details (title/date/time/club)
 *   5. Ride name is required before saving
 */
export default function PlanRide() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, addRide, toast } = useApp();
  const mapRef = useRef<PickerMapHandle>(null);

  const [step, setStep] = useState<"map" | "details">("map");
  const [from, setFrom] = useState<Point | null>(null);
  const [to, setTo] = useState<Point | null>(null);
  const [vias, setVias] = useState<Point[]>([]);
  const [pendingMode, setPendingMode] = useState<"from" | "to" | "via">("from");
  const [center, setCenter] = useState({ lat: 12.9716, lng: 77.5946 });
  const [searchQ, setSearchQ] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [reverseLoading, setReverseLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const [dateIso, setDateIso] = useState(DAYS[0].iso);
  const [time, setTime] = useState("06:30");
  const [clubId, setClubId] = useState(state.clubs[0]?.id ?? null);
  const [building, setBuilding] = useState(false);
  const [rideTitle, setRideTitle] = useState("");
  const [titleTouched, setTitleTouched] = useState(false);

  const defaultTitle =
    from && to ? `${shortenPlace(from.name)} → ${shortenPlace(to.name)}` : "";
  const finalTitle = rideTitle.trim() || defaultTitle;
  const isTitleValid = finalTitle.length > 0;

  /* ------------------------------------------------ */
  /*  Map center                                     */
  /* ------------------------------------------------ */
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      } catch {}
    })();
  }, []);

  /* ------------------------------------------------ */
  /*  Sync markers                                   */
  /* ------------------------------------------------ */
  useEffect(() => {
    if (!mapReady) return;
    const markers: PickerWaypoint[] = [];
    if (from) markers.push({ lat: from.lat, lng: from.lng, kind: "from" });
    vias.forEach((v) => markers.push({ lat: v.lat, lng: v.lng, kind: "via" }));
    if (to) markers.push({ lat: to.lat, lng: to.lng, kind: "to" });
    mapRef.current?.setMarkers(markers);
  }, [mapReady, from, to, vias]);

  /* ------------------------------------------------ */
  /*  Reverse geocode & set                          */
  /* ------------------------------------------------ */
  const reverseAndSet = async (lat: number, lng: number, mode: "from" | "to" | "via") => {
    setReverseLoading(true);
    const place = await reverseGeocode(lat, lng);
    setReverseLoading(false);
    const p: Point = {
      lat,
      lng,
      name: place?.name || `${lat.toFixed(3)}, ${lng.toFixed(3)}`,
    };
    if (mode === "from") {
      setFrom(p);
      // ✅ auto-advance to "to"
      if (!to) setPendingMode("to");
    } else if (mode === "to") {
      setTo(p);
      // ✅ auto-advance to "via" so user can add checkpoints
      if (vias.length === 0) setPendingMode("via");
    } else {
      setVias((prev) => [...prev, p]);
    }
  };

  const onMapTap = (lat: number, lng: number) => {
    reverseAndSet(lat, lng, pendingMode);
  };

  const onMarkerTap = (kind: string) => {
    if (kind === "from") setFrom(null);
    else if (kind === "to") setTo(null);
  };

  /* ------------------------------------------------ */
  /*  Current location as start                      */
  /* ------------------------------------------------ */
  const useCurrentLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocating(false);
        return toast("Location permission denied");
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setCenter({ lat, lng });
      setReverseLoading(true);
      const place = await reverseGeocode(lat, lng);
      setReverseLoading(false);
      setFrom({ lat, lng, name: place?.name || "Current location" });
      setPendingMode("to");
    } catch {
      toast("Could not get location");
    } finally {
      setLocating(false);
    }
  };

  /* ------------------------------------------------ */
  /*  Search                                         */
  /* ------------------------------------------------ */
  const runSearch = async () => {
    if (searchQ.trim().length < 2) return;
    setSearching(true);
    const r = await searchPlaces(searchQ, 6);
    setResults(r);
    setSearching(false);
  };

  const pickSearch = (r: PlaceResult) => {
    const p: Point = { lat: r.lat, lng: r.lng, name: r.name };
    if (pendingMode === "from") {
      setFrom(p);
      if (!to) setPendingMode("to");
    } else if (pendingMode === "to") {
      setTo(p);
      if (vias.length === 0) setPendingMode("via");
    } else {
      setVias((prev) => [...prev, p]);
    }
    setSearchQ("");
    setResults([]);
  };

  /* ------------------------------------------------ */
  /*  Build ride                                     */
  /* ------------------------------------------------ */
  const buildRide = async () => {
    if (!from || !to) return toast("Pick start and destination");
    if (!isTitleValid) {
      setTitleTouched(true);
      return toast("Ride name is required");
    }
    if (!clubId) return toast("Create a club first");
    setBuilding(true);

    const points = [from, ...vias, to];
    const allCoords: [number, number][] = [];
    let totalDistance = 0;
    let totalDuration = 0;
    const allSteps: any[] = [];

    for (let i = 0; i < points.length - 1; i++) {
      const leg = await fetchRoute(points[i], points[i + 1]);
      if (!leg) {
        setBuilding(false);
        return toast(`No route between ${points[i].name} and ${points[i + 1].name}`);
      }
      const coords = i === 0 ? leg.coords : leg.coords.slice(1);
      allCoords.push(...coords);
      totalDistance += leg.distance;
      totalDuration += leg.duration;
      allSteps.push(...(leg.steps || []));
    }

    setBuilding(false);

    const dateTime = `${dateIso}T${time}:00`;
    const ride: Ride = {
      id: uid(),
      clubId,
      title: finalTitle,
      from: { name: from.name, lat: from.lat, lng: from.lng },
      to: { name: to.name, lat: to.lat, lng: to.lng },
      distance: Math.round(totalDistance / 1000),
      difficulty: totalDistance / 1000 > 200 ? "Moderate" : "Easy",
      cover: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
      date: dateTime,
      createdBy: state.user!.name,
      riders: [state.user!.name],
      status: "upcoming",
      startedAt: null,
      endedAt: null,
      paused: false,
      pausedAt: null,
      track: [],
      riderPositions: {},
      checkpoints: points.map((p, i) => ({
        id: uid(),
        name: p.name,
        index: i,
        lat: p.lat,
        lng: p.lng,
      })),
      journal: [],
      notifications: [],
      routeData: { coords: allCoords, cum: [], steps: allSteps },
      createdAt: Date.now(),
    };

    addRide(ride, clubId);
    toast(`Ride planned · ${ride.distance} km on ${new Date(dateTime).toLocaleDateString()}`);
    router.back();
  };

  /* ============================================================ */
  /*  MAP STEP                                                    */
  /* ============================================================ */
  if (step === "map") {
    const canProceed = !!from && !!to;

    return (
      <View className="flex-1 bg-black">
        <PickerMap
          ref={mapRef}
          center={center}
          onMapTap={onMapTap}
          onMarkerTap={onMarkerTap}
          onReady={() => setMapReady(true)}
        />

        {/* Top bar */}
        <View style={{ position: "absolute", top: insets.top + 8, left: 16, right: 16 }}>
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={() => router.back()}
              className="w-11 h-11 rounded-full items-center justify-center"
              style={{
                backgroundColor: "rgba(11,14,21,0.92)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.14)",
              }}
            >
              <Icon name="x" size={20} />
            </Pressable>

            <View
              className="flex-1 flex-row items-center gap-2 rounded-full px-4 h-11"
              style={{
                backgroundColor: "rgba(11,14,21,0.92)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.14)",
              }}
            >
              <Icon name="search" size={16} color="rgba(240,243,248,0.5)" />
              <TextInput
                value={searchQ}
                onChangeText={setSearchQ}
                onSubmitEditing={runSearch}
                placeholder={`Search ${
                  pendingMode === "from"
                    ? "start"
                    : pendingMode === "to"
                    ? "destination"
                    : "checkpoint"
                }`}
                placeholderTextColor="rgba(240,243,248,0.4)"
                className="flex-1 text-white text-[13px]"
              />
              {searching && <ActivityIndicator color="#FF7B6B" size="small" />}
            </View>
          </View>

          {results.length > 0 && (
            <View
              className="mt-2 rounded-[14px] overflow-hidden"
              style={{
                backgroundColor: "rgba(11,14,21,0.95)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.14)",
              }}
            >
              {results.map((r, i) => (
                <Pressable
                  key={`${r.lat}-${r.lng}-${i}`}
                  onPress={() => pickSearch(r)}
                  className={`px-4 py-3 ${
                    i < results.length - 1 ? "border-b border-white/6" : ""
                  }`}
                >
                  <Text className="text-white text-[13px] font-bold">{r.name}</Text>
                  <Text className="text-white/40 text-[11px] mt-0.5" numberOfLines={1}>
                    {r.displayName}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Instruction chip */}
        <View
          style={{
            position: "absolute",
            top: insets.top + 70,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
          pointerEvents="none"
        >
          <View
            className="px-4 py-2 rounded-full flex-row items-center gap-2"
            style={{
              backgroundColor: "rgba(11,14,21,0.92)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.14)",
            }}
          >
            {reverseLoading ? (
              <>
                <ActivityIndicator color="#7CE5B0" size="small" />
                <Text className="text-white/80 text-[12px] font-bold">Looking up…</Text>
              </>
            ) : (
              <>
                <Icon name="pin" size={14} color="#FF7B6B" />
                <Text className="text-white text-[12px] font-bold">
                  Tap map to set{" "}
                  {pendingMode === "from"
                    ? "start"
                    : pendingMode === "to"
                    ? "destination"
                    : "checkpoint"}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Bottom sheet */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#151A23",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: 1,
            borderColor: "rgba(255,255,255,0.14)",
            paddingBottom: insets.bottom + 16,
            paddingTop: 16,
            paddingHorizontal: 16,
          }}
        >
          {/* Start */}
          <RouteRow
            kind="from"
            label="Start"
            value={from?.name}
            onClear={() => setFrom(null)}
            onFocus={() => setPendingMode("from")}
            active={pendingMode === "from"}
          />

          {/* Current location pill */}
          {!from && (
            <Pressable
              onPress={useCurrentLocation}
              disabled={locating}
              className="ml-10 mt-1 mb-2 flex-row items-center gap-2 self-start px-3 py-2 rounded-full"
              style={{
                backgroundColor: "rgba(124,229,176,0.12)",
                borderWidth: 1,
                borderColor: "rgba(124,229,176,0.3)",
              }}
            >
              {locating ? (
                <ActivityIndicator color="#7CE5B0" size="small" />
              ) : (
                <Icon name="crosshair" size={13} color="#7CE5B0" strokeWidth={2.6} />
              )}
              <Text className="text-mint text-[11px] font-extrabold">
                {locating ? "Locating…" : "Use current location"}
              </Text>
            </Pressable>
          )}

          <View className="ml-[13px] h-4 border-l-2 border-dashed border-white/15" />

          {/* ✅ CHECKPOINTS (vias) */}
          {vias.map((v, i) => (
            <View key={`${v.lat}-${v.lng}-${i}`}>
              <RouteRow
                kind="via"
                index={i + 1}
                label="Checkpoint"
                value={v.name}
                onClear={() => setVias((prev) => prev.filter((_, j) => j !== i))}
                onFocus={() => setPendingMode("via")}
                active={pendingMode === "via"}
              />
              <View className="ml-[13px] h-4 border-l-2 border-dashed border-white/15" />
            </View>
          ))}

          {/* End */}
          <RouteRow
            kind="to"
            label="End"
            value={to?.name}
            onClear={() => setTo(null)}
            onFocus={() => setPendingMode("to")}
            active={pendingMode === "to"}
          />

          {/* ✅ Add checkpoint — enabled only after start+end are picked */}
          <Pressable
            onPress={() => {
              if (!from || !to) return toast("Set start and end first");
              setPendingMode("via");
            }}
            disabled={!canProceed}
            className="ml-10 mt-2 flex-row items-center gap-2 self-start px-3 py-2 rounded-full"
            style={{
              backgroundColor: canProceed
                ? "rgba(255,180,84,0.12)"
                : "rgba(255,255,255,0.03)",
              borderWidth: 1,
              borderColor: canProceed
                ? "rgba(255,180,84,0.3)"
                : "rgba(255,255,255,0.08)",
              opacity: canProceed ? 1 : 0.5,
            }}
          >
            <Icon
              name="plus"
              size={13}
              color={canProceed ? "#FFB454" : "rgba(240,243,248,0.4)"}
              strokeWidth={2.6}
            />
            <Text
              className="text-[11px] font-extrabold"
              style={{ color: canProceed ? "#FFB454" : "rgba(240,243,248,0.4)" }}
            >
              Add checkpoint
            </Text>
          </Pressable>

          <View className="flex-row gap-2 mt-4">
            <Pressable
              onPress={() => {
                if (!canProceed) return toast("Set start and destination");
                setStep("details");
              }}
              className="flex-1 bg-primary rounded-[14px] py-3 items-center flex-row justify-center gap-2"
              style={{ opacity: canProceed ? 1 : 0.5 }}
            >
              <Text className="text-white text-[13px] font-extrabold">Next</Text>
              <Icon name="arrowRight" size={14} color="#fff" strokeWidth={2.6} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  /* ============================================================ */
  /*  DETAILS STEP                                                */
  /* ============================================================ */
  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row items-center gap-3 mb-5">
            <Pressable
              onPress={() => setStep("map")}
              className="w-10 h-10 rounded-full bg-surface border border-white/8 items-center justify-center"
            >
              <Icon name="back" size={18} />
            </Pressable>
            <Text className="text-white text-[20px] font-black tracking-tight">
              Ride details
            </Text>
          </View>

          {/* ✅ Required ride name */}
          <View className="flex-row items-center gap-2 mb-2">
            <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase">
              Ride name
            </Text>
            <Text className="text-primary text-[11px] font-black">*</Text>
            <View className="flex-1" />
            <Text className="text-white/35 text-[10px] font-bold">
              {finalTitle.length}/40
            </Text>
          </View>
          <TextInput
            value={rideTitle}
            onChangeText={(v) => {
              setRideTitle(v.slice(0, 40));
              setTitleTouched(true);
            }}
            onBlur={() => setTitleTouched(true)}
            placeholder={defaultTitle || "e.g. Sunday Coorg Run"}
            placeholderTextColor="rgba(240,243,248,0.35)"
            maxLength={40}
            className="bg-surface border rounded-[14px] px-4 py-[14px] text-white text-[15px] font-semibold mb-2"
            style={{
              borderColor:
                titleTouched && !isTitleValid
                  ? "#FF5C7A"
                  : "rgba(255,255,255,0.08)",
            }}
          />
          {titleTouched && !isTitleValid && (
            <View className="flex-row items-center gap-1.5 mb-4">
              <Icon name="alertCircle" size={12} color="#FF5C7A" strokeWidth={2.6} />
              <Text className="text-rose text-[11px] font-bold">
                Give your ride a name to continue
              </Text>
            </View>
          )}
          {rideTitle.length === 0 && defaultTitle.length > 0 && (
            <Text className="text-white/40 text-[11px] font-medium mb-4">
              Leave blank to use "{defaultTitle}"
            </Text>
          )}

          {/* Route preview */}
          <View className="rounded-[20px] bg-surface border border-white/8 p-4 mb-6">
            <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mb-3">
              Route
            </Text>
            <View className="flex-row items-center gap-3 py-2">
              <View className="w-6 h-6 rounded-full bg-mint items-center justify-center">
                <Text className="text-black text-[11px] font-black">A</Text>
              </View>
              <Text
                className="text-white text-[14px] font-bold flex-1"
                numberOfLines={1}
              >
                {from?.name}
              </Text>
            </View>
            {vias.map((v, i) => (
              <View key={i} className="flex-row items-center gap-3 py-2">
                <View className="w-6 h-6 rounded-full bg-amber items-center justify-center">
                  <Text className="text-black text-[10px] font-black">{i + 1}</Text>
                </View>
                <Text
                  className="text-white text-[14px] font-bold flex-1"
                  numberOfLines={1}
                >
                  {v.name}
                </Text>
              </View>
            ))}
            <View className="flex-row items-center gap-3 py-2">
              <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                <Text className="text-white text-[11px] font-black">B</Text>
              </View>
              <Text
                className="text-white text-[14px] font-bold flex-1"
                numberOfLines={1}
              >
                {to?.name}
              </Text>
            </View>
          </View>

          {/* Date */}
          <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mb-3">
            Pick a date
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 6 }}
          >
            {DAYS.map((d) => {
              const on = dateIso === d.iso;
              return (
                <Pressable
                  key={d.iso}
                  onPress={() => setDateIso(d.iso)}
                  className="w-[62px] py-3 rounded-[14px] items-center"
                  style={{
                    backgroundColor: on ? "#FF7B6B" : "#151A23",
                    borderWidth: 1,
                    borderColor: on ? "#FF7B6B" : "rgba(255,255,255,0.08)",
                  }}
                >
                  <Text
                    className="text-[10px] font-black tracking-wider"
                    style={{ color: on ? "#fff" : "rgba(240,243,248,0.5)" }}
                  >
                    {d.day.toUpperCase()}
                  </Text>
                  <Text
                    className="text-[22px] font-black tracking-tighter mt-0.5"
                    style={{ color: on ? "#fff" : "#F0F3F8" }}
                  >
                    {d.date}
                  </Text>
                  <Text
                    className="text-[10px] font-bold tracking-wider"
                    style={{
                      color: on ? "rgba(255,255,255,0.85)" : "rgba(240,243,248,0.4)",
                    }}
                  >
                    {d.month.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Time */}
          <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mb-3 mt-6">
            Pick a time
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 6 }}
          >
            {TIMES.map((t) => {
              const on = time === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => setTime(t)}
                  className="px-4 py-3 rounded-[14px] items-center"
                  style={{
                    backgroundColor: on ? "#7CE5B0" : "#151A23",
                    borderWidth: 1,
                    borderColor: on ? "#7CE5B0" : "rgba(255,255,255,0.08)",
                  }}
                >
                  <Text
                    className="text-[15px] font-black tracking-tight"
                    style={{ color: on ? "#0B0E15" : "#F0F3F8" }}
                  >
                    {t}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Club */}
          <Text className="text-white/35 text-[11px] font-black tracking-widest uppercase mb-3 mt-6">
            Share with club
          </Text>
          {state.clubs.length === 0 ? (
            <Pressable
              onPress={() => router.replace("/club/create")}
              className="p-4 rounded-[14px] border border-dashed border-white/12 items-center"
            >
              <Text className="text-white/35 text-[13px]">
                No clubs yet.{" "}
                <Text className="text-primary font-bold">Create one first</Text>
              </Text>
            </Pressable>
          ) : (
            <View className="gap-2">
              {state.clubs.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => setClubId(c.id)}
                  className={`flex-row items-center gap-3 p-3 rounded-[14px] border ${
                    clubId === c.id ? "border-primary" : "border-white/8"
                  }`}
                  style={{
                    backgroundColor:
                      clubId === c.id
                        ? "rgba(255,123,107,0.06)"
                        : "rgba(255,255,255,0.03)",
                  }}
                >
                  <View
                    className={`w-6 h-6 rounded-full items-center justify-center border-2 ${
                      clubId === c.id
                        ? "bg-mint border-transparent"
                        : "border-white/20"
                    }`}
                  >
                    {clubId === c.id && (
                      <Icon name="check" size={12} color="#0B0E15" strokeWidth={3} />
                    )}
                  </View>
                  <Icon name={c.emoji} size={16} color="#FF7B6B" strokeWidth={2.2} />
                  <Text className="text-white text-[13px] font-bold flex-1">
                    {c.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <View className="mt-10">
            <PrimaryButton
              label={building ? "Building…" : "Create ride plan"}
              icon="send"
              onPress={buildRide}
              loading={building}
              disabled={!clubId || !isTitleValid}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function RouteRow({
  kind,
  index,
  label,
  value,
  onClear,
  onFocus,
  active,
}: {
  kind: "from" | "via" | "to";
  index?: number;
  label: string;
  value?: string;
  onClear: () => void;
  onFocus: () => void;
  active: boolean;
}) {
  const bg =
    kind === "from" ? "#7CE5B0" : kind === "via" ? "#FFB454" : "#FF7B6B";
  const fg = kind === "to" ? "#fff" : "#0B0E15";

  return (
    <Pressable onPress={onFocus} className="flex-row items-center gap-3 py-2">
      <View
        className="w-7 h-7 rounded-full items-center justify-center"
        style={{
          backgroundColor: bg,
          borderWidth: active ? 2 : 0,
          borderColor: "#fff",
        }}
      >
        <Text className="text-[11px] font-black" style={{ color: fg }}>
          {kind === "from" ? "A" : kind === "to" ? "B" : index}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-white/35 text-[9px] font-black tracking-widest uppercase">
          {label}
        </Text>
        <Text
          className={`text-[14px] font-bold ${
            value ? "text-white" : "text-white/30"
          }`}
          numberOfLines={1}
        >
          {value || `Tap map to set ${label.toLowerCase()}`}
        </Text>
      </View>
      {value ? (
        <Pressable onPress={onClear} hitSlop={12}>
          <Icon name="x" size={16} color="rgba(240,243,248,0.5)" />
        </Pressable>
      ) : null}
    </Pressable>
  );
}