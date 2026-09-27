/**
 * Free, keyless tile providers for Leaflet.
 * These do NOT require an API key. Usage is subject to fair-use limits.
 */
export const TILE_PROVIDERS = {
  osm: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    subdomains: "abc",
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  },
  esri: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    subdomains: "",
    maxZoom: 18,
    attribution: "Tiles © Esri",
  },
} as const;

export type TileProviderKey = keyof typeof TILE_PROVIDERS;