import { View } from "react-native";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  variant?: "surface" | "surface2" | "surface3";
}

export function Card({ children, className = "", variant = "surface" }: Props) {
  const bg = variant === "surface" ? "bg-surface" : variant === "surface2" ? "bg-surface-2" : "bg-surface-3";
  return (
    <View className={`${bg} rounded-[20px] border border-white/8 ${className}`}>
      {children}
    </View>
  );
}