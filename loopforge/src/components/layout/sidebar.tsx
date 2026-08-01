import Link from "next/link";
import {
  LayoutDashboard,
  Plus,
  Settings,
  Zap,
  Server,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/apps/new", label: "Deploy", icon: Plus },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/[0.06] bg-zinc-950/80 backdrop-blur-2xl">
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/30">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white tracking-tight">
            LoopForge
          </p>
          <p className="text-[11px] text-zinc-500">Windows POC Platform</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] p-4">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Server className="h-3.5 w-3.5" />
            Loop Engineering
          </div>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">
            Deploy → verify → retry until healthy. Bounded NSSM automation.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400/80">
            <Activity className="h-3 w-3" />
            Agent ready
          </div>
        </div>
      </div>
    </aside>
  );
}
