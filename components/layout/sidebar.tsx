"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  FileText,
  Tag,
  Zap,
  BarChart3,
  Settings,
  Bot,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/landers", label: "Landers", icon: FileText },
  { href: "/offers", label: "Offers", icon: Tag },
  { href: "/traffic-sources", label: "Traffic Sources", icon: Zap },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/automizer", label: "Automizer", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { ui, setUI } = useStore();
  const collapsed = ui.sidebarCollapsed;

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-surface transition-all duration-200 shrink-0",
        collapsed ? "w-14" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-12 items-center border-b border-border px-4">
        {!collapsed && (
          <span className="text-sm font-medium tracking-tight text-text">
            Prototype V
          </span>
        )}
        {collapsed && (
          <span className="text-sm font-medium text-accent mx-auto">V</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 p-2 flex-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                active
                  ? "bg-surface-2 text-text"
                  : "text-text-muted hover:bg-surface-2 hover:text-text"
              )}
            >
              <Icon
                size={15}
                className={cn(active ? "text-accent" : "text-text-subtle")}
              />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border p-2">
        <button
          onClick={() => setUI({ sidebarCollapsed: !collapsed })}
          className="flex w-full items-center justify-center rounded-md p-1.5 text-text-subtle hover:bg-surface-2 hover:text-text transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            size={14}
            className={cn("transition-transform", collapsed && "rotate-180")}
          />
        </button>
      </div>
    </aside>
  );
}
