import { cn } from "@/lib/utils";
import type { Campaign } from "@/lib/types";

function SlotBadge({ kind }: { kind: "lander" | "offer" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-5 h-5 rounded text-xs font-medium",
        kind === "lander"
          ? "bg-info/15 text-info"
          : "bg-accent/15 text-accent"
      )}
    >
      {kind === "lander" ? "L" : "O"}
    </span>
  );
}

export function FlowMiniViz({ campaign }: { campaign: Campaign }) {
  const { paths, splitMode } = campaign;

  if (paths.length === 0) {
    return <span className="text-xs text-text-subtle">No paths</span>;
  }

  // AI mode
  if (splitMode.kind === "ai") {
    return (
      <span className="flex items-center gap-1.5">
        <span className="rounded bg-info/10 px-1.5 py-0.5 text-xs text-info font-medium">AI</span>
        <span className="text-xs text-text-subtle">·</span>
        <span className="text-xs text-text-muted">{paths.length} paths</span>
      </span>
    );
  }

  // Rule-based
  if (splitMode.kind === "rule-based") {
    return (
      <span className="flex items-center gap-1.5">
        <span className="rounded bg-warning/10 px-1.5 py-0.5 text-xs text-warning font-medium">Rules</span>
        <span className="text-xs text-text-subtle">·</span>
        <span className="text-xs text-text-muted">{paths.length} paths</span>
      </span>
    );
  }

  // Single path — show slots inline
  if (paths.length === 1) {
    const path = paths[0];
    return (
      <span className="flex items-center gap-1">
        {path.slots.map((slot, i) => (
          <span key={slot.id} className="flex items-center gap-1">
            {i > 0 && <span className="text-text-subtle text-xs">→</span>}
            <SlotBadge kind={slot.kind} />
            {slot.items.length > 1 && (
              <span className="text-xs text-text-subtle">×{slot.items.length}</span>
            )}
          </span>
        ))}
      </span>
    );
  }

  // Multi-path — abbreviated
  const firstPath = paths[0];
  const hasLander = firstPath.slots.some((s) => s.kind === "lander");
  return (
    <span className="flex items-center gap-1.5">
      <span className="flex items-center gap-1">
        {hasLander && <SlotBadge kind="lander" />}
        {hasLander && <span className="text-text-subtle text-xs">→</span>}
        <SlotBadge kind="offer" />
      </span>
      <span className="text-xs text-text-subtle">·</span>
      <span className="text-xs text-text-muted">{paths.length} paths</span>
    </span>
  );
}
