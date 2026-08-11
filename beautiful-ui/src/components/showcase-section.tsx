"use client";

import { useState, type ReactNode } from "react";

type Props = {
  index: number;
  id: string;
  title: string;
  caption: string;
  variants?: string[];
  children: ReactNode;
};

export function ShowcaseSection({ index, id, title, caption, variants, children }: Props) {
  const [variant, setVariant] = useState(variants?.[0] ?? "");

  return (
    <section
      id={id}
      className="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-8 py-10"
      style={{
        animation: `fade-up 600ms cubic-bezier(0.23,1,0.32,1) ${index * 60}ms both`,
      }}
    >
      <div className="mb-3 flex items-start gap-2 sm:items-baseline">
        <span className="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 sm:flex sm:items-baseline sm:gap-2">
          <h3 className="whitespace-nowrap text-[13px] font-semibold text-ink">{title}</h3>
          <p className="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">{caption}</p>
        </div>
      </div>
      <div
        className="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline"
        style={{ minHeight: 272 }}
      >
        <div className="w-full max-w-[30rem] [&>*]:mx-auto">{children}</div>
        {variants && variants.length > 0 && (
          <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 rounded-full bg-field p-0.5">
            {variants.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVariant(v)}
                className={`rounded-full px-2 py-0.5 text-[11.5px] font-medium transition-[background-color,color,box-shadow] duration-150 ${
                  variant === v
                    ? "bg-surface text-ink shadow-btn"
                    : "text-ink-3 hover:text-ink-2"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
