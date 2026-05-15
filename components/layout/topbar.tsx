"use client";

import { useRouter } from "next/navigation";
import { Search, Plus, ChevronDown, Command } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Topbar() {
  const router = useRouter();
  const { setUI } = useStore();

  return (
    <header className="flex h-12 items-center gap-3 border-b border-border bg-surface px-4 shrink-0">
      {/* Workspace switcher */}
      <button className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-text-muted hover:bg-surface-2 hover:text-text transition-colors">
        <span>Main workspace</span>
        <ChevronDown size={12} />
      </button>

      <div className="w-px h-4 bg-border" />

      {/* Search */}
      <button
        onClick={() => setUI({ commandPaletteOpen: true })}
        className={cn(
          "flex flex-1 max-w-sm items-center gap-2 rounded-md border border-border bg-bg",
          "px-3 py-1.5 text-sm text-text-subtle hover:border-border-strong hover:text-text-muted",
          "transition-colors"
        )}
      >
        <Search size={13} />
        <span className="flex-1 text-left">Search campaigns…</span>
        <span className="flex items-center gap-0.5 rounded border border-border px-1 py-0.5 text-xs text-text-subtle">
          <Command size={10} />
          <span>K</span>
        </span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        {/* Create campaign */}
        <button
          onClick={() => router.push("/campaigns/new")}
          className={cn(
            "flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5",
            "text-sm font-medium text-bg hover:bg-accent/90 transition-colors"
          )}
        >
          <Plus size={13} />
          <span>Create campaign</span>
        </button>
      </div>
    </header>
  );
}
