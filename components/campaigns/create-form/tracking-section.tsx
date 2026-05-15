"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { Section } from "@/components/primitives/section";
import { cn } from "@/lib/utils";

const DEFAULT_TRACKING = {
  redirectMode: "302" as const,
  conversionMethod: "s2s" as const,
};

const TOKENS = ["{clickid}", "{payout}", "{txid}", "{country}", "{device}", "{os}"];

export function TrackingSection() {
  const { draft, setDraft } = useStore();
  const { tracking } = draft;
  const [tokenHintOpen, setTokenHintOpen] = useState(false);

  const isModified =
    tracking.redirectMode !== DEFAULT_TRACKING.redirectMode ||
    tracking.conversionMethod !== DEFAULT_TRACKING.conversionMethod ||
    !!tracking.customDomain ||
    !!tracking.postbackUrl ||
    tracking.tokenMappings.length > 0;

  const badge = (
    <span
      className={cn(
        "rounded px-2 py-0.5 text-xs",
        isModified
          ? "bg-accent/10 text-accent"
          : "bg-surface-2 text-text-subtle"
      )}
    >
      {isModified ? "Modified" : "Default"}
    </span>
  );

  const updateTracking = (partial: Partial<typeof tracking>) =>
    setDraft({ tracking: { ...tracking, ...partial } });

  const addTokenMapping = () =>
    updateTracking({
      tokenMappings: [...tracking.tokenMappings, { from: "", to: "" }],
    });

  const removeTokenMapping = (index: number) =>
    updateTracking({
      tokenMappings: tracking.tokenMappings.filter((_, i) => i !== index),
    });

  const updateMapping = (index: number, key: "from" | "to", value: string) =>
    updateTracking({
      tokenMappings: tracking.tokenMappings.map((m, i) =>
        i === index ? { ...m, [key]: value } : m
      ),
    });

  return (
    <Section
      title="Tracking & Redirects"
      badge={badge}
      collapsible
      defaultExpanded={false}
    >
      <div className="divide-y divide-border">
        {/* Custom domain */}
        <div className="flex items-start gap-4 px-4 py-3">
          <label className="w-40 shrink-0 text-sm text-text-muted pt-1.5">
            Custom domain
          </label>
          <input
            type="text"
            value={tracking.customDomain ?? ""}
            onChange={(e) => updateTracking({ customDomain: e.target.value || undefined })}
            placeholder="track.yourdomain.com"
            className="flex-1 rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none transition-colors"
          />
        </div>

        {/* Redirect mode */}
        <div className="flex items-center gap-4 px-4 py-3">
          <label className="w-40 shrink-0 text-sm text-text-muted">
            Redirect mode
          </label>
          <div className="flex rounded-md border border-border overflow-hidden">
            {(["302", "meta", "direct"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => updateTracking({ redirectMode: mode })}
                className={cn(
                  "px-3 py-1.5 text-xs border-r border-border last:border-0 transition-colors",
                  tracking.redirectMode === mode
                    ? "bg-accent/15 text-accent"
                    : "text-text-muted hover:bg-surface-2 hover:text-text"
                )}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Conversion method */}
        <div className="flex items-center gap-4 px-4 py-3">
          <label className="w-40 shrink-0 text-sm text-text-muted">
            Conversion method
          </label>
          <div className="flex gap-3">
            {(["s2s", "pixel", "cookie"] as const).map((method) => (
              <label key={method} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="conversion-method"
                  value={method}
                  checked={tracking.conversionMethod === method}
                  onChange={() => updateTracking({ conversionMethod: method })}
                  className="accent-accent"
                />
                <span className="text-sm text-text-muted uppercase text-xs">
                  {method.toUpperCase()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Postback URL */}
        <div className="flex items-start gap-4 px-4 py-3">
          <div className="w-40 shrink-0 pt-1.5">
            <label className="text-sm text-text-muted">Postback URL</label>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={tracking.postbackUrl ?? ""}
              onChange={(e) => updateTracking({ postbackUrl: e.target.value || undefined })}
              onFocus={() => setTokenHintOpen(true)}
              onBlur={() => setTimeout(() => setTokenHintOpen(false), 200)}
              placeholder="https://yourtracker.com/postback?cid={clickid}&payout={payout}"
              className="w-full rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none transition-colors"
            />
            {tokenHintOpen && (
              <div className="absolute top-full mt-1 z-20 flex flex-wrap gap-1 rounded-md border border-border bg-surface-2 p-2">
                {TOKENS.map((token) => (
                  <button
                    key={token}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      updateTracking({
                        postbackUrl: (tracking.postbackUrl ?? "") + token,
                      });
                    }}
                    className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-text-muted hover:text-accent transition-colors"
                  >
                    {token}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Token mappings */}
        <div className="flex items-start gap-4 px-4 py-3">
          <label className="w-40 shrink-0 text-sm text-text-muted pt-1.5">
            Token mappings
          </label>
          <div className="flex-1 flex flex-col gap-2">
            {tracking.tokenMappings.map((mapping, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  value={mapping.from}
                  onChange={(e) => updateMapping(index, "from", e.target.value)}
                  placeholder="{click_id}"
                  className="flex-1 rounded border border-border bg-surface px-2 py-1.5 font-mono text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
                />
                <span className="text-xs text-text-subtle">→</span>
                <input
                  value={mapping.to}
                  onChange={(e) => updateMapping(index, "to", e.target.value)}
                  placeholder="{clickid}"
                  className="flex-1 rounded border border-border bg-surface px-2 py-1.5 font-mono text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
                />
                <button
                  onClick={() => removeTokenMapping(index)}
                  className="text-text-subtle hover:text-danger transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <button
              onClick={addTokenMapping}
              className="flex items-center gap-1 self-start text-xs text-text-subtle hover:text-text-muted transition-colors"
            >
              <Plus size={11} />
              Add mapping
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
