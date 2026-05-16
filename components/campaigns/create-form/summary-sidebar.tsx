"use client";

import { AlertTriangle } from "lucide-react";
import { useStore } from "@/lib/store";
import { getPathLabel } from "@/lib/utils";
import type { DraftCampaign } from "@/lib/types";

function MiniFlowSvg() {
  const { draft } = useStore();
  const { paths, splitMode } = draft;

  if (paths.length === 0) {
    return (
      <div className="flex items-center justify-center h-14 rounded border border-dashed border-border">
        <span className="text-xs text-text-subtle">No paths configured</span>
      </div>
    );
  }

  // Simple SVG mini-viz
  const pathCount = paths.length;
  const svgHeight = Math.max(48, pathCount * 28);
  const cardW = 28;
  const cardH = 16;
  const gap = 20;
  const startX = 8;

  return (
    <svg
      width="100%"
      height={svgHeight}
      viewBox={`0 0 200 ${svgHeight}`}
      className="overflow-visible"
    >
      {paths.map((path, i) => {
        const y = pathCount === 1 ? svgHeight / 2 - cardH / 2 : (i * svgHeight) / pathCount + 4;
        const hasLander = path.slots.some((s) => s.kind === "lander");
        const offerX = hasLander ? startX + cardW + gap : startX;

        return (
          <g key={path.id}>
            {hasLander && (
              <>
                <rect
                  x={startX}
                  y={y}
                  width={cardW}
                  height={cardH}
                  rx={2}
                  fill="rgba(59,130,246,0.1)"
                  stroke="rgba(59,130,246,0.3)"
                  strokeWidth={0.5}
                />
                <text
                  x={startX + cardW / 2}
                  y={y + cardH / 2 + 3.5}
                  textAnchor="middle"
                  fontSize="7"
                  fill="#3B82F6"
                  fontFamily="monospace"
                >
                  L
                </text>
                <line
                  x1={startX + cardW}
                  y1={y + cardH / 2}
                  x2={offerX}
                  y2={y + cardH / 2}
                  stroke="#27272A"
                  strokeWidth={0.75}
                />
              </>
            )}
            <rect
              x={offerX}
              y={y}
              width={cardW}
              height={cardH}
              rx={2}
              fill="rgba(16,185,129,0.1)"
              stroke="rgba(16,185,129,0.3)"
              strokeWidth={0.5}
            />
            <text
              x={offerX + cardW / 2}
              y={y + cardH / 2 + 3.5}
              textAnchor="middle"
              fontSize="7"
              fill="#10B981"
              fontFamily="monospace"
            >
              O
            </text>
          </g>
        );
      })}

      {/* Mode label */}
      {splitMode.kind !== "weighted" && (
        <text x="100" y={svgHeight - 4} textAnchor="middle" fontSize="8" fill="#71717A">
          {splitMode.kind === "ai" ? "AI" : "Rules"}
        </text>
      )}
    </svg>
  );
}

type Warning = { message: string };

function computeWarnings(draft: DraftCampaign): Warning[] {
  const warnings: Warning[] = [];
  const pathCount = draft.paths.length;
  draft.paths.forEach((path, i) => {
    const offerSlot = path.slots.find((s) => s.kind === "offer");
    if (!offerSlot || offerSlot.items.length === 0) {
      const label = getPathLabel(i, pathCount, draft.splitMode);
      warnings.push({ message: `${label} has no offer configured` });
    }
  });
  if (!draft.trafficSourceId) {
    warnings.push({ message: "No traffic source selected" });
  }
  if (!draft.name.trim()) {
    warnings.push({ message: "Campaign name is empty" });
  }
  return warnings;
}

