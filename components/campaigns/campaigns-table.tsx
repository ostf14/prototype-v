"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Copy, Pause, Archive, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { FlowMiniViz } from "@/components/campaigns/flow-mini-viz";
import { StatusDot } from "@/components/primitives/status-dot";
import {
  cn,
  formatNumber,
  formatCurrency,
  formatPercent,
  formatRelativeTime,
} from "@/lib/utils";
import type { Campaign } from "@/lib/types";

type StatusFilter = "all" | Campaign["status"];

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

function RowAction({ campaign }: { campaign: Campaign }) {
  const [open, setOpen] = useState(false);
  const { duplicateCampaign, updateCampaign } = useStore();
  const router = useRouter();

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((p) => !p);
        }}
        className="flex items-center justify-center w-7 h-7 rounded hover:bg-surface text-text-subtle hover:text-text transition-colors"
      >
        <MoreHorizontal size={14} />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-8 z-50 w-44 rounded-md border border-border bg-surface-2 py-1 shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/campaigns/${campaign.id}`);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-text-muted hover:bg-surface hover:text-text transition-colors"
            >
              <Pencil size={12} />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const dupe = duplicateCampaign(campaign.id);
                if (dupe) toast.success(`Duplicated "${campaign.name}"`);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-text-muted hover:bg-surface hover:text-text transition-colors"
            >
              <Copy size={12} />
              Duplicate
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newStatus = campaign.status === "paused" ? "active" : "paused";
                updateCampaign(campaign.id, { status: newStatus });
                toast.success(`Campaign ${newStatus === "paused" ? "paused" : "resumed"}`);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-text-muted hover:bg-surface hover:text-text transition-colors"
            >
              <Pause size={12} />
              {campaign.status === "paused" ? "Resume" : "Pause"}
            </button>
            <div className="my-1 border-t border-border" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateCampaign(campaign.id, { status: "archived" });
                toast.success("Campaign archived");
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-danger hover:bg-surface transition-colors"
            >
              <Archive size={12} />
              Archive
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function CampaignRow({
  campaign,
  focused,
  onFocus,
}: {
  campaign: Campaign;
  focused: boolean;
  onFocus: () => void;
}) {
  const router = useRouter();
  const { trafficSources } = useStore();
  const ts = trafficSources.find((t) => t.id === campaign.trafficSourceId);
  const cr =
    campaign.stats && campaign.stats.clicks > 0
      ? (campaign.stats.conversions / campaign.stats.clicks) * 100
      : null;

  return (
    <tr
      onClick={() => router.push(`/campaigns/${campaign.id}`)}
      onFocus={onFocus}
      tabIndex={0}
      className={cn(
        "group cursor-pointer border-b border-border transition-colors",
        focused ? "bg-surface-2" : "hover:bg-surface"
      )}
    >
      {/* Name */}
      <td className="px-4 py-2.5">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-text font-medium leading-tight">
            {campaign.name}
          </span>
          {campaign.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {campaign.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-text-subtle"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-2.5">
        <StatusDot status={campaign.status} />
      </td>

      {/* Flow */}
      <td className="px-4 py-2.5">
        <FlowMiniViz campaign={campaign} />
      </td>

      {/* Traffic source */}
      <td className="px-4 py-2.5">
        {ts ? (
          <span className="flex items-center gap-1.5 text-sm text-text-muted">
            <span>{ts.icon}</span>
            <span>{ts.name}</span>
          </span>
        ) : (
          <span className="text-sm text-text-subtle">—</span>
        )}
      </td>

      {/* Clicks */}
      <td className="px-4 py-2.5 text-right font-mono text-sm text-text-muted">
        {campaign.stats ? formatNumber(campaign.stats.clicks) : "—"}
      </td>

      {/* CR */}
      <td className="px-4 py-2.5 text-right text-sm text-text-muted">
        {cr !== null ? formatPercent(cr) : "—"}
      </td>

      {/* Revenue */}
      <td className="px-4 py-2.5 text-right font-mono text-sm text-text-muted">
        {campaign.stats
          ? formatCurrency(campaign.stats.revenue)
          : "—"}
      </td>

      {/* Updated */}
      <td className="px-4 py-2.5 text-sm text-text-subtle">
        {formatRelativeTime(campaign.updatedAt)}
      </td>

      {/* Actions */}
      <td
        className="px-4 py-2.5 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <RowAction campaign={campaign} />
      </td>
    </tr>
  );
}

export function CampaignsTable() {
  const { campaigns } = useStore();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const router = useRouter();

  const filtered = campaigns.filter(
    (c) => statusFilter === "all" || c.status === statusFilter
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "j") {
        e.preventDefault();
        setFocusedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "k") {
        e.preventDefault();
        setFocusedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && focusedIndex >= 0) {
        const campaign = filtered[focusedIndex];
        if (campaign) router.push(`/campaigns/${campaign.id}`);
      } else if (e.key === "d" && focusedIndex >= 0) {
        // duplicate handled by store — just toast
      }
    },
    [filtered, focusedIndex, router]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col gap-4">
      {/* Filter bar */}
      <div className="flex items-center gap-1">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              statusFilter === f.value
                ? "bg-surface-2 text-text"
                : "text-text-muted hover:text-text"
            )}
          >
            {f.label}
            {f.value !== "all" && (
              <span className="ml-1.5 text-xs text-text-subtle">
                {campaigns.filter((c) => c.status === f.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="px-4 py-2 text-left text-xs font-medium text-text-subtle uppercase tracking-wide">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-text-subtle uppercase tracking-wide">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-text-subtle uppercase tracking-wide">
                Flow
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-text-subtle uppercase tracking-wide">
                Source
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-text-subtle uppercase tracking-wide">
                Clicks
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-text-subtle uppercase tracking-wide">
                CR
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-text-subtle uppercase tracking-wide">
                Revenue
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-text-subtle uppercase tracking-wide">
                Updated
              </th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-text-subtle">
                  No campaigns found
                </td>
              </tr>
            ) : (
              filtered.map((campaign, index) => (
                <CampaignRow
                  key={campaign.id}
                  campaign={campaign}
                  focused={focusedIndex === index}
                  onFocus={() => setFocusedIndex(index)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-text-subtle">
        Use <kbd className="rounded border border-border px-1 text-xs">j</kbd>
        {" / "}
        <kbd className="rounded border border-border px-1 text-xs">k</kbd>
        {" to navigate, "}
        <kbd className="rounded border border-border px-1 text-xs">↵</kbd>
        {" to open"}
      </p>
    </div>
  );
}
