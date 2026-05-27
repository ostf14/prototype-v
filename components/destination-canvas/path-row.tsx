"use client";

import { X, GripVertical, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { SlotCard } from "@/components/destination-canvas/slot-card";
import {
  PathWeight,
  ConditionGate,
} from "@/components/destination-canvas/weight-controls";
import { cn, getPathLabel } from "@/lib/utils";
import type { Path } from "@/lib/types";

type PathRowProps = {
  path: Path;
  index: number;
  pathCount: number;
  showRemove: boolean;
};

export function PathRow({ path, index, pathCount, showRemove }: PathRowProps) {
  const { removePath, addLanderSlot, draft } = useStore();
  const { splitMode } = draft;
  const isRuleBased = splitMode.kind === "rule-based";
  // In rule-based mode the last path is ELSE: fixed, non-draggable, non-removable.
  const isFallback = isRuleBased && index === pathCount - 1;

  const hasLander = path.slots.some((s) => s.kind === "lander");
  const offerSlot = path.slots.find((s) => s.kind === "offer");
  const landerSlot = path.slots.find((s) => s.kind === "lander");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="flex items-start group"
    >
      {/* STICKY LEFT — drag handle + (path label OR condition gate).
          Stays put while the slot track scrolls horizontally underneath.
          bg-bg matches the Section body so scrolling content is hidden. */}
      <div className="sticky left-0 z-10 bg-bg flex items-start gap-3 pr-4 shrink-0">
        {/* Drag handle: visible for all non-ELSE paths when multi-path.
            In rule-based mode dragging changes priority order. */}
        {pathCount > 1 && !isFallback && (
          <div
            className="self-center cursor-grab text-text-subtle/40 group-hover:text-text-subtle transition-colors"
            title={isRuleBased ? "Drag to change priority" : undefined}
          >
            <GripVertical size={14} />
          </div>
        )}
        {/* Spacer keeps flow aligned on the non-draggable ELSE row */}
        {pathCount > 1 && isFallback && <div className="w-3.5 shrink-0" />}

        {/* Left label: "Path N" in weighted/ai mode.
            In rule-based mode the priority number lives inside ConditionGate. */}
        {!isRuleBased && (
          <div className="w-20 shrink-0 self-center">
            <span className="text-xs text-text-subtle">
              {getPathLabel(index, pathCount, splitMode)}
            </span>
            {path.name && (
              <p className="text-xs text-text-muted truncate">{path.name}</p>
            )}
          </div>
        )}

        {/* Condition gate (rule-based mode only, left of slot flow) */}
        {isRuleBased && (
          <ConditionGate
            pathId={path.id}
            pathIndex={index}
            pathCount={pathCount}
          />
        )}
      </div>

      {/* SCROLLABLE — slot flow. items-start so the arrow pins to the
          top edge of the lander stack without a hardcoded height offset. */}
      <div className="flex items-start gap-2">
        {hasLander && landerSlot && (
          <>
            <SlotCard pathId={path.id} slot={landerSlot} showRemoveItem />
            <Arrow />
          </>
        )}

        {!hasLander && (
          <>
            <button
              onClick={() => addLanderSlot(path.id)}
              className={cn(
                "flex items-center gap-1.5 w-[200px] h-[88px] rounded-md border border-dashed border-border",
                "text-xs text-text-subtle hover:border-border-strong hover:bg-surface transition-colors justify-center"
              )}
            >
              <Plus size={12} />
              Add lander
            </button>
            <Arrow />
          </>
        )}

        {offerSlot && (
          // id anchor — Issues panel links here when "{path} has no offer".
          <div id={`path-${path.id}-offer`} className="rounded-md">
            <SlotCard pathId={path.id} slot={offerSlot} showRemoveItem />
          </div>
        )}
      </div>

      {/* Weight: weighted and ai modes only (rule-based uses ConditionGate).
          Scrolls together with the slot flow. */}
      {!isRuleBased && (
        <div className="ml-3 shrink-0 min-w-24 self-center">
          <PathWeight
            pathId={path.id}
            pathIndex={index}
            pathCount={pathCount}
          />
        </div>
      )}

      {/* Remove: not available on the ELSE row */}
      {showRemove && !isFallback && (
        <button
          onClick={() => removePath(path.id)}
          className="ml-2 self-start mt-1 opacity-0 group-hover:opacity-100 text-text-subtle hover:text-danger transition-all"
          title="Remove path"
        >
          <X size={13} />
        </button>
      )}
    </motion.div>
  );
}

// Arrow connects lander slot to offer slot.
// self-start pins it to the top of the slot stack; parent is items-start
// so no explicit height offset is needed.
function Arrow() {
  return (
    <div className="self-start flex items-center gap-1 shrink-0">
      <div className="w-6 h-px bg-border-strong" />
      <svg
        width="5"
        height="8"
        viewBox="0 0 5 8"
        fill="none"
        className="text-border-strong"
      >
        <path d="M0 0L5 4L0 8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
