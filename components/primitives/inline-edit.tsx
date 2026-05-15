"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type InlineEditProps = {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
};

export function InlineEdit({
  value,
  onSave,
  placeholder = "Click to edit",
  className,
  inputClassName,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft.trim() !== value) onSave(draft.trim());
  };

  const cancel = () => {
    setEditing(false);
    setDraft(value);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
        className={cn(
          "rounded border border-accent bg-bg px-2 py-0.5 text-sm text-text outline-none",
          inputClassName
        )}
      />
    );
  }

  return (
    <button
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className={cn(
        "text-sm text-left hover:text-text transition-colors",
        value ? "text-text" : "text-text-subtle",
        className
      )}
    >
      {value || placeholder}
    </button>
  );
}
