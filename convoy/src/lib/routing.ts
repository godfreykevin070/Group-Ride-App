import { haversine } from "./format";
import { RouteStep } from "../constants/types";

export interface RouteResult {
  coords: [number, number][];
  distance: number;
  duration: number;
  steps: RouteStep[];
}

export async function fetchRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): Promise<RouteResult | null> {
  const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson&steps=true`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.code === "Ok" && data.routes?.length) {
      const r = data.routes[0];
      const coords: [number, number][] = r.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
      );
      const cum = buildCumulative(coords);

      // Flatten all steps across legs, then compute their cumStartKm
      const rawSteps: any[] = [];
      (r.legs || []).forEach((leg: any) => (leg.steps || []).forEach((s: any) => rawSteps.push(s)));

      const steps: RouteStep[] = rawSteps.map((s) => {
        const [lng, lat] = s.maneuver.location;
        // Find nearest cum point for this step's location
        let best = Infinity;
        let cumStartKm = 0;
        for (let i = 0; i < coords.length; i++) {
          const d = haversine({ lat, lng }, { lat: coords[i][0], lng: coords[i][1] });
          if (d < best) {
            best = d;
            cumStartKm = cum[i];
          }
        }
        return {
          instruction: buildInstruction(s),
          maneuver: s.maneuver.type,
          modifier: s.maneuver.modifier,
          road: s.name || "",
          distance: s.distance,
          duration: s.duration,
          location: [lat, lng],
          cumStartKm,
        };
      });

      return { coords, distance: r.distance, duration: r.duration, steps };
    }
  } catch (e) {
    console.warn("Route fetch failed", e);
  }
  return null;
}

function buildInstruction(s: any): string {
  const mod = s.maneuver.modifier || "";
  const road = s.name ? ` onto ${s.name}` : "";
  switch (s.maneuver.type) {
    case "depart":
      return `Head ${mod || "forward"}${road}`;
    case "turn":
      return `Turn ${mod}${road}`;
    case "new name":
      return `Continue${road}`;
    case "merge":
      return `Merge ${mod}${road}`;
    case "on ramp":
      return `Take the ramp${road}`;
    case "off ramp":
      return `Take the exit${road}`;
    case "fork":
      return `Keep ${mod || "straight"}${road}`;
    case "roundabout":
    case "rotary":
      return `At the roundabout${road}`;
    case "arrive":
      return `Arrive at your destination`;
    default:
      return `${s.maneuver.type} ${mod}${road}`;
  }
}

export function buildCumulative(coords: [number, number][]): number[] {
  const cum = [0];
  for (let i = 1; i < coords.length; i++) {
    cum.push(
      cum[i - 1] +
        haversine(
          { lat: coords[i - 1][0], lng: coords[i - 1][1] },
          { lat: coords[i][0], lng: coords[i][1] }
        )
    );
  }
  return cum;
}

export function pointAtKm(coords: [number, number][], cum: number[], km: number) {
  if (!coords.length) return { lat: 0, lng: 0 };
  if (km <= 0) return { lat: coords[0][0], lng: coords[0][1] };
  const total = cum[cum.length - 1];
  if (km >= total) return { lat: coords[coords.length - 1][0], lng: coords[coords.length - 1][1] };
  let lo = 0,
    hi = cum.length - 1;
  while (lo < hi - 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (cum[mid] < km) lo = mid;
    else hi = mid;
  }
  const seg = cum[hi] - cum[lo];
  const t = seg > 0 ? (km - cum[lo]) / seg : 0;
  return {
    lat: coords[lo][0] + (coords[hi][0] - coords[lo][0]) * t,
    lng: coords[lo][1] + (coords[hi][1] - coords[lo][1]) * t,
  };
}