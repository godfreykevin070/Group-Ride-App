import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AppState,
  Club,
  Friend,
  JournalEntry,
  Message,
  Ride,
  SosContact,
  User,
} from "../constants/types";
import { clearState, defaultState, loadState, persistState } from "../lib/storage";

interface Toast {
  id: string;
  msg: string;
}
interface Banner {
  title: string;
  sub: string;
  variant: "amber" | "rose" | "mint";
}

interface Ctx {
  state: AppState;
  ready: boolean;
  setUser: (u: User) => void;
  updateUser: (patch: Partial<User>) => void;
  addFriend: (name: string, avatar?: string) => void;
  addClub: (name: string, emoji: string, memberIds: string[], description?: string) => Club;
  addMember: (clubId: string, friendId: string) => void;
  removeMember: (clubId: string, friendId: string) => void;
  sendMessage: (clubId: string, msg: Partial<Message>) => void;
  markClubRead: (clubId: string) => void;
  addRide: (ride: Ride, clubId: string) => void;
  updateRide: (rideId: string, patch: Partial<Ride>) => void;
  deleteRide: (rideId: string) => void;
  startRide: (rideId: string) => void;
  endRide: () => void;
  setActiveRide: (id: string | null) => void;
  setRidePaused: (rideId: string, paused: boolean) => void;
  addJournal: (rideId: string, entry: JournalEntry) => void;
  addSosContact: (c: Omit<SosContact, "id">) => void;
  removeSosContact: (id: string) => void;
  reset: () => void;
  toast: (msg: string) => void;
  toasts: Toast[];
  banner: Banner | null;
  showBanner: (b: Banner) => void;
  dismissBanner: () => void;
}

