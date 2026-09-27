/**
 * Free geocoding via OpenStreetMap's Nominatim API.
 * No API key required. Please respect the usage policy:
 * https://operations.osmfoundation.org/policies/nominatim/
 */
export interface PlaceResult {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
}

export async function searchPlaces(query: string, limit = 6): Promise<PlaceResult[]> {
  if (!query.trim()) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query
  )}&limit=${limit}&addressdetails=0`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "ConvoyApp/1.0 (ridesharing)",
        Accept: "application/json",
      },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{
      display_name: string;
      lat: string;
      lon: string;
      name?: string;
    }>;
    return data.map((d) => ({
      name: d.name || d.display_name.split(",")[0].trim(),
      displayName: d.display_name,
      lat: parseFloat(d.lat),
      lng: parseFloat(d.lon),
    }));
  } catch (e) {
    console.warn("Nominatim search failed", e);
    return [];
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<PlaceResult | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "ConvoyApp/1.0" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { display_name?: string; name?: string };
    const first = (data.name || data.display_name || "").split(",")[0].trim();
    return {
      name: first || "Unknown",
      displayName: data.display_name || "",
      lat,
      lng,
    };
  } catch {
    return null;
  }
}