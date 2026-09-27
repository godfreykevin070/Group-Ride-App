export interface User {
  name: string;
  handle: string;
  avatar: string;
  onboardedAt: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: string;
  addedAt: number;
}

export interface Checkpoint {
  id: string;
  name: string;
  index: number;
  lat: number | null;
  lng: number | null;
}

export interface RiderPosition {
  lat: number;
  lng: number;
  ts: number;
  progressKm: number;
  simulated: boolean;
}

export interface SimulatedRider {
  name: string;
  avatar: string;
  speedKmh: number;
  progressKm: number;
}

export interface JournalEntry {
  id: string;
  checkpointId: string;
  checkpointName: string;
  type: "photo" | "video";
  data: string | null;
  author: string;
  ts: number;
}

export interface Notification {
  id: string;
  to: string;
  type: "slow_down" | "catch_up";
  msg: string;
  ts: number;
}

export interface RouteStep {
  instruction: string;
  maneuver: string;
  modifier?: string;
  road: string;
  distance: number;
  duration: number;
  location: [number, number];
  cumStartKm: number;
}

export interface Ride {
  id: string;
  clubId: string;
  title: string;
  from: { name: string; lat: number; lng: number };
  to: { name: string; lat: number; lng: number };
  distance: number;
  difficulty: string;
  cover: string;
  date: string;
  createdBy: string;
  riders: string[];
  status: "upcoming" | "active" | "completed";
  startedAt: number | null;
  endedAt: number | null;
  pausedAt?: number | null;
  paused?: boolean;
  track: { lat: number; lng: number; ts: number }[];
  riderPositions: Record<string, RiderPosition>;
  simulatedRiders?: SimulatedRider[];
  checkpoints: Checkpoint[];
  journal: JournalEntry[];
  notifications: Notification[];
  headName?: string;
  tailName?: string;
  routeData?: {
    coords: [number, number][];
    cum: number[];
    steps?: RouteStep[];
  };
  nearCheckpointId?: string | null;
  nearCheckpointName?: string | null;
  createdAt: number;
}

export type MessageType = "text" | "system" | "ride-plan" | "location";

export interface Message {
  id: string;
  from: string;
  type: MessageType;
  text?: string;
  ts: number;
  rideId?: string;
  title?: string;
  dateLabel?: string;
  distance?: number;
  cover?: string;
  rsvps?: string[];
  lat?: number;
  lng?: number;
  label?: string;
}

export interface Club {
  id: string;
  name: string;
  description?: string;
  emoji: string;
  memberIds: string[];
  messages: Message[];
  unread: number;
  createdAt: number;
}

export interface SosContact {
  id: string;
  name: string;
  phone: string;
}

export interface AppState {
  user: User | null;
  friends: Friend[];
  clubs: Club[];
  rides: Ride[];
  activeRideId: string | null;
  sosContacts: SosContact[];
  meta: { installId: string; season: number };
}