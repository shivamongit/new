import { Sidebar } from "./sidebar";
import { Toaster } from "sonner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -right-1/4 bottom-0 h-[400px] w-[400px] rounded-full bg-fuchsia-600/8 blur-[100px]" />
      </div>
      <Sidebar />
      <main className="relative pl-64">
        <div className="mx-auto max-w-7xl px-8 py-8">{children}</div>
      </main>
      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}
