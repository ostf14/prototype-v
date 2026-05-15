"use client";

import { Section } from "@/components/primitives/section";
import { FlowCanvas } from "@/components/destination-canvas/flow-canvas";

export function DestinationSection() {
  return (
    <Section
      title="Destination"
      headerRight={
        <div className="flex items-center gap-3">
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
