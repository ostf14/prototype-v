"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { PathSlot } from "@/lib/types";

function SlotBadge({ kind }: { kind: "lander" | "offer" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-5 h-5 rounded text-xs font-medium shrink-0",
        kind === "lander" ? "bg-info/15 text-info" : "bg-accent/15 text-accent"
      )}
    >
      {kind === "lander" ? "L" : "O"}
    </span>
  );
}

type SlotCardProps = {
  pathId: string;
  slot: PathSlot;
  showRemoveItem?: boolean;
};

export function SlotCard({ pathId, slot, showRemoveItem }: SlotCardProps) {
  const { landers, offers, openSlotPicker, removeSlotItem } = useStore();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const resolveItem = (refId: string) => {
    if (slot.kind === "lander") return landers.find((l) => l.id === refId);
    return offers.find((o) => o.id === refId);
  };

  const isEmpty = slot.items.length === 0;
  const isSingle = slot.items.length === 1;
  const item0 = isEmpty ? null : resolveItem(slot.items[0].refId);

  if (isEmpty) {
    return (
      <button
        onClick={() => openSlotPicker(pathId, slot.id)}
        className={cn(
          "flex flex-col items-center justify-center gap-1.5 w-[200px] h-[88px]",
          "rounded-md border border-dashed border-border",
          "hover:border-border-strong hover:bg-surface transition-colors"
        )}
      >
        <SlotBadge kind={slot.kind} />
        <span className="text-xs text-text-subtle">
          Click to select {slot.kind}
        </span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setPopoverOpen((p) => !p)}
        className={cn(
          "flex flex-col gap-1.5 w-[200px] min-h-[88px] p-3 rounded-md border border-border",
          "bg-surface hover:border-border-strong text-left transition-colors"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-1.5">
          <SlotBadge kind={slot.kind} />
          <span className="text-xs font-medium text-text truncate flex-1">
            {isSingle
              ? (item0 && "name" in item0 ? item0.name : "Unknown")
              : `${item0 && "name" in item0 ? item0.name : "Unknown"} +${slot.items.length - 1} more`}
          </span>
          <ChevronDown size={11} className="text-text-subtle shrink-0" />
        </div>

        {/* Domain / URL */}
        {item0 && (
          <span className="font-mono text-xs text-text-subtle truncate">
            {"domain" in item0 ? item0.domain : "url" in item0 ? new URL(item0.url).hostname : ""}
          </span>
        )}

        {/* Metric */}
        {item0 && (
          <div className="flex items-center gap-1.5 mt-auto">
            {"ctr" in item0 && item0.ctr != null && (
              <span className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-text-subtle">
                CTR {item0.ctr}%
              </span>
            )}
            {"cr" in item0 && item0.cr != null && (
              <span className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-text-subtle">
                CR {item0.cr}%
              </span>
            )}
            {slot.items.length > 1 && (
              <span className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-text-subtle">
                {slot.rotation === "weighted" ? "Weighted" : slot.rotation === "sequential" ? "Sequential" : "AI"}
                {" "}
                {slot.items.map((i) => i.weight).join("/")}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Popover for multi-item management */}
      {popoverOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPopoverOpen(false)} />
          <div className="absolute top-full mt-1 z-50 w-64 rounded-md border border-border bg-surface-2 py-1 shadow-lg">
            <div className="px-3 py-2 text-xs font-medium text-text-subtle uppercase tracking-wide border-b border-border">
              {slot.kind === "lander" ? "Landers" : "Offers"} in this slot
            </div>
            {slot.items.map((item) => {
              const resolved = resolveItem(item.refId);
              return (
                <div
                  key={item.refId}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-surface transition-colors"
                >
                  <span className="flex-1 text-xs text-text truncate">
                    {resolved && "name" in resolved ? resolved.name : item.refId}
                  </span>
                  <span className="font-mono text-xs text-text-subtle w-8 text-right">
                    {item.weight}%
                  </span>
                  {showRemoveItem && (
                    <button
                      onClick={() => removeSlotItem(pathId, slot.id, item.refId)}
                      className="text-text-subtle hover:text-danger transition-colors"
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>
              );
            })}
            <div className="border-t border-border mt-1 pt-1">
              <button
                onClick={() => {
                  openSlotPicker(pathId, slot.id);
                  setPopoverOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-text-muted hover:bg-surface hover:text-text transition-colors"
              >
                + Add another {slot.kind}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
