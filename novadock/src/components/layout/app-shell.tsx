import { Sidebar } from "./sidebar";
import { Toaster } from "sonner";
import {
  AuroraBackground,
  GridMesh,
  FloatingParticles,
} from "@/components/graphics/aurora-background";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#06060a] text-zinc-100">
      <AuroraBackground />
      <GridMesh />
      <FloatingParticles />
      <Sidebar />
      <main className="relative pl-64">
        <div className="mx-auto max-w-7xl px-8 py-8">{children}</div>
      </main>
      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}
