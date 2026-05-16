"use client";

import { useState } from "react";
import { X, ChevronDown, GripVertical } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { PathSlot, SlotItem } from "@/lib/types";

const ROTATION_LABELS: Record<PathSlot["rotation"], string> = {
  weighted: "Weighted",
  sequential: "Sequential",
  ai: "AI",
};

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

// Inline weight editor for micro-rows. Click value → input → blur/Enter saves.
function WeightCell({
  pathId,
  slotId,
  item,
}: {
  pathId: string;
  slotId: string;
  item: SlotItem;
}) {
  const { updateSlotItemWeight } = useStore();
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(String(item.weight));

  const commit = () => {
    const n = parseInt(val, 10);
    if (!isNaN(n) && n >= 0 && n <= 100) {
      updateSlotItemWeight(pathId, slotId, item.refId, n);
    } else {
      setVal(String(item.weight));
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setVal(String(item.weight));
            setEditing(false);
          }
        }}
        className="w-10 shrink-0 rounded border border-accent bg-bg px-1 py-0 text-right font-mono text-xs text-text outline-none"
      />
    );
  }

  return (
    <button
      onClick={() => {
        setVal(String(item.weight));
        setEditing(true);
      }}
      className="w-10 shrink-0 text-right font-mono text-xs text-text-subtle hover:text-text transition-colors"
    >
      {item.weight}%
    </button>
  );
}

