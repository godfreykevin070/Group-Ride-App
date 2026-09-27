import { RouteStep } from "../constants/types";

export type TurnIcon = "arrowUp" | "arrowDown" | "cornerLeft" | "cornerRight" | "merge" | "flag" | "rotate";

export function iconForStep(step: RouteStep): TurnIcon {
  if (step.maneuver === "arrive") return "flag";
  if (step.maneuver === "depart") return "arrowUp";
  if (step.maneuver === "roundabout" || step.maneuver === "rotary") return "rotate";
  if (step.maneuver === "merge") return "merge";
  if (step.maneuver === "fork") {
    return step.modifier?.includes("left") ? "cornerLeft" : "cornerRight";
  }
  if (step.modifier?.includes("left")) return "cornerLeft";
  if (step.modifier?.includes("right")) return "cornerRight";
  if (step.modifier === "uturn") return "arrowDown";
  return "arrowUp";
}

export function currentStepIndex(steps: RouteStep[] | undefined, progressKm: number): number {
  if (!steps || !steps.length) return 0;
  let idx = 0;
  for (let i = 0; i < steps.length; i++) {
    if (steps[i].cumStartKm <= progressKm + 0.01) idx = i;
    else break;
  }
  return idx;
}

export function fmtDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function fmtEta(durationSec: number): string {
  const mins = Math.round(durationSec / 60);
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}