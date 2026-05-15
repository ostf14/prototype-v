import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptySlotProps = {
  label: string;
  hint?: string;
  onClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function EmptySlot({
  label,
  hint,
  onClick,
  className,
  size = "md",
}: EmptySlotProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-border",
        "text-text-subtle hover:border-border-strong hover:text-text-muted transition-colors w-full",
        size === "sm" && "py-3",
        size === "md" && "py-5",
        size === "lg" && "py-8",
        className
      )}
    >
      <Plus size={14} />
      <span className="text-xs">{label}</span>
      {hint && <span className="text-xs text-text-subtle/70">{hint}</span>}
    </button>
  );
}
