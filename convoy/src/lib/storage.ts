import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "../constants/types";

const KEY = "convoy_state_v1";

export const defaultState = (): AppState => ({
  user: null,
  friends: [],
  clubs: [],
  rides: [],
  activeRideId: null,
  sosContacts: [],
  meta: { installId: Math.random().toString(36).slice(2, 12), season: new Date().getFullYear() },
});

export async function loadState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

export async function persistState(state: AppState) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Persist failed", e);
  }
}

export async function clearState() {
  await AsyncStorage.removeItem(KEY);
}