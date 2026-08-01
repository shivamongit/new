"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  Settings,
  Server,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NovaLogo } from "@/components/graphics/nova-logo";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/apps/new", label: "Deploy", icon: Plus },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/[0.06] bg-zinc-950/60 backdrop-blur-2xl">
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-6">
        <NovaLogo />
        <div>
          <p className="text-sm font-semibold text-white tracking-tight">
            NovaDock
          </p>
          <p className="text-[11px] text-zinc-500">Snap POCs to Windows</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-to-r from-cyan-500/15 to-violet-500/10 text-white border border-cyan-500/20 shadow-lg shadow-cyan-500/5"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <item.icon className={cn("h-4 w-4", active && "text-cyan-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-4">
        <div className="rounded-xl border border-cyan-500/10 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 p-4">
          <div className="flex items-center gap-2 text-xs text-cyan-400/80">
            <Server className="h-3.5 w-3.5" />
            Loop engineering
          </div>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            Deploy → verify → retry until healthy. One-click NSSM magic.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400/80">
            <Activity className="h-3 w-3 animate-pulse" />
            Agent ready
          </div>
        </div>
      </div>
    </aside>
  );
}
