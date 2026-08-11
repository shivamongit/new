import { ComponentNav } from "@/components/component-nav";
import { ShowcaseGrid } from "@/components/showcase-grid";
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <main className="relative mx-auto max-w-[960px] bg-page shadow-[0_0_0_1px_var(--line)]">
      <div className="lg:grid lg:grid-cols-[288px_minmax(0,1fr)]">
        <aside
          className="flex flex-col border-b border-dashed border-line px-7 pt-16 pb-7 lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:border-r lg:border-b-0 lg:pt-[clamp(2.5rem,8vh,5rem)]"
        >
          <div className="shrink-0">
            <div className="flex items-center justify-between">
              <img src="/logo.png" alt="Beautiful UI" className="-ml-3 size-20 shrink-0 lg:ml-0" />
              <ThemeToggle />
            </div>
            <h1 className="mt-12 text-[21px] font-semibold leading-snug tracking-[-0.02em] text-ink text-balance lg:mt-[clamp(1.5rem,5vh,3rem)]">
              Beautiful UI for AI-native interfaces.
            </h1>
          </div>
          <div className="relative mt-7 border-t border-dashed border-line pt-6 lg:min-h-0 lg:flex-1 lg:overflow-hidden lg:pt-0">
            <div className="component-nav-scroll lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pt-6 lg:pb-16">
              <ComponentNav />
            </div>
          </div>
          <div className="mt-8 shrink-0 lg:mt-6">
            <a
              href="https://turbodesign.co/"
              target="_blank"
              rel="noreferrer"
              className="block rounded-control px-2 py-1"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="block truncate text-[12.5px] font-medium leading-tight text-ink">
                    Built by Turbo
                  </span>
                  <span aria-hidden className="relative h-3 w-6 shrink-0 overflow-hidden">
                    <img
                      src="/turbo-flourish.png"
                      alt=""
                      className="absolute top-1/2 left-0 w-9 max-w-none -translate-y-[46%]"
                    />
                  </span>
                </span>
                <span className="block truncate text-[12px] leading-tight text-ink-2">Product design studio</span>
              </span>
              <span className="mt-1.5 block text-[12px] leading-relaxed text-ink-2 text-pretty">
                Get expert product design for your business.
              </span>
            </a>
          </div>
        </aside>

        <div className="min-w-0">
          <ShowcaseGrid />
        </div>
      </div>
    </main>
  );
}
