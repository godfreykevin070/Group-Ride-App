export const USER = {
  name: "Arjun",
  handle: "@arjunrides",
  level: "Road Captain",
  avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1b-X0wSROguBK0MEA75WDLT85zD8jPSwMAV2LM49xWeIQ1OZM8F_rbZlk&s=10",
  memberSince: "2024",
};

export const ACTIVE_BIKE = {
  manufacturer: "Royal Enfield",
  model: "Classic 350",
  nickname: "The Sherpa",
  color: "#D4FF3A",
  year: 2024,
  regNo: "MH 12 AB 1234",
  odometer: 12480,
  tank: 13,
  image:
    "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80",
};

export const RIDER_STATS = {
  totalRides: 47,
  distance: 3240.8,
  fuelCost: 18450,
  avgSpeed: 42,
  maxSpeed: 128,
  ridingTime: "128h 24m",
  streakDays: 12,
  co2Saved: 128.6,
};

export const RIDE_PROGRESS = {
  completed: 14,
  total: 23,
  kmCovered: 4249.1,
  lapsCompleted: 857,
  percent: 60,
};

export const UPCOMING_RIDE = {
  id: "u1",
  title: "Coorg Coffee Trail",
  round: "R12",
  city: "Coorg",
  date: "05 - 07 Oct",
  distance: 264,
  duration: "6h 20m",
  difficulty: "Moderate",
  organizer: "Rahul M.",
  participants: 8,
  image:
    "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=80",
  countdown: { days: 12, hours: 8, minutes: 42 },
  startPoint: "Bengaluru",
  checkpoints: ["Maddur", "Srirangapatna", "Hunsur", "Kushalnagar"],
};

export const UPCOMING_RIDES = [
  UPCOMING_RIDE,
  {
    id: "u2",
    title: "Ooty Nilgiri Loop",
    round: "R13",
    city: "Ooty",
    date: "12 - 14 Oct",
    distance: 186,
    duration: "5h 10m",
    difficulty: "Easy",
    organizer: "Priya S.",
    participants: 5,
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
    countdown: { days: 19, hours: 3, minutes: 12 },
    startPoint: "Coimbatore",
    checkpoints: ["Mettupalayam", "Coonoor", "Ketti"],
  },
  {
    id: "u3",
    title: "Goa Coastal Run",
    round: "R14",
    city: "Goa",
    date: "26 - 29 Oct",
    distance: 592,
    duration: "12h 45m",
    difficulty: "Hard",
    organizer: "Arjun R.",
    participants: 12,
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
    countdown: { days: 33, hours: 14, minutes: 5 },
    startPoint: "Mumbai",
    checkpoints: ["Lonavala", "Kolhapur", "Sawantwadi"],
  },
];

export const RECENT_RIDES = [
  {
    id: "r1",
    title: "Yercaud Hill Climb",
    date: "21 Sep 2026",
    distance: 142.5,
    duration: "3h 24m",
    avgSpeed: 42,
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    color: "#00D68F",
  },
  {
    id: "r2",
    title: "ECR Coastal Blast",
    date: "18 Sep 2026",
    distance: 87.2,
    duration: "2h 10m",
    avgSpeed: 40,
    image:
      "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&q=80",
    color: "#00E5FF",
  },
  {
    id: "r3",
    title: "Nandi Hills Sunrise",
    date: "14 Sep 2026",
    distance: 64.8,
    duration: "1h 52m",
    avgSpeed: 35,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    color: "#8B5CF6",
  },
];

export const RIDE_METRICS = [
  { label: "No. of laps", value: "51", icon: "laps", color: "#FFD60A" },
  { label: "Top speed", value: "351.8", icon: "speed", color: "#00D68F" },
  { label: "Turns", value: "20", icon: "turns", color: "#4A6CF7" },
  { label: "Elevation", value: "26.96M", icon: "elevation", color: "#FF6B35" },
];

export const EXPENSES = [
  { id: "e1", category: "Fuel", amount: 680, date: "21 Sep", note: "HP Pump, Yercaud", color: "#FF6B35" },
  { id: "e2", category: "Toll", amount: 120, date: "21 Sep", note: "Salem Toll", color: "#00E5FF" },
  { id: "e3", category: "Maintenance", amount: 2400, date: "15 Sep", note: "Chain lube + brake pads", color: "#8B5CF6" },
  { id: "e4", category: "Food", amount: 340, date: "21 Sep", note: "Breakfast stop", color: "#D4FF3A" },
  { id: "e5", category: "Fuel", amount: 410, date: "18 Sep", note: "Indian Oil, ECR", color: "#FF6B35" },
];

export const EXPENSE_SUMMARY = {
  thisMonth: 3950,
  monthly: 12840,
  fuel: 3200,
  food: 1240,
  toll: 480,
  maintenance: 2400,
};

export const BIKES = [
  {
    id: "b1",
    manufacturer: "Royal Enfield",
    model: "Classic 350",
    nickname: "The Sherpa",
    regNo: "MH 12 AB 1234",
    odometer: 12480,
    lastService: "10 Aug 2026",
    nextService: "10 Nov 2026",
    color: "#D4FF3A",
    image:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
  },
  {
    id: "b2",
    manufacturer: "KTM",
    model: "Duke 390",
    nickname: "The Scalpel",
    regNo: "KA 05 XY 9876",
    odometer: 8320,
    lastService: "22 Jul 2026",
    nextService: "22 Oct 2026",
    color: "#FF6B35",
    image:
      "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&q=80",
  },
];

export const NEARBY_RIDERS = [
  { id: "n1", name: "Rahul M.", distance: "2.4 km", avatar: "https://i.pravatar.cc/100?img=12", status: "riding" },
  { id: "n2", name: "Priya S.", distance: "5.1 km", avatar: "https://i.pravatar.cc/100?img=45", status: "idle" },
  { id: "n3", name: "Vikram K.", distance: "8.7 km", avatar: "https://i.pravatar.cc/100?img=33", status: "riding" },
  { id: "n4", name: "Aditi R.", distance: "11.2 km", avatar: "https://i.pravatar.cc/100?img=48", status: "idle" },
];

export const CONVOY_RIDERS = [
  { id: "c1", name: "You", avatar: "https://i.pravatar.cc/100?img=8", speed: 42 },
  { id: "c2", name: "Rahul", avatar: "https://i.pravatar.cc/100?img=12", speed: 38 },
  { id: "c3", name: "Priya", avatar: "https://i.pravatar.cc/100?img=45", speed: 40 },
  { id: "c4", name: "Vikram", avatar: "https://i.pravatar.cc/100?img=33", speed: 44 },
];

export const GROUP_RIDES = [
  {
    id: "g1",
    title: "Sunday Ghat Run",
    date: "26 Sep",
    riders: 12,
    max: 20,
    distance: 142,
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
  },
  {
    id: "g2",
    title: "Coastal Blast",
    date: "28 Sep",
    riders: 8,
    max: 15,
    distance: 210,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
  },
  {
    id: "g3",
    title: "Hill Sprint",
    date: "01 Oct",
    riders: 5,
    max: 10,
    distance: 84,
    image: "https://images.unsplash.com/photo-1508992702592-5a3d4ecd6c40?w=800&q=80",
  },
];

export const SAFETY_CONTACTS = [
  { id: "s1", name: "Priya (Wife)", phone: "+91 98765 43210" },
  { id: "s2", name: "Rahul (Riding Buddy)", phone: "+91 91234 56789" },
];