"use client";

import { X, GripVertical, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { SlotCard } from "@/components/destination-canvas/slot-card";
import { PathWeight } from "@/components/destination-canvas/weight-controls";
import { cn } from "@/lib/utils";
import type { Path } from "@/lib/types";

type PathRowProps = {
  path: Path;
  index: number;
  pathCount: number;
  showRemove: boolean;
};

export function PathRow({ path, index, pathCount, showRemove }: PathRowProps) {
  const { removePath, addLanderSlot } = useStore();
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
      className="flex items-center gap-3 group"
    >
      {/* Drag handle */}
      {pathCount > 1 && (
        <div className="cursor-grab text-text-subtle/40 group-hover:text-text-subtle transition-colors">
          <GripVertical size={14} />
        </div>
      )}

      {/* Path name + index */}
      <div className="w-20 shrink-0">
        <span className="text-xs text-text-subtle">Path {index + 1}</span>
        {path.name && (
          <p className="text-xs text-text-muted truncate">{path.name}</p>
        )}
      </div>

      {/* Flow */}
      <div className="flex items-center gap-2 flex-1">
        {/* Lander slot */}
        {hasLander && landerSlot && (
          <>
            <SlotCard pathId={path.id} slot={landerSlot} showRemoveItem />
            <Arrow />
          </>
        )}

        {/* Add lander button (when no lander yet) */}
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

        {/* Offer slot */}
        {offerSlot && (
          <SlotCard pathId={path.id} slot={offerSlot} showRemoveItem />
        )}
      </div>

      {/* Weight */}
      <div className="shrink-0 min-w-24">
        <PathWeight pathId={path.id} pathIndex={index} pathCount={pathCount} />
      </div>

      {/* Remove path */}
      {showRemove && (
        <button
          onClick={() => removePath(path.id)}
          className="opacity-0 group-hover:opacity-100 text-text-subtle hover:text-danger transition-all"
          title="Remove path"
        >
          <X size={13} />
        </button>
      )}
    </motion.div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <div className="w-6 h-px bg-border-strong" />
      <svg width="5" height="8" viewBox="0 0 5 8" fill="none" className="text-border-strong">
        <path d="M0 0L5 4L0 8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