export function SummarySidebar({ draftLastSaved }: { draftLastSaved: number | null }) {
  const { draft, trafficSources } = useStore();
  const { paths, splitMode, cost, tracking } = draft;

  const totalPaths = paths.length;
  const totalLanders = paths.reduce(
    (sum, p) => sum + p.slots.filter((s) => s.kind === "lander" && s.items.length > 0).reduce((s, slot) => s + slot.items.length, 0),
    0
  );
  const totalOffers = paths.reduce(
    (sum, p) => sum + p.slots.filter((s) => s.kind === "offer" && s.items.length > 0).reduce((s, slot) => s + slot.items.length, 0),
    0
  );

  const ts = trafficSources.find((t) => t.id === draft.trafficSourceId);
  const warnings = computeWarnings(draft);

  const costStr =
    cost.type === "not-tracked"
      ? "Not tracked"
      : cost.type === "auto"
      ? "Auto"
      : `${cost.type.toUpperCase()} ${cost.value != null ? `$${cost.value}` : ""}`.trim();

  const distStr =
    splitMode.kind === "weighted"
      ? paths.length > 1
        ? `Weighted ${paths.map((p) => `${p.weight}%`).join("/")}`
        : "Single path"
      : splitMode.kind === "rule-based"
      ? `Rule-based · ${(splitMode.rules ?? []).reduce((sum, r) => sum + r.conditions.length, 0)} conditions`
      : `AI · ${splitMode.goal?.toUpperCase() ?? "EPC"}`;

  const trackingUrl =
    `https://${tracking.customDomain ?? "track.voluum.com"}/c/{clickid}` +
    (ts ? `?source=${encodeURIComponent(ts.name)}` : "");

  const autoSavedLabel = draftLastSaved
    ? `Saved ${Math.round((Date.now() - draftLastSaved) / 1000)}s ago`
    : "Not saved";

  return (
    <div className="flex flex-col gap-4 sticky top-0">
      {/* Mini flow */}
      <div>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-subtle">
          Flow Preview
        </h3>
        <MiniFlowSvg />
      </div>

      {/* Config summary */}
      <div>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-subtle">
          Configuration
        </h3>
        <div className="flex flex-col gap-1.5">
          <SummaryRow
            label="Paths"
            value={
              totalPaths === 0
                ? "None"
                : `${totalPaths} path${totalPaths !== 1 ? "s" : ""}${totalLanders > 0 ? ` · ${totalLanders} lander${totalLanders !== 1 ? "s" : ""}` : ""} · ${totalOffers} offer${totalOffers !== 1 ? "s" : ""}`
            }
          />
          <SummaryRow label="Cost" value={costStr || "Not set"} />
          <SummaryRow label="Distribution" value={distStr} />
          {ts && <SummaryRow label="Source" value={ts.name} />}
          {draft.country && <SummaryRow label="Country" value={draft.country} />}
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-subtle">
            Issues
          </h3>
          <div className="flex flex-col gap-1.5">
            {warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2">
                <AlertTriangle size={12} className="shrink-0 text-warning mt-0.5" />
                <span className="text-xs text-text-muted">{w.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Token preview */}
      <div>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-text-subtle">
          Tracking URL
        </h3>
        <p className="font-mono text-xs text-text-subtle break-all leading-relaxed">
          {trackingUrl}
        </p>
      </div>

      {/* Keyboard hints */}
      <div className="border-t border-border pt-3">
        <div className="flex flex-col gap-1">
          <ShortcutHint keys="⌘↵" label="Save campaign" />
          <ShortcutHint keys="⌘D" label="Duplicate" />
          <ShortcutHint keys="Esc" label="Cancel" />
        </div>
      </div>

      {/* Auto-save */}
      <p className="text-xs text-text-subtle">{autoSavedLabel}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-24 shrink-0 text-xs text-text-subtle">{label}</span>
      <span className="text-xs text-text-muted">{value}</span>
    </div>
  );
}

function ShortcutHint({ keys, label }: { keys: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <kbd className="rounded border border-border px-1.5 py-0.5 text-xs text-text-subtle font-mono">
        {keys}
      </kbd>
      <span className="text-xs text-text-subtle">{label}</span>
    </div>
  );
}
