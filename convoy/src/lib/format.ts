export const uid = () => Math.random().toString(36).slice(2, 11);
export const now = () => Date.now();

export function fmtTime(ts: number) {
  const d = new Date(ts), n = new Date();
  if (d.toDateString() === n.toDateString())
    return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  const days = Math.floor((n.getTime() - d.getTime()) / 86400000);
  if (days === 1) return "Yesterday";
  if (days < 7) return d.toLocaleDateString("en-IN", { weekday: "short" });
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function fmtClock(d: Date) {
  return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

export function initials(n: string) {
  return (n || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}