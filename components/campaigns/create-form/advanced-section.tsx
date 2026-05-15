"use client";

import { Section } from "@/components/primitives/section";
import { cn } from "@/lib/utils";

function AdvancedRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0">
      <label className="w-40 shrink-0 text-sm text-text-muted">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Toggle({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "relative w-8 h-4.5 rounded-full transition-colors cursor-pointer",
          defaultChecked ? "bg-accent/30" : "bg-surface-2"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 w-3.5 h-3.5 rounded-full bg-text-subtle transition-transform",
            defaultChecked ? "translate-x-3.5" : "translate-x-0.5"
          )}
        />
      </div>
      <span className="text-sm text-text-muted">{label}</span>
    </div>
  );
}

export function AdvancedSection() {
  return (
    <Section
      title="Advanced"
      badge={
        <span className="rounded bg-surface-2 px-2 py-0.5 text-xs text-text-subtle">
          Optional
        </span>
      }
      collapsible
      defaultExpanded={false}
    >
      <div>
        <AdvancedRow label="Bot filtering">
          <Toggle label="Filter bot traffic" />
        </AdvancedRow>
        <AdvancedRow label="Anti-fraud">
          <Toggle label="Enable anti-fraud protection" />
        </AdvancedRow>
        <AdvancedRow label="IP blocking">
          <textarea
            placeholder="One IP or CIDR per line…"
            rows={3}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none resize-none transition-colors"
          />
        </AdvancedRow>
        <AdvancedRow label="Custom JS">
          <textarea
            placeholder="// Injected on redirect…"
            rows={3}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none resize-none transition-colors"
          />
        </AdvancedRow>
        <AdvancedRow label="Daily cap">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="No limit"
              className="w-28 rounded border border-border bg-surface px-2 py-1.5 font-mono text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none transition-colors"
            />
            <span className="text-sm text-text-subtle">clicks / day</span>
          </div>
        </AdvancedRow>
      </div>
    </Section>
  );
}
