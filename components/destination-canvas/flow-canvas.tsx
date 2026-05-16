"use client";

import { useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { PathRow } from "@/components/destination-canvas/path-row";
import { WeightBar, AiModeConfig } from "@/components/destination-canvas/weight-controls";
import { SlotPicker } from "@/components/destination-canvas/slot-picker";
import { generateId } from "@/lib/utils";

export function FlowCanvas() {
  const { draft, addPath, setDraft, openSlotPicker } = useStore();
  const { paths } = draft;
  const urlInputRef = useRef<HTMLInputElement>(null);

  const handleUrlPaste = (url: string) => {
    if (!url.trim()) return;
    try {
      new URL(url);
    } catch {
      return;
    }
    // Create a path with a direct offer slot populated
    const pathId = generateId();
    const slotId = generateId();
    setDraft({
      paths: [
        ...paths,
        {
          id: pathId,
          slots: [
            {
              id: slotId,
              kind: "offer",
              items: [], // Would need to create an ad-hoc offer — for prototype just open picker
              rotation: "weighted",
            },
          ],
          weight: paths.length === 0 ? 100 : 50,
        },
      ],
    });
  };

  const handleAddFirstPath = () => {
    const pathId = generateId();
    const slotId = generateId();
    setDraft({
      paths: [
        {
          id: pathId,
          slots: [
            { id: slotId, kind: "offer", items: [], rotation: "weighted" },
          ],
          weight: 100,
        },
      ],
    });
    // Open the slot picker for the offer slot
    setTimeout(() => openSlotPicker(pathId, slotId), 50);
  };

  // Empty state
  if (paths.length === 0) {
    return (
      <>
        <div className="p-4">
          <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border py-10">
            <p className="text-sm text-text-muted">Paste destination URL or pick an offer</p>
            <div className="flex w-full max-w-sm items-center gap-2 rounded-md border border-border bg-surface px-3 py-2">
              <input
                ref={urlInputRef}
                placeholder="https://offers.example.com/offer-id?click_id={clickid}"
                className="flex-1 bg-transparent font-mono text-xs text-text placeholder:text-text-subtle focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUrlPaste((e.target as HTMLInputElement).value);
                  }
                }}
              />
              <kbd className="rounded border border-border px-1 text-xs text-text-subtle">↵</kbd>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddFirstPath}
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-text-muted hover:bg-surface hover:text-text transition-colors"
              >
                <Plus size={11} />
                Add lander
              </button>
              <span className="text-xs text-text-subtle">or</span>
              <button
                onClick={handleAddFirstPath}
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-text-muted hover:bg-surface hover:text-text transition-colors"
              >
                Pick from library
              </button>
            </div>
          </div>
        </div>
        <SlotPicker />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 pt-4">
        {/* Distribution + AI config bars stay full-width above the rows */}
        {paths.length >= 2 && (
          <div className="px-4 flex flex-col gap-3">
            <WeightBar />
            <AiModeConfig />
          </div>
        )}

        {/* Single shared horizontal-scroll container.
            All path rows scroll in sync (they share scrollLeft because
            they live inside the same overflow:x element), so the slot
            columns stay vertically aligned across paths.
            Sticky left columns inside each PathRow remain visible. */}
        <div className="overflow-x-auto pb-4">
          <div className="flex flex-col gap-3 px-4 min-w-fit">
            <AnimatePresence mode="popLayout">
              {paths.map((path, index) => (
                <PathRow
                  key={path.id}
                  path={path}
                  index={index}
                  pathCount={paths.length}
                  showRemove={paths.length > 1}
                />
              ))}
            </AnimatePresence>

            {/* Add path */}
            <button
              onClick={addPath}
              className="flex items-center gap-1.5 self-start rounded-md border border-dashed border-border px-3 py-1.5 text-xs text-text-subtle hover:border-border-strong hover:text-text-muted transition-colors"
            >
              <Plus size={11} />
              Add path
            </button>
          </div>
        </div>
      </div>
      <SlotPicker />
    </>
  );
}
