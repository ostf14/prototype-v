import { cn } from "@/lib/utils";
import type { Campaign } from "@/lib/types";

const STATUS_CONFIG = {
  active: { dot: "bg-accent", label: "Active" },
  paused: { dot: "bg-warning", label: "Paused" },
  archived: { dot: "bg-text-subtle", label: "Archived" },
  draft: { dot: "bg-info", label: "Draft" },
} satisfies Record<Campaign["status"], { dot: string; label: string }>;

export function StatusDot({
  status,
  showLabel = true,
}: {
  status: Campaign["status"];
  showLabel?: boolean;
}) {
  const config = STATUS_CONFIG[status];
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-1.5 rounded-full shrink-0", config.dot)} />
      {showLabel && (
        <span
          className={cn(
            "text-xs",
            status === "active" ? "text-accent" : "text-text-muted"
          )}
        >
          {config.label}
        </span>
      )}
    </span>
  );
}
