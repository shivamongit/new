"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "./material-icon";

const nav = [
  { href: "/", label: "Dashboard", icon: "dashboard" },
  { href: "/apps/new", label: "New deployment", icon: "rocket_launch" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export function StitchSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 z-50 flex h-full w-[260px] flex-col border-r border-white/10 bg-[#0e0e12]/70 p-4 backdrop-blur-xl"
    >
      <div className="mb-10 flex flex-col gap-2">
        <div className="flex items-center gap-3 px-2">
          <Image
            src="/logo.png"
            alt="NovaDock"
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg object-cover shadow-[0_0_20px_rgba(0,245,255,0.35)]"
            priority
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#63f7ff]">
              NovaDock
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-[#b9caca]">
              Windows deployment platform
            </span>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                active
                  ? "bg-[#571bc1]/30 font-bold text-[#00dce5]"
                  : "text-[#b9caca] hover:bg-[#353439]/50 active:scale-95"
              }`}
            >
              <MaterialIcon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-white/5 pt-4">
        <Link
          href="/apps/new"
          className="cyan-glow mb-4 flex items-center justify-center gap-2 rounded-xl bg-[#00f5ff] px-4 py-3 font-bold text-[#006c71] transition-all active:scale-[0.98] hover:translate-y-[-1px]"
        >
          <MaterialIcon name="add" />
          Deploy
        </Link>
        <div className="rounded-xl border border-[#00f5ff]/10 bg-[#00f5ff]/5 p-3 text-xs text-[#b9caca]">
          <div className="flex items-center gap-2 text-[#00dce5]">
            <MaterialIcon name="sync" className="text-sm" />
            Intelligent orchestration
          </div>
          <p className="mt-2 leading-relaxed">
            Prepare, register, verify—until your service is healthy.
          </p>
        </div>
      </div>
    </aside>
  );
}
