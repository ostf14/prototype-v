"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { Section } from "@/components/primitives/section";
import { cn } from "@/lib/utils";
import type { CostModel } from "@/lib/types";

const COST_TYPES: CostModel["type"][] = ["auto", "cpc", "cpm", "cpa", "revshare", "not-tracked"];
const COST_LABELS: Record<CostModel["type"], string> = {
  auto: "Auto",
  cpc: "CPC",
  cpm: "CPM",
  cpa: "CPA",
  revshare: "RevShare",
  "not-tracked": "Not tracked",
};

const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "ROW", name: "Rest of World", flag: "🌐" },
];

function FormRow({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-start gap-4 px-4 py-3 border-b border-border last:border-0">
      <label className="w-36 shrink-0 text-sm text-text-muted pt-1.5">{label}</label>
      <div className="flex-1">
        {children}
        {hint && <p className="mt-1 text-xs text-text-subtle">{hint}</p>}
      </div>
    </div>
  );
}

export function GeneralSection() {
  const { draft, setDraft, trafficSources } = useStore();
  const [tsOpen, setTsOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const selectedTS = trafficSources.find((t) => t.id === draft.trafficSourceId);
  const selectedCountry = COUNTRIES.find((c) => c.code === draft.country);

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !draft.tags.includes(trimmed)) {
      setDraft({ tags: [...draft.tags, trimmed] });
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setDraft({ tags: draft.tags.filter((t) => t !== tag) });
  };

  const costNeedsValue = draft.cost.type !== "auto" && draft.cost.type !== "not-tracked";

  return (
    <Section title="General">
      {/* Campaign name */}
      <FormRow label="Name">
        <input
          type="text"
          value={draft.name}
          onChange={(e) => setDraft({ name: e.target.value })}
          placeholder="e.g. Push US — Sweepstakes Q4"
          className={cn(
            "w-full rounded-md border border-border bg-surface px-3 py-1.5",
            "text-sm text-text placeholder:text-text-subtle",
            "focus:border-accent focus:outline-none transition-colors"
          )}
        />
      </FormRow>

      {/* Traffic source */}
      <FormRow label="Traffic source">
        <div className="relative">
          <button
            onClick={() => setTsOpen((p) => !p)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5",
              "text-sm transition-colors hover:border-border-strong",
              tsOpen && "border-accent"
            )}
          >
            {selectedTS ? (
              <>
                <span>{selectedTS.icon}</span>
                <span className="text-text">{selectedTS.name}</span>
              </>
            ) : (
              <span className="text-text-subtle">Select traffic source…</span>
            )}
            <ChevronDown size={13} className="ml-auto text-text-subtle" />
          </button>
          {tsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setTsOpen(false)} />
              <div className="absolute top-full mt-1 z-50 w-full rounded-md border border-border bg-surface py-1 shadow-lg max-h-80 overflow-y-auto">
                {["social", "push", "native", "search", "pop"].map((cat) => {
                  const sources = trafficSources.filter((t) => t.category === cat);
                  if (sources.length === 0) return null;
                  return (
                    <div key={cat}>
                      <div className="px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-text-subtle">
                        {cat}
                      </div>
                      {sources.map((ts) => (
                        <button
                          key={ts.id}
                          onClick={() => {
                            setDraft({ trafficSourceId: ts.id });
                            setTsOpen(false);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-text-muted hover:bg-surface-2 hover:text-text transition-colors"
                        >
                          <span>{ts.icon}</span>
                          <span>{ts.name}</span>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </FormRow>

      {/* Country */}
      <FormRow label="Country">
        <div className="relative">
          <button
            onClick={() => setCountryOpen((p) => !p)}
            className={cn(
              "flex w-full items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5",
              "text-sm transition-colors hover:border-border-strong",
              countryOpen && "border-accent"
            )}
          >
            {selectedCountry ? (
              <>
                <span>{selectedCountry.flag}</span>
                <span className="text-text">{selectedCountry.name}</span>
              </>
            ) : (
              <span className="text-text-subtle">Select country…</span>
            )}
            <ChevronDown size={13} className="ml-auto text-text-subtle" />
          </button>
          {countryOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setCountryOpen(false)} />
              <div className="absolute top-full mt-1 z-50 w-full rounded-md border border-border bg-surface py-1 shadow-lg max-h-56 overflow-y-auto">
                {COUNTRIES.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setDraft({ country: country.code });
                      setCountryOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-text-muted hover:bg-surface-2 hover:text-text transition-colors"
                  >
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                    <span className="ml-auto font-mono text-xs text-text-subtle">{country.code}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </FormRow>

      {/* Cost model */}
      <FormRow label="Cost model">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-md border border-border overflow-hidden">
            {COST_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setDraft({ cost: { ...draft.cost, type } })}
                className={cn(
                  "px-2.5 py-1.5 text-xs transition-colors border-r border-border last:border-0",
                  draft.cost.type === type
                    ? "bg-accent/15 text-accent"
                    : "text-text-muted hover:bg-surface-2 hover:text-text"
                )}
              >
                {COST_LABELS[type]}
              </button>
            ))}
          </div>
          {costNeedsValue && (
            <div className="flex items-center gap-1">
              <span className="text-sm text-text-subtle">$</span>
              <input
                type="number"
                step="0.001"
                min="0"
                value={draft.cost.value ?? ""}
                onChange={(e) =>
                  setDraft({
                    cost: { ...draft.cost, value: parseFloat(e.target.value) || undefined },
                  })
                }
                placeholder="0.00"
                className={cn(
                  "w-24 rounded-md border border-border bg-surface px-2 py-1.5",
                  "text-sm font-mono text-text placeholder:text-text-subtle",
                  "focus:border-accent focus:outline-none transition-colors"
                )}
              />
            </div>
          )}
        </div>
      </FormRow>

      {/* Workspace + Tags */}
      <FormRow label="Tags">
        <div className="flex flex-wrap items-center gap-1.5">
          {draft.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded bg-surface-2 px-2 py-0.5 text-xs text-text-muted"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="text-text-subtle hover:text-text transition-colors"
              >
                <X size={10} />
              </button>
            </span>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag(tagInput);
              }
            }}
            placeholder="Add tag…"
            className={cn(
              "rounded border-0 bg-transparent px-1 py-0.5 text-xs text-text",
              "placeholder:text-text-subtle focus:outline-none min-w-20"
            )}
          />
        </div>
      </FormRow>
    </Section>
  );
}
