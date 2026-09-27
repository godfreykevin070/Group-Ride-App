export const AVATAR_OPTIONS = [
  "bike", "flame", "zap", "star", "target", "rocket",
  "crown", "sparkles", "ghost", "cat", "dog", "bird",
  "fish", "shield", "sword", "compass",
];

export const CLUB_EMOJIS = [
  "bike", "flame", "zap", "star", "crown",
  "rocket", "target", "mountain", "waves", "sun",
];

export const ROUTE_PRESETS = [
  {
    title: "Coorg Coffee Trail",
    from: { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
    to: { name: "Coorg", lat: 12.3375, lng: 75.8069 },
    distance: 264, difficulty: "Moderate",
    cover: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&q=80",
    defaultCheckpoints: ["Maddur", "Srirangapatna", "Hunsur"],
  },
  {
    title: "Nilgiri Loop",
    from: { name: "Coimbatore", lat: 11.0168, lng: 76.9558 },
    to: { name: "Ooty", lat: 11.4102, lng: 76.6950 },
    distance: 186, difficulty: "Easy",
    cover: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    defaultCheckpoints: ["Mettupalayam", "Coonoor"],
  },
  {
    title: "Yercaud Hills",
    from: { name: "Salem", lat: 11.6643, lng: 78.1460 },
    to: { name: "Yercaud", lat: 11.7753, lng: 78.2096 },
    distance: 142, difficulty: "Moderate",
    cover: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    defaultCheckpoints: ["Ghat Entry", "Viewpoint"],
  },
  {
    title: "Nandi Hills Sunrise",
    from: { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
    to: { name: "Nandi Hills", lat: 13.3702, lng: 77.6835 },
    distance: 65, difficulty: "Easy",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    defaultCheckpoints: ["Devannahalli", "Base"],
  },
  {
    title: "ECR Coastal Blast",
    from: { name: "Chennai", lat: 13.0827, lng: 80.2707 },
    to: { name: "Mahabalipuram", lat: 12.6208, lng: 80.1945 },
    distance: 87, difficulty: "Easy",
    cover: "https://images.unsplash.com/photo-1506461883276-594a12b14b3c?w=800&q=80",
    defaultCheckpoints: ["Covelong", "Muttukadu"],
  },
];

export const HEAD_SLOW_KM = 3;
export const TAIL_CATCHUP_KM = 3;
export const NOTIFY_COOLDOWN_MS = 30000;
export const CHECKPOINT_RADIUS_KM = 0.35;
export const SIM_RIDER_COUNT = 2;