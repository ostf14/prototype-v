"use client";

import { useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { GeneralSection } from "@/components/campaigns/create-form/general-section";
import { DestinationSection } from "@/components/campaigns/create-form/destination-section";
import { TrackingSection } from "@/components/campaigns/create-form/tracking-section";
import { AdvancedSection } from "@/components/campaigns/create-form/advanced-section";
import { SummarySidebar } from "@/components/campaigns/create-form/summary-sidebar";

const AUTOSAVE_DELAY = 2000;

export function CreateForm() {
  const router = useRouter();
  const { draft, createFromDraft, resetDraft, draftLastSaved, saveDraft } = useStore();
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Autosave on draft change
  useEffect(() => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      saveDraft();
    }, AUTOSAVE_DELAY);
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    };
  }, [draft, saveDraft]);

  const handleCreate = useCallback(() => {
    if (!draft.name.trim()) {
      toast.error("Campaign name is required");
      return;
    }
    if (draft.paths.length === 0) {
      toast.error("Add at least one path with an offer");
      return;
    }
    const campaign = createFromDraft();
    toast.success(`Campaign "${campaign.name}" created`);
    resetDraft();
    router.push("/campaigns");
  }, [draft, createFromDraft, resetDraft, router]);

  const handleCancel = useCallback(() => {
    resetDraft();
    router.push("/campaigns");
  }, [resetDraft, router]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleCreate();
      }
      if (e.key === "Escape") {
        // Only cancel if no popover/picker is open — those handle their own Esc
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleCreate]);

  const autoSaveLabel = draftLastSaved
    ? `Draft auto-saved ${Math.round((Date.now() - draftLastSaved) / 1000)}s ago`
    : "Unsaved draft";

  return (
    <div className="flex h-full">
      {/* Main form */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-[720px] mx-auto px-6 py-6 pb-24 flex flex-col gap-4">
          <div>
            <h1 className="text-lg font-medium tracking-tight text-text">
              Create campaign
            </h1>
            <p className="mt-0.5 text-sm text-text-subtle">
              Configure your campaign settings and destination flow
            </p>
          </div>

          <GeneralSection />
          <DestinationSection />
          <TrackingSection />
          <AdvancedSection />
        </div>

        {/* Bottom action bar */}
        <div className="fixed bottom-0 left-60 right-0 flex items-center justify-between border-t border-border bg-surface px-6 py-3 z-30">
          <span className="text-xs text-text-subtle">{autoSaveLabel}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="rounded-md px-3 py-1.5 text-sm text-text-muted hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                saveDraft();
                toast.success("Draft saved");
              }}
              className="rounded-md border border-border px-3 py-1.5 text-sm text-text-muted hover:bg-surface-2 hover:text-text transition-colors"
            >
              Save as draft
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 rounded-md bg-accent px-4 py-1.5 text-sm font-medium text-bg hover:bg-accent/90 transition-colors"
            >
              Create campaign
              <kbd className="rounded border border-bg/20 px-1 py-0.5 text-xs">⌘↵</kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Summary sidebar */}
      <div className="w-[300px] shrink-0 overflow-auto border-l border-border bg-surface px-5 py-6">
        <SummarySidebar draftLastSaved={draftLastSaved} />
      </div>
    </div>
  );
}
