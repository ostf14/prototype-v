"use client";

import { X } from "lucide-react";
import { Section } from "@/components/primitives/section";
import { FlowCanvas } from "@/components/destination-canvas/flow-canvas";
import { useStore } from "@/lib/store";

export function DestinationSection() {
  // Narrow selector: re-render only when the empty/non-empty boundary flips.
  const hasContent = useStore((s) => s.draft.paths.length > 0);
  const setDraft = useStore((s) => s.setDraft);

  const clearDestination = () => {
    // Reset back to empty state — same shape FlowCanvas treats as "trigger 0".
    // SplitMode falls back to weighted since rule-based/AI without paths is meaningless.
    setDraft({ paths: [], splitMode: { kind: "weighted" } });
  };

  return (
    <Section
      title="Destination"
      headerRight={
        <div className="flex items-center gap-3">
          {hasContent && (
            <button
              onClick={clearDestination}
              title="Clear destination"
              className="flex items-center gap-1 text-xs text-text-subtle hover:text-text-muted transition-colors"
            >
              <X size={12} />
              Clear destination
            </button>
          )}
          <button className="text-xs text-text-subtle hover:text-text-muted transition-colors">
            Switch to legacy view
          </button>
        </div>
      }
    >
      <FlowCanvas />
    </Section>
  );
}
