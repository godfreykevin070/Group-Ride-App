import { Pressable, View, Text, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ride } from "../../constants/types";
import { Icon } from "./Icon";

interface Props {
  ride: Ride;
  onPress: () => void;
  isUpcoming?: boolean;
}

export function RideCard({ ride, onPress, isUpcoming = true }: Props) {
  const dt = new Date(ride.date);
  const label = isUpcoming
    ? `In ${Math.max(0, Math.floor((dt.getTime() - Date.now()) / 3600000))}h`
    : dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const hasJournal = (ride.journal || []).length > 0;

  return (
    <Pressable onPress={onPress} className="mx-5 mb-3 rounded-[20px] overflow-hidden" style={{ height: isUpcoming ? 160 : 140 }}>
      <ImageBackground source={{ uri: ride.cover }} style={{ width: "100%", height: "100%" }} resizeMode="cover">
        <LinearGradient
          colors={["rgba(11,14,21,0.1)", "rgba(11,14,21,0.75)", "rgba(11,14,21,0.98)"]}
          locations={[0, 0.5, 1]}
          style={{ flex: 1, padding: 14, justifyContent: "flex-end" }}
        >
          <View className="absolute top-3 right-3 px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <Text className="text-white text-[10px] font-extrabold">{label}</Text>
          </View>
          {hasJournal && (
            <View className="absolute top-3 left-3 px-2 py-1 rounded-full flex-row items-center gap-1" style={{ backgroundColor: "rgba(255,180,84,0.9)" }}>
              <Icon name="camera" size={10} color="#000" strokeWidth={3} />
              <Text className="text-black text-[10px] font-black">{ride.journal.length}</Text>
            </View>
          )}
          <Text className="text-white text-[16px] font-black tracking-tight" numberOfLines={1}>{ride.title}</Text>
          <Text className="text-white/60 text-[11px] mt-1">{ride.from.name} → {ride.to.name} · {ride.distance} km</Text>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}