import * as Location from "expo-location";

export interface GeoFix {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
}

let subscription: Location.LocationSubscription | null = null;
const listeners = new Set<(fix: GeoFix | null, err?: string) => void>();

export const geo = {
  async start() {
    if (subscription) return;
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      listeners.forEach((fn) => fn(null, "Permission denied"));
      return;
    }
    subscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 3 },
      (pos) => {
        const fix: GeoFix = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy ?? 10,
          speed: pos.coords.speed,
        };
        listeners.forEach((fn) => fn(fix));
      }
    );
  },
  stop() {
    if (subscription) {
      subscription.remove();
      subscription = null;
    }
  },
  subscribe(fn: (fix: GeoFix | null, err?: string) => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};