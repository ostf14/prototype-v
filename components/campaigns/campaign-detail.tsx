"use client";

import { useRouter } from "next/navigation";
import { Pencil, Copy, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { StatusDot } from "@/components/primitives/status-dot";
import {
  cn,
  formatNumber,
  formatCurrency,
  formatPercent,
  formatRelativeTime,
} from "@/lib/utils";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-surface p-4">
      <span className="text-xs text-text-subtle">{label}</span>
      <span className="font-mono text-lg font-medium text-text">{value}</span>
    </div>
  );
}

function DefRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-2.5 border-b border-border last:border-0">
      <dt className="w-40 shrink-0 text-sm text-text-muted">{label}</dt>
      <dd className="flex-1 text-sm text-text">{value}</dd>
    </div>
  );
}

export function CampaignDetail({ id }: { id: string }) {
  const router = useRouter();
  const { campaigns, trafficSources, landers, offers, duplicateCampaign, loadCampaignIntoDraft } = useStore();
  const campaign = campaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-sm text-text-muted">Campaign not found</p>
        <button
          onClick={() => router.push("/campaigns")}
          className="text-xs text-accent hover:underline"
        >
          Back to campaigns
        </button>
      </div>
    );
  }

  const ts = trafficSources.find((t) => t.id === campaign.trafficSourceId);
  const cr =
    campaign.stats && campaign.stats.clicks > 0
      ? (campaign.stats.conversions / campaign.stats.clicks) * 100
      : null;

  const handleEdit = () => {
    loadCampaignIntoDraft(id);
    router.push("/campaigns/new");
  };

  const handleDuplicate = () => {
    const dupe = duplicateCampaign(id);
    if (dupe) {
      toast.success(`Duplicated as "${dupe.name}"`);
      router.push(`/campaigns/${dupe.id}`);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      {/* Back */}
      <button
        onClick={() => router.push("/campaigns")}
        className="flex items-center gap-1.5 text-xs text-text-subtle hover:text-text-muted transition-colors mb-6"
      >
        <ArrowLeft size={13} />
        All campaigns
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-medium tracking-tight text-text">
            {campaign.name}
          </h1>
          <div className="flex items-center gap-3">
            <StatusDot status={campaign.status} />
            {ts && (
              <span className="flex items-center gap-1.5 text-sm text-text-subtle">
                <span>{ts.icon}</span>
                <span>{ts.name}</span>
              </span>
            )}
            <span className="text-sm text-text-subtle">
              Updated {formatRelativeTime(campaign.updatedAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDuplicate}
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-text-muted hover:bg-surface hover:text-text transition-colors"
          >
            <Copy size={13} />
            Duplicate
          </button>
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-bg hover:bg-accent/90 transition-colors"
          >
            <Pencil size={13} />
            Edit
          </button>
        </div>
      </div>

      {/* Stats */}
      {campaign.stats && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          <StatCard label="Clicks" value={formatNumber(campaign.stats.clicks)} />
          <StatCard label="Conversions" value={formatNumber(campaign.stats.conversions)} />
          <StatCard label="Revenue" value={formatCurrency(campaign.stats.revenue)} />
          <StatCard label="CR" value={cr !== null ? formatPercent(cr) : "—"} />
        </div>
      )}

      {/* Flow visualization */}
      <div className="rounded-md border border-border bg-surface p-4 mb-6">
        <h2 className="mb-3 text-sm font-medium text-text">Destination Flow</h2>
        <div className="flex flex-col gap-4">
          {campaign.paths.map((path, index) => {
            const landerSlot = path.slots.find((s) => s.kind === "lander");
            const offerSlot = path.slots.find((s) => s.kind === "offer");

            return (
              <div key={path.id} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-xs text-text-subtle">
                  Path {index + 1}
                  {path.name && (
                    <>
                      <br />
                      <span className="text-text-muted">{path.name}</span>
                    </>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  {landerSlot && landerSlot.items.length > 0 && (
                    <>
                      <SlotReadCard
                        kind="lander"
                        items={landerSlot.items.map((item) => {
                          const l = landers.find((l) => l.id === item.refId);
                          return { name: l?.name ?? item.refId, weight: item.weight };
                        })}
                      />
                      <Arrow />
                    </>
                  )}
                  {offerSlot && offerSlot.items.length > 0 && (
                    <SlotReadCard
                      kind="offer"
                      items={offerSlot.items.map((item) => {
                        const o = offers.find((o) => o.id === item.refId);
                        return {
                          name: o?.name ?? item.refId,
                          weight: item.weight,
                          payout: o?.payout,
                        };
                      })}
                    />
                  )}
                </div>
                {campaign.splitMode.kind === "weighted" && campaign.paths.length > 1 && (
                  <span className="ml-auto font-mono text-xs text-text-subtle">
                    {path.weight}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* General config */}
      <div className="rounded-md border border-border bg-surface p-4 mb-4">
        <h2 className="mb-3 text-sm font-medium text-text">Configuration</h2>
        <dl>
          <DefRow label="Traffic source" value={ts ? `${ts.icon} ${ts.name}` : "—"} />
          <DefRow label="Country" value={campaign.country || "—"} />
          <DefRow
            label="Cost model"
            value={
              campaign.cost.type === "not-tracked"
                ? "Not tracked"
                : campaign.cost.type === "auto"
                ? "Auto"
                : `${campaign.cost.type.toUpperCase()} ${campaign.cost.value != null ? `$${campaign.cost.value}` : ""}`
            }
          />
          <DefRow
            label="Distribution"
            value={
              campaign.splitMode.kind === "weighted"
                ? `Weighted`
                : campaign.splitMode.kind === "rule-based"
                ? `Rule-based · ${campaign.splitMode.rules.length} rules`
                : `AI (${campaign.splitMode.goal?.toUpperCase()} goal)`
            }
          />
          {campaign.tags.length > 0 && (
            <DefRow
              label="Tags"
              value={
                <span className="flex gap-1 flex-wrap">
                  {campaign.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-text-subtle"
                    >
                      {t}
                    </span>
                  ))}
                </span>
              }
            />
          )}
        </dl>
      </div>

      {/* Tracking config */}
      <div className="rounded-md border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-medium text-text">Tracking</h2>
        <dl>
          <DefRow label="Redirect mode" value={campaign.tracking.redirectMode.toUpperCase()} />
          <DefRow label="Conversion" value={campaign.tracking.conversionMethod.toUpperCase()} />
          {campaign.tracking.customDomain && (
            <DefRow
              label="Custom domain"
              value={
                <span className="font-mono text-xs">{campaign.tracking.customDomain}</span>
              }
            />
          )}
          {campaign.tracking.postbackUrl && (
            <DefRow
              label="Postback URL"
              value={
                <span className="font-mono text-xs break-all">
                  {campaign.tracking.postbackUrl}
                </span>
              }
            />
          )}
        </dl>
      </div>
    </div>
  );
}

function SlotReadCard({
  kind,
  items,
}: {
  kind: "lander" | "offer";
  items: { name: string; weight: number; payout?: number }[];
}) {
  const first = items[0];
  return (
    <div
      className={cn(
        "flex flex-col gap-1 w-48 rounded-md border p-2.5",
        kind === "lander" ? "border-info/30 bg-info/5" : "border-accent/30 bg-accent/5"
      )}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "inline-flex items-center justify-center w-4 h-4 rounded text-xs font-medium",
            kind === "lander" ? "bg-info/20 text-info" : "bg-accent/20 text-accent"
          )}
        >
          {kind === "lander" ? "L" : "O"}
        </span>
        <span className="text-xs font-medium text-text truncate">{first?.name}</span>
      </div>
      {first?.payout != null && (
        <span className="font-mono text-xs text-text-subtle">${first.payout}</span>
      )}
      {items.length > 1 && (
        <span className="text-xs text-text-subtle">+{items.length - 1} more</span>
      )}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      <div className="w-4 h-px bg-border-strong" />
      <svg width="5" height="8" viewBox="0 0 5 8" fill="none" className="text-border-strong">
        <path d="M0 0L5 4L0 8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
