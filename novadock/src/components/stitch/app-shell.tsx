import { Toaster } from "sonner";
import { AuroraShader } from "./aurora-shader";
import { StitchSidebar } from "./sidebar";
import { StitchTopBar } from "./top-bar";

export function StitchAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="stitch-app min-h-screen text-[#e5e1e7]">
      <AuroraShader />
      <StitchSidebar />
      <main className="ml-[260px] min-h-screen flex flex-col">
        <StitchTopBar />
        <div className="mx-auto w-full max-w-[1440px] px-8 pb-10 pt-24">
          {children}
        </div>
      </main>
      <Toaster theme="dark" position="bottom-right" richColors />
    </div>
  );
}
