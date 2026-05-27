"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionProps = {
  title: string;
  badge?: React.ReactNode;
  defaultExpanded?: boolean;
  collapsible?: boolean;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
};

export function Section({
  title,
  badge,
  defaultExpanded = true,
  collapsible = false,
  children,
  headerRight,
  className,
}: SectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    // No `overflow-hidden` on the root — that would clip popovers (e.g.
    // dropdowns inside a FormRow) at the section's bottom edge. Instead,
    // the header and body each carry the rounded corners they need so
    // their backgrounds align with the rounded outer border.
    <div className={cn("border border-border rounded-md", className)}>
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-3 bg-surface rounded-t-md",
          !expanded && "rounded-b-md",
          collapsible && "cursor-pointer hover:bg-surface-2 transition-colors"
        )}
        onClick={collapsible ? () => setExpanded((p) => !p) : undefined}
      >
        {collapsible && (
          <ChevronRight
            size={14}
            className={cn(
              "text-text-subtle shrink-0 transition-transform",
              expanded && "rotate-90"
            )}
          />
        )}
        <h2 className="text-sm font-medium text-text flex-1">{title}</h2>
        {badge}
        {headerRight && (
          <div onClick={(e) => e.stopPropagation()}>{headerRight}</div>
        )}
      </div>
      {expanded && (
        <div className="bg-bg border-t border-border rounded-b-md">
          {children}
        </div>
      )}
    </div>
  );
}
