"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SlotPicker() {
  const {
    ui,
    landers,
    offers,
    closeSlotPicker,
    addSlotItem,
    draft,
  } = useStore();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "landers" | "offers">("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { slotPickerOpen, slotPickerTarget } = ui;

  // Determine slot kind from target
  const targetSlot = slotPickerTarget
    ? draft.paths
        .flatMap((p) => p.slots)
        .find((s) => s.id === slotPickerTarget.slotId)
    : null;

  const slotKind = targetSlot?.kind ?? null;

  const filteredLanders = landers.filter((l) =>
    l.name.toLowerCase().includes(query.toLowerCase()) ||
    l.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );
  const filteredOffers = offers.filter((o) =>
    o.name.toLowerCase().includes(query.toLowerCase()) ||
    o.vertical.toLowerCase().includes(query.toLowerCase())
  );

  type ListItem = { type: "lander" | "offer"; id: string; name: string; sub: string; metric?: string };
  const items: ListItem[] = [
    ...(slotKind === "offer" ? [] : filteredLanders.map((l) => ({
      type: "lander" as const,
      id: l.id,
      name: l.name,
      sub: l.domain,
      metric: l.ctr != null ? `CTR ${l.ctr}%` : undefined,
    }))),
    ...(slotKind === "lander" ? [] : filteredOffers.map((o) => ({
      type: "offer" as const,
      id: o.id,
      name: o.name,
      sub: `${o.network} · ${o.vertical}`,
      metric: `$${o.payout}`,
    }))),
  ];

  const visibleItems =
    tab === "all"
      ? items
      : tab === "landers"
      ? items.filter((i) => i.type === "lander")
      : items.filter((i) => i.type === "offer");

  useEffect(() => {
    if (slotPickerOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [slotPickerOpen]);

  const handleSelect = (item: ListItem) => {
    if (!slotPickerTarget) return;
    addSlotItem(slotPickerTarget.pathId, slotPickerTarget.slotId, {
      type: item.type,
      refId: item.id,
      weight: 100,
    });
    closeSlotPicker();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!slotPickerOpen) return;
      if (e.key === "Escape") closeSlotPicker();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, visibleItems.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && visibleItems[selectedIndex]) {
        handleSelect(visibleItems[selectedIndex]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotPickerOpen, visibleItems, selectedIndex]);

  if (!slotPickerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
        onClick={closeSlotPicker}
      />

      {/* Modal */}
      <div className="relative z-10 w-[560px] rounded-lg border border-border bg-surface-2 shadow-2xl overflow-hidden">
        {/* Search */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search size={14} className="text-text-subtle shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              slotKind === "lander"
                ? "Search landers…"
                : slotKind === "offer"
                ? "Search offers…"
                : "Search landers and offers…"
            }
            className="flex-1 bg-transparent text-sm text-text placeholder:text-text-subtle focus:outline-none"
          />
          <button
            onClick={closeSlotPicker}
            className="text-text-subtle hover:text-text transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Tabs — only show if no slot kind constraint */}
        {!slotKind && (
          <div className="flex border-b border-border px-4">
            {(["all", "landers", "offers"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "py-2 pr-4 text-xs capitalize transition-colors",
                  tab === t
                    ? "border-b-2 border-accent text-text"
                    : "text-text-muted hover:text-text"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* List */}
        <div className="max-h-80 overflow-y-auto py-1">
          {visibleItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-text-subtle">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            visibleItems.map((item, index) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelect(item)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                  index === selectedIndex ? "bg-surface" : "hover:bg-surface"
                )}
              >
                <span
                  className={cn(
                    "inline-flex items-center justify-center w-5 h-5 rounded text-xs font-medium shrink-0",
                    item.type === "lander"
                      ? "bg-info/15 text-info"
                      : "bg-accent/15 text-accent"
                  )}
                >
                  {item.type === "lander" ? "L" : "O"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-text truncate">{item.name}</div>
                  <div className="font-mono text-xs text-text-subtle truncate">{item.sub}</div>
                </div>
                {item.metric && (
                  <span className="shrink-0 rounded bg-surface px-1.5 py-0.5 text-xs text-text-muted">
                    {item.metric}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs text-text-subtle">
            {visibleItems.length} result{visibleItems.length !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-2 text-xs text-text-subtle">
            <kbd className="rounded border border-border px-1">↑↓</kbd>
            <span>navigate</span>
            <kbd className="rounded border border-border px-1">↵</kbd>
            <span>select</span>
            <kbd className="rounded border border-border px-1">Esc</kbd>
            <span>close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