const AppContext = createContext<Ctx | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp outside provider");
  return ctx;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadState().then((s) => {
      setState(s);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => persistState(state), 250);
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, [state, ready]);

  const upd = useCallback((fn: (s: AppState) => AppState) => setState((s) => fn(s)), []);

  /* ---------------------------------------------------------------- */
  /*  USER                                                            */
  /* ---------------------------------------------------------------- */
  const setUser = useCallback((u: User) => upd((s) => ({ ...s, user: u })), [upd]);

  const updateUser = useCallback(
    (patch: Partial<User>) =>
      upd((s) => ({ ...s, user: s.user ? { ...s.user, ...patch } : s.user })),
    [upd]
  );

  /* ---------------------------------------------------------------- */
  /*  FRIENDS                                                         */
  /* ---------------------------------------------------------------- */
  const addFriend = useCallback(
    (name: string, avatar?: string) =>
      upd((s) => {
        if (s.friends.some((f) => f.name === name)) return s;
        const newF: Friend = {
          id: Math.random().toString(36).slice(2, 11),
          name,
          avatar: avatar || ["🐯", "🦊", "🐺", "🦅", "🐎", "⚡"][Math.floor(Math.random() * 6)],
          status: "idle",
          addedAt: Date.now(),
        };
        return { ...s, friends: [...s.friends, newF] };
      }),
    [upd]
  );

  /* ---------------------------------------------------------------- */
  /*  CLUBS                                                           */
  /* ---------------------------------------------------------------- */
  const addClub = useCallback(
    (name: string, emoji: string, memberIds: string[], description?: string) => {
      const club: Club = {
        id: Math.random().toString(36).slice(2, 11),
        name,
        description: description || undefined,
        emoji,
        memberIds,
        messages: [
          {
            id: Math.random().toString(36).slice(2, 11),
            from: "system",
            type: "system",
            text: `Welcome to ${name}!`,
            ts: Date.now(),
          },
        ],
        unread: 0,
        createdAt: Date.now(),
      };
      upd((s) => ({ ...s, clubs: [...s.clubs, club] }));
      return club;
    },
    [upd]
  );

  const addMember = useCallback(
    (clubId: string, friendId: string) =>
      upd((s) => ({
        ...s,
        clubs: s.clubs.map((c) => {
          if (c.id !== clubId || c.memberIds.includes(friendId)) return c;
          const f = s.friends.find((x) => x.id === friendId);
          const sysMsg: Message = {
            id: Math.random().toString(36).slice(2, 11),
            from: "system",
            type: "system",
            text: `${f?.name ?? "Someone"} joined the club`,
            ts: Date.now(),
          };
          return { ...c, memberIds: [...c.memberIds, friendId], messages: [...c.messages, sysMsg] };
        }),
      })),
    [upd]
  );

  const removeMember = useCallback(
    (clubId: string, friendId: string) =>
      upd((s) => ({
        ...s,
        clubs: s.clubs.map((c) =>
          c.id === clubId ? { ...c, memberIds: c.memberIds.filter((id) => id !== friendId) } : c
        ),
      })),
    [upd]
  );

  const sendMessage = useCallback(
    (clubId: string, msg: Partial<Message>) =>
      upd((s) => ({
        ...s,
        clubs: s.clubs.map((c) => {
          if (c.id !== clubId) return c;
          const full: Message = {
            id: Math.random().toString(36).slice(2, 11),
            from: msg.from ?? s.user?.name ?? "You",
            type: msg.type ?? "text",
            ts: Date.now(),
            ...msg,
          } as Message;
          return { ...c, messages: [...c.messages, full] };
        }),
      })),
    [upd]
  );

  const markClubRead = useCallback(
    (clubId: string) =>
      upd((s) => ({
        ...s,
        clubs: s.clubs.map((c) => (c.id === clubId ? { ...c, unread: 0 } : c)),
      })),
    [upd]
  );

  /* ---------------------------------------------------------------- */
  /*  RIDES                                                           */
  /* ---------------------------------------------------------------- */
  const addRide = useCallback(
    (ride: Ride, clubId: string) =>
      upd((s) => {
        const club = s.clubs.find((c) => c.id === clubId);
        if (!club) return { ...s, rides: [...s.rides, ride] };
        const planMsg: Message = {
          id: Math.random().toString(36).slice(2, 11),
          from: s.user?.name ?? "You",
          type: "ride-plan",
          rideId: ride.id,
          title: ride.title,
          dateLabel: new Date(ride.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          }),
          distance: ride.distance,
          cover: ride.cover,
          rsvps: [s.user?.name ?? "You"],
          ts: Date.now(),
        };
        return {
          ...s,
          rides: [...s.rides, ride],
          clubs: s.clubs.map((c) =>
            c.id === clubId ? { ...c, messages: [...c.messages, planMsg] } : c
          ),
        };
      }),
    [upd]
  );

  const updateRide = useCallback(
    (rideId: string, patch: Partial<Ride>) =>
      upd((s) => ({
        ...s,
        rides: s.rides.map((r) => (r.id === rideId ? { ...r, ...patch } : r)),
      })),
    [upd]
  );

  const deleteRide = useCallback(
    (rideId: string) =>
      upd((s) => ({
        ...s,
        rides: s.rides.filter((r) => r.id !== rideId),
      })),
    [upd]
  );

  const startRide = useCallback(
    (rideId: string) =>
      upd((s) => ({
        ...s,
        activeRideId: rideId,
        rides: s.rides.map((r) =>
          r.id === rideId
            ? {
                ...r,
                status: "active",
                startedAt: Date.now(),
                endedAt: null,
                paused: false,
                pausedAt: null,
                track: [],
                riderPositions: {},
                journal: r.journal || [],
                notifications: [],
              }
            : r
        ),
      })),
    [upd]
  );

  const endRide = useCallback(
    () =>
      upd((s) => {
        const activeId = s.activeRideId;
        return {
          ...s,
          activeRideId: null,
          rides: s.rides.map((r) =>
            r.id === activeId
              ? { ...r, status: "completed", endedAt: Date.now(), paused: false, pausedAt: null }
              : r
          ),
        };
      }),
    [upd]
  );

  const setActiveRide = useCallback(
    (id: string | null) => upd((s) => ({ ...s, activeRideId: id })),
    [upd]
  );

  const setRidePaused = useCallback(
    (rideId: string, paused: boolean) =>
      upd((s) => ({
        ...s,
        rides: s.rides.map((r) =>
          r.id === rideId ? { ...r, paused, pausedAt: paused ? Date.now() : null } : r
        ),
      })),
    [upd]
  );

  const addJournal = useCallback(
    (rideId: string, entry: JournalEntry) =>
      upd((s) => ({
        ...s,
        rides: s.rides.map((r) =>
          r.id === rideId ? { ...r, journal: [...(r.journal || []), entry] } : r
        ),
      })),
    [upd]
  );

  /* ---------------------------------------------------------------- */
  /*  SOS CONTACTS                                                    */
  /* ---------------------------------------------------------------- */
  const addSosContact = useCallback(
    (c: Omit<SosContact, "id">) =>
      upd((s) => ({
        ...s,
        sosContacts: [...s.sosContacts, { ...c, id: Math.random().toString(36).slice(2, 11) }],
      })),
    [upd]
  );

  const removeSosContact = useCallback(
    (id: string) =>
      upd((s) => ({
        ...s,
        sosContacts: s.sosContacts.filter((x) => x.id !== id),
      })),
    [upd]
  );

  /* ---------------------------------------------------------------- */
  /*  RESET                                                           */
  /* ---------------------------------------------------------------- */
  const reset = useCallback(async () => {
    await clearState();
    setState(defaultState());
  }, []);

  /* ---------------------------------------------------------------- */
  /*  TOASTS / BANNERS                                                */
  /* ---------------------------------------------------------------- */
  const toast = useCallback((msg: string) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, msg }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 2400);
  }, []);

  const showBanner = useCallback((b: Banner) => {
    setBanner(b);
    setTimeout(() => setBanner(null), 5000);
  }, []);

  const dismissBanner = useCallback(() => setBanner(null), []);

  /* ---------------------------------------------------------------- */
  /*  CONTEXT VALUE                                                   */
  /* ---------------------------------------------------------------- */
  const value = useMemo<Ctx>(
    () => ({
      state,
      ready,
      setUser,
      updateUser,
      addFriend,
      addClub,
      addMember,
      removeMember,
      sendMessage,
      markClubRead,
      addRide,
      updateRide,
      deleteRide,
      startRide,
      endRide,
      setActiveRide,
      setRidePaused,
      addJournal,
      addSosContact,
      removeSosContact,
      reset,
      toast,
      toasts,
      banner,
      showBanner,
      dismissBanner,
    }),
    [
      state,
      ready,
      setUser,
      updateUser,
      addFriend,
      addClub,
      addMember,
      removeMember,
      sendMessage,
      markClubRead,
      addRide,
      updateRide,
      deleteRide,
      startRide,
      endRide,
      setActiveRide,
      setRidePaused,
      addJournal,
      addSosContact,
      removeSosContact,
      reset,
      toast,
      toasts,
      banner,
      showBanner,
      dismissBanner,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}