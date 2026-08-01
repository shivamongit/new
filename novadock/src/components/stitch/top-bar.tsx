"use client";

import { MaterialIcon } from "./material-icon";

export function StitchTopBar() {
  return (
    <header
      className="fixed top-0 right-0 z-40 flex h-16 w-[calc(100%-260px)] items-center justify-between border-b border-white/5 bg-[#050508]/50 px-8 backdrop-blur-md"
    >
      <div className="flex w-1/2 items-center gap-6">
        <div className="relative w-full max-w-md">
          <MaterialIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#b9caca]"
          />
          <input
            type="text"
            placeholder="Search applications..."
            className="w-full rounded-full border border-white/10 bg-[#1b1b1f]/50 py-1.5 pl-10 pr-4 text-xs text-[#e5e1e7] transition-all focus:border-[#00dce5] focus:outline-none focus:ring-1 focus:ring-[#00dce5]/30"
          />
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-[#1b1b1f] px-3 py-1 font-mono text-[11px] text-[#b9caca]">
          <MaterialIcon name="keyboard_command_key" className="text-sm" />
          <span>K</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button type="button" className="text-[#b9caca] transition-colors hover:text-[#63f7ff]">
          <MaterialIcon name="notifications" />
        </button>
        <div className="h-8 w-8 rounded-full border border-white/20 bg-gradient-to-br from-[#00f5ff]/30 to-[#8b5cf6]/30" />
      </div>
    </header>
  );
}
