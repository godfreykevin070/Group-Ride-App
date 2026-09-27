import {
  Home, MessageCircle, Route, Users, User, Plus, X, ArrowLeft, ArrowRight, ChevronRight, ChevronDown, ChevronUp,
  MapPin, Navigation, Crosshair, Play, Pause, Flag, Coffee, Fuel, UtensilsCrossed, Cross,
  Camera, Video, Image as ImageIcon, Share2, Copy, Map, Calendar, Clock, Award, Trophy,
  Pencil, Trash2, Shield, Phone, Radio, AlertTriangle, AlertCircle, CheckCircle, Check,
  Bell, Search, Sparkles, Settings, HelpCircle, LogOut, Zap, Signal, Wifi, BatteryFull,
  TrendingUp, Lock, Hash, Mail, Link as LinkIcon, MoreVertical, MoreHorizontal, BookOpen,
  Instagram, Twitter, Facebook, Send, CalendarPlus, UserPlus, UserMinus, RefreshCw as RotateCw,
  Bike, Flame, Star, Target, Rocket, Crown, Ghost, Cat, Dog, Bird, Fish, Squirrel,
  Rabbit, Mountain, Waves, Sun, Compass, Sword, Snowflake, Leaf, Anchor,
  ArrowUp, ArrowDown, CornerUpLeft, CornerUpRight, Merge,
  type LucideIcon,
} from "lucide-react-native";

export const Icons: Record<string, LucideIcon> = {
  home: Home, chat: MessageCircle, route: Route, users: Users, user: User,
  plus: Plus, x: X, back: ArrowLeft, arrowRight: ArrowRight,
  chevronRight: ChevronRight, chevronDown: ChevronDown, chevronUp: ChevronUp,
  pin: MapPin, nav: Navigation, crosshair: Crosshair, play: Play, pause: Pause, flag: Flag,
  coffee: Coffee, fuel: Fuel, food: UtensilsCrossed, cross: Cross,
  camera: Camera, video: Video, image: ImageIcon, share: Share2, copy: Copy, map: Map,
  calendar: Calendar, clock: Clock, award: Award, trophy: Trophy, pencil: Pencil, trash: Trash2,
  shield: Shield, phone: Phone, radio: Radio, alert: AlertTriangle, alertCircle: AlertCircle,
  checkCircle: CheckCircle, check: Check, bell: Bell, search: Search, sparkles: Sparkles,
  settings: Settings, help: HelpCircle, logout: LogOut, zap: Zap, signal: Signal, wifi: Wifi,
  battery: BatteryFull, trending: TrendingUp, lock: Lock, hash: Hash, mail: Mail, link: LinkIcon,
  more: MoreVertical, moreH: MoreHorizontal, book: BookOpen, instagram: Instagram,
  twitter: Twitter, facebook: Facebook, send: Send, calendarPlus: CalendarPlus,
  userPlus: UserPlus, userMinus: UserMinus, refresh: RotateCw,
  bike: Bike, flame: Flame, star: Star, target: Target, rocket: Rocket, crown: Crown,
  ghost: Ghost, cat: Cat, dog: Dog, bird: Bird, fish: Fish, squirrel: Squirrel,
  rabbit: Rabbit, mountain: Mountain, waves: Waves, sun: Sun, compass: Compass,
  sword: Sword, snowflake: Snowflake, leaf: Leaf, anchor: Anchor,
  // Navigation icons
  arrowUp: ArrowUp, arrowDown: ArrowDown,
  cornerLeft: CornerUpLeft, cornerRight: CornerUpRight,
  rotate: RotateCw, merge: Merge,
};

interface Props {
  name: keyof typeof Icons | string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, color = "#F0F3F8", strokeWidth = 2.2 }: Props) {
  const Comp = Icons[name as string];
  if (!Comp) return null;
  return <Comp size={size} color={color} strokeWidth={strokeWidth} />;
}