// Popover for add/remove/reorder/rotation. Weights are intentionally absent —
// they are edited inline in the card body.
function SlotPopover({
  pathId,
  slot,
  onClose,
  showRemoveItem,
}: {
  pathId: string;
  slot: PathSlot;
  onClose: () => void;
  showRemoveItem?: boolean;
}) {
  const { landers, offers, openSlotPicker, removeSlotItem, draft, setDraft } =
    useStore();

  const resolveItem = (refId: string) => {
    if (slot.kind === "lander") return landers.find((l) => l.id === refId);
    return offers.find((o) => o.id === refId);
  };

  const updateRotation = (rotation: PathSlot["rotation"]) => {
    setDraft({
      paths: draft.paths.map((path) => ({
        ...path,
        slots: path.slots.map((s) =>
          s.id === slot.id ? { ...s, rotation } : s
        ),
      })),
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full mt-1 z-50 w-64 rounded-md border border-border bg-surface-2 py-1 shadow-lg">
        {/* Header */}
        <div className="px-3 py-2 text-xs font-medium text-text-subtle uppercase tracking-wide border-b border-border">
          {slot.kind === "lander" ? "Landers" : "Offers"} in this slot
        </div>

        {/* Rotation toggle */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
          <span className="text-xs text-text-subtle">Rotation</span>
          <div className="flex items-center gap-0.5 ml-auto">
            {(["weighted", "sequential", "ai"] as const).map((r) => (
              <button
                key={r}
                onClick={() => updateRotation(r)}
                className={cn(
                  "px-2 py-0.5 text-xs rounded transition-colors",
                  slot.rotation === r
                    ? "bg-accent/15 text-accent"
                    : "text-text-muted hover:bg-surface hover:text-text"
                )}
              >
                {ROTATION_LABELS[r]}
              </button>
            ))}
          </div>
        </div>

        {/* Items: drag handle + name + remove. No weights — edited inline. */}
        {slot.items.map((item) => {
          const resolved = resolveItem(item.refId);
          return (
            <div
              key={item.refId}
              className="flex items-center gap-2 px-3 py-2 hover:bg-surface transition-colors"
            >
              {/* TODO: wire up dnd-kit sortable for reorder */}
              <GripVertical
                size={12}
                className="text-text-subtle/40 cursor-grab shrink-0"
              />
              <span className="flex-1 text-xs text-text truncate">
                {resolved && "name" in resolved ? resolved.name : item.refId}
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

        {/* Add another */}
        <div className="border-t border-border mt-1 pt-1">
          <button
            onClick={() => {
              openSlotPicker(pathId, slot.id);
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-text-muted hover:bg-surface hover:text-text transition-colors"
          >
            + Add another {slot.kind}
          </button>
        </div>
      </div>
    </>
  );
}

type SlotCardProps = {
  pathId: string;
  slot: PathSlot;
  showRemoveItem?: boolean;
};

export function SlotCard({ pathId, slot, showRemoveItem }: SlotCardProps) {
  const { landers, offers, openSlotPicker } = useStore();
  // All hooks at top — level is determined below, not here.
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [search, setSearch] = useState("");

  const resolveItem = (refId: string) => {
    if (slot.kind === "lander") return landers.find((l) => l.id === refId);
    return offers.find((o) => o.id === refId);
  };

  const count = slot.items.length;
  const item0 = count > 0 ? resolveItem(slot.items[0].refId) : null;
  const item0Name = item0 && "name" in item0 ? item0.name : "Unknown";

  // Display levels:
  // 1     — single item OR offer slot (offer slot is always fixed/compact)
  // "2-4" — lander slot with 2–4 items: inline micro-rows, weights visible
  // "5-9" — lander slot with 5–9 items: scrollable compact table, weights visible
  // "10+" — lander slot with 10+ items: search + scrollable table + weights visible
  // Offer slot is always level 1 regardless of item count.
  const level =
    count === 0
      ? 0
      : slot.kind === "offer" || count === 1
      ? 1
      : count <= 4
      ? "2-4"
      : count <= 9
      ? "5-9"
      : "10+";

  // ── Empty state ──────────────────────────────────────────────────────────
  if (level === 0) {
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

  // ── Level 1: single item or fixed offer slot ─────────────────────────────
  if (level === 1) {
    return (
      <div className="relative">
        <button
          onClick={() => setPopoverOpen((p) => !p)}
          className={cn(
            "flex flex-col gap-1.5 w-[200px] min-h-[88px] p-3 rounded-md border border-border",
            "bg-surface hover:border-border-strong text-left transition-colors"
          )}
        >
          <div className="flex items-center gap-1.5">
            <SlotBadge kind={slot.kind} />
            <span className="text-xs font-medium text-text truncate flex-1">
              {count === 1
                ? item0Name
                : `${item0Name} +${count - 1} more`}
            </span>
            <ChevronDown size={11} className="text-text-subtle shrink-0" />
          </div>
          {item0 && (
            <span className="font-mono text-xs text-text-subtle truncate">
              {"domain" in item0
                ? item0.domain
                : "url" in item0
                ? new URL(item0.url).hostname
                : ""}
            </span>
          )}
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
              {count > 1 && (
                <span className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-text-subtle">
                  {ROTATION_LABELS[slot.rotation]}
                </span>
              )}
            </div>
          )}
        </button>
        {popoverOpen && (
          <SlotPopover
            pathId={pathId}
            slot={slot}
            onClose={() => setPopoverOpen(false)}
            showRemoveItem={showRemoveItem}
          />
        )}
      </div>
    );
  }

  // ── Level 2–4: lander slot grows down with inline weight micro-rows ──────
  if (level === "2-4") {
    return (
      <div className="relative">
        <div className="flex flex-col w-[200px] rounded-md border border-border bg-surface">
          {/* Header — click opens popover for add/remove/reorder/rotation */}
          <button
            onClick={() => setPopoverOpen((p) => !p)}
            className="flex items-center gap-1.5 px-3 py-2 hover:bg-surface-2 transition-colors rounded-t-md"
          >
            <SlotBadge kind={slot.kind} />
            <span className="text-xs font-medium text-text truncate flex-1">
              {item0Name}{" "}
              <span className="text-text-subtle font-normal">
                +{count - 1}
              </span>
            </span>
            <span className="text-xs text-text-subtle shrink-0">
              {ROTATION_LABELS[slot.rotation]}
            </span>
            <ChevronDown size={11} className="text-text-subtle shrink-0" />
          </button>

          {/* Micro-rows: name + inline weight edit */}
          <div className="flex flex-col border-t border-border">
            {slot.items.map((item) => {
              const resolved = resolveItem(item.refId);
              const name =
                resolved && "name" in resolved ? resolved.name : item.refId;
              return (
                <div
                  key={item.refId}
                  className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border/50 last:border-0"
                >
                  <span className="flex-1 text-xs text-text-muted truncate">
                    {name}
                  </span>
                  <WeightCell pathId={pathId} slotId={slot.id} item={item} />
                </div>
              );
            })}
          </div>
        </div>
        {popoverOpen && (
          <SlotPopover
            pathId={pathId}
            slot={slot}
            onClose={() => setPopoverOpen(false)}
            showRemoveItem={showRemoveItem}
          />
        )}
      </div>
    );
  }

  // ── Level 5–9: scrollable compact table with inline weights ──────────────
  if (level === "5-9") {
    return (
      <div className="relative">
        <div className="flex flex-col w-[200px] rounded-md border border-border bg-surface">
          <button
            onClick={() => setPopoverOpen((p) => !p)}
            className="flex items-center gap-1.5 px-3 py-2 hover:bg-surface-2 transition-colors rounded-t-md"
          >
            <SlotBadge kind={slot.kind} />
            <span className="text-xs font-medium text-text flex-1">
              {count} landers
            </span>
            <span className="text-xs text-text-subtle shrink-0">
              {ROTATION_LABELS[slot.rotation]}
            </span>
            <ChevronDown size={11} className="text-text-subtle shrink-0" />
          </button>
          <div className="flex flex-col border-t border-border overflow-y-auto max-h-[176px]">
            {slot.items.map((item) => {
              const resolved = resolveItem(item.refId);
              const name =
                resolved && "name" in resolved ? resolved.name : item.refId;
              return (
                <div
                  key={item.refId}
                  className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border/50 last:border-0"
                >
                  <span className="flex-1 text-xs text-text-muted truncate">
                    {name}
                  </span>
                  <WeightCell pathId={pathId} slotId={slot.id} item={item} />
                </div>
              );
            })}
          </div>
        </div>
        {popoverOpen && (
          <SlotPopover
            pathId={pathId}
            slot={slot}
            onClose={() => setPopoverOpen(false)}
            showRemoveItem={showRemoveItem}
          />
        )}
      </div>
    );
  }

  // ── Level 10+: search + scrollable table with inline weights ─────────────
  // TODO: add tanstack-virtual for true virtualization beyond ~50 items
  const filtered = slot.items.filter((item) => {
    const resolved = resolveItem(item.refId);
    const name =
      resolved && "name" in resolved ? resolved.name : item.refId;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="relative">
      <div className="flex flex-col w-[240px] rounded-md border border-border bg-surface">
        <button
          onClick={() => setPopoverOpen((p) => !p)}
          className="flex items-center gap-1.5 px-3 py-2 hover:bg-surface-2 transition-colors rounded-t-md"
        >
          <SlotBadge kind={slot.kind} />
          <span className="text-xs font-medium text-text flex-1">
            {count} landers
          </span>
          <span className="text-xs text-text-subtle shrink-0">
            {ROTATION_LABELS[slot.rotation]}
          </span>
          <ChevronDown size={11} className="text-text-subtle shrink-0" />
        </button>
        <div className="border-t border-border px-3 py-1.5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search landers…"
            className="w-full bg-transparent text-xs text-text placeholder:text-text-subtle focus:outline-none"
          />
        </div>
        <div className="flex flex-col border-t border-border overflow-y-auto max-h-[176px]">
          {filtered.map((item) => {
            const resolved = resolveItem(item.refId);
            const name =
              resolved && "name" in resolved ? resolved.name : item.refId;
            return (
              <div
                key={item.refId}
                className="flex items-center gap-1.5 px-3 py-1.5 border-b border-border/50 last:border-0"
              >
                <span className="flex-1 text-xs text-text-muted truncate">
                  {name}
                </span>
                <WeightCell pathId={pathId} slotId={slot.id} item={item} />
              </div>
            );
          })}
        </div>
      </div>
      {popoverOpen && (
        <SlotPopover
          pathId={pathId}
          slot={slot}
          onClose={() => setPopoverOpen(false)}
          showRemoveItem={showRemoveItem}
        />
      )}
    </div>
  );
}
