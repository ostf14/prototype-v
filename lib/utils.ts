import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SplitMode } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Single source of truth for how a path is referred to in the UI.
// Used both by path-row (canvas label) and the validator (issue messages)
// so the visible label and error text stay in sync.
// In rule-based mode the last path is the fallback — shown as "ELSE path",
// not as a numeric "Path N". Other paths use their priority number, which
// equals (index + 1) since path order = priority order.
export function getPathLabel(
  index: number,
  pathCount: number,
  splitMode: SplitMode
): string {
  if (splitMode.kind === "rule-based" && index === pathCount - 1) {
    return "ELSE path";
  }
  return `Path ${index + 1}`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatCurrency(n: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}
