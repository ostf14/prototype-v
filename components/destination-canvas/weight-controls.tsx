"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { SplitMode } from "@/lib/types";

const SPLIT_MODE_OPTIONS: { value: SplitMode["kind"]; label: string }[] = [
  { value: "weighted", label: "Weighted" },
  { value: "rule-based", label: "Rule-based" },
  { value: "ai", label: "AI" },
];

const CONDITION_FIELDS = [
  { value: "country", label: "Country" },
  { value: "device", label: "Device" },
  { value: "os", label: "OS" },
  { value: "browser", label: "Browser" },
  { value: "connection", label: "Connection" },
  { value: "time", label: "Time" },
] as const;

const OPERATORS = [
  { value: "is", label: "is" },
  { value: "is-not", label: "is not" },
  { value: "in", label: "in" },
  { value: "contains", label: "contains" },
] as const;

function ConditionChip({
  pathId,
  pathIndex,
  pathCount,
}: {
  pathId: string;
  pathIndex: number;
  pathCount: number;
}) {
  const { draft, addRule } = useStore();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [field, setField] = useState<"country" | "device" | "os" | "browser" | "connection" | "time">("country");
  const [operator, setOperator] = useState<"is" | "is-not" | "in" | "contains">("is");
  const [value, setValue] = useState("");

  const isFallback = pathIndex === pathCount - 1;
  const splitMode = draft.splitMode;
  const rules = splitMode.kind === "rule-based" ? splitMode.rules : [];
  const pathRules = rules.find((r) => r.pathId === pathId);

  if (isFallback) {
    return (
      <span className="rounded-md border border-border px-2.5 py-1 text-xs text-text-subtle">
        Fallback (catch-all)
      </span>
    );
  }

  return (
    <div className="relative flex items-center gap-1.5 flex-wrap">
      {pathRules?.conditions.map((cond, i) => (
        <span
          key={i}
          className="rounded-md bg-surface-2 border border-border px-2.5 py-1 text-xs text-text-muted"
        >
          {cond.field} {cond.operator} {Array.isArray(cond.value) ? cond.value.join(", ") : cond.value}
        </span>
      ))}
      <button
        onClick={() => setPopoverOpen((p) => !p)}
        className="flex items-center gap-1 rounded-md border border-dashed border-border px-2 py-1 text-xs text-text-subtle hover:border-border-strong hover:text-text-muted transition-colors"
      >
        <Plus size={10} />
        <span>Add condition</span>
      </button>
      {popoverOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPopoverOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-50 w-72 rounded-md border border-border bg-surface-2 p-3 shadow-lg">
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-text-subtle">Add condition</div>
              <div className="flex gap-2">
                <select
                  value={field}
                  onChange={(e) => setField(e.target.value as typeof field)}
                  className="flex-1 rounded border border-border bg-surface px-2 py-1.5 text-xs text-text"
                >
                  {CONDITION_FIELDS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value as typeof operator)}
                  className="w-24 rounded border border-border bg-surface px-2 py-1.5 text-xs text-text"
                >
                  {OPERATORS.map((op) => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>
              </div>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Value (comma-separated for multiple)"
                className="rounded border border-border bg-surface px-2 py-1.5 text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setPopoverOpen(false)}
                  className="px-2 py-1 text-xs text-text-muted hover:text-text transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!value.trim()) return;
                    const vals = value.split(",").map((v) => v.trim()).filter(Boolean);
                    addRule(pathId, {
                      field,
                      operator,
                      value: vals.length === 1 ? vals[0] : vals,
                    });
                    setValue("");
                    setPopoverOpen(false);
                  }}
                  className="rounded bg-accent px-2.5 py-1 text-xs text-bg hover:bg-accent/90 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function WeightBar() {
  const { draft, setSplitMode } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { splitMode, paths } = draft;

  if (paths.length < 2) return null;

  const totalWeight = paths.reduce((s, p) => s + p.weight, 0);
  const distributionLabel =
    splitMode.kind === "weighted"
      ? paths.map((p) => `${p.weight}%`).join(" / ")
      : splitMode.kind === "rule-based"
      ? `${(splitMode.rules ?? []).length} rules`
      : `AI · ${splitMode.goal?.toUpperCase()}`;

  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-md border border-border bg-surface mb-2">
      <span className="text-xs text-text-muted">
        Distribution: <span className="text-text font-medium">{distributionLabel}</span>
        {splitMode.kind === "weighted" && totalWeight !== 100 && (
          <span className="ml-1.5 text-warning text-xs">≠ 100%</span>
        )}
      </span>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen((p) => !p)}
          className="flex items-center gap-1.5 rounded border border-border px-2.5 py-1 text-xs text-text-muted hover:bg-surface-2 hover:text-text transition-colors"
        >
          {SPLIT_MODE_OPTIONS.find((o) => o.value === splitMode.kind)?.label ?? "Weighted"}
          <ChevronDown size={11} />
        </button>
        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-50 w-36 rounded-md border border-border bg-surface-2 py-1 shadow-lg">
              {SPLIT_MODE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    if (opt.value === "weighted") setSplitMode({ kind: "weighted" });
                    else if (opt.value === "rule-based") setSplitMode({ kind: "rule-based", rules: [] });
                    else setSplitMode({ kind: "ai", goal: "epc", minSample: 1000 });
                    setDropdownOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors",
                    splitMode.kind === opt.value
                      ? "text-accent bg-accent/10"
                      : "text-text-muted hover:bg-surface hover:text-text"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function PathWeight({
  pathId,
  pathIndex,
  pathCount,
}: {
  pathId: string;
  pathIndex: number;
  pathCount: number;
}) {
  const { draft, updatePathWeight } = useStore();
  const { splitMode } = draft;
  const path = draft.paths.find((p) => p.id === pathId);
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState("");

  if (!path) return null;

  if (splitMode.kind === "weighted") {
    if (editing) {
      return (
        <input
          autoFocus
          value={editVal}
          onChange={(e) => setEditVal(e.target.value)}
          onBlur={() => {
            const n = parseInt(editVal, 10);
            if (!isNaN(n) && n >= 0 && n <= 100) {
              updatePathWeight(pathId, n);
            }
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") {
              if (e.key === "Enter") {
                const n = parseInt(editVal, 10);
                if (!isNaN(n) && n >= 0 && n <= 100) updatePathWeight(pathId, n);
              }
              setEditing(false);
            }
          }}
          className="w-14 rounded border border-accent bg-bg px-1.5 py-0.5 text-right font-mono text-xs text-text focus:outline-none"
        />
      );
    }
    return (
      <button
        onClick={() => {
          setEditVal(String(path.weight));
          setEditing(true);
        }}
        className="rounded px-1.5 py-0.5 font-mono text-xs text-text-muted hover:bg-surface-2 hover:text-text transition-colors"
      >
        {path.weight}%
      </button>
    );
  }

  if (splitMode.kind === "rule-based") {
    return (
      <ConditionChip
        pathId={pathId}
        pathIndex={pathIndex}
        pathCount={pathCount}
      />
    );
  }

  // AI mode
  const aiWeights = [32, 28, 24, 16];
  const trends = ["↑", "→", "→", "↓"];
  const aiWeight = aiWeights[pathIndex % aiWeights.length];
  const trend = trends[pathIndex % trends.length];
  return (
    <span className="flex items-center gap-1">
      <span className="rounded bg-info/10 border border-info/30 px-2 py-0.5 font-mono text-xs text-info">
        {aiWeight}%
      </span>
      <span className="text-xs text-text-subtle">{trend}</span>
    </span>
  );
}

export function AiModeConfig() {
  const { draft, setSplitMode } = useStore();
  const { splitMode } = draft;
  if (splitMode.kind !== "ai") return null;

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-surface mb-2">
      <span className="text-xs text-text-subtle">Optimize for</span>
      <select
        value={splitMode.goal}
        onChange={(e) =>
          setSplitMode({ ...splitMode, goal: e.target.value as "cr" | "epc" | "roi" })
        }
        className="rounded border border-border bg-surface-2 px-2 py-1 text-xs text-text"
      >
        <option value="epc">EPC</option>
        <option value="cr">CR</option>
        <option value="roi">ROI</option>
      </select>
      <span className="text-xs text-text-subtle">Min sample:</span>
      <input
        type="number"
        value={splitMode.minSample}
        onChange={(e) =>
          setSplitMode({ ...splitMode, minSample: parseInt(e.target.value, 10) || 100 })
        }
        className="w-20 rounded border border-border bg-surface-2 px-2 py-1 text-xs font-mono text-text focus:outline-none focus:border-accent"
      />
      <span className="text-xs text-text-subtle">clicks</span>
    </div>
  );
}
