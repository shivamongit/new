"use client";

import { DEMO_MAP } from "@/components/demos";
import { ShowcaseSection } from "@/components/showcase-section";
import { PRIMITIVES } from "@/lib/primitives";

export function ShowcaseGrid() {
  return (
    <div className="flex w-full flex-col pt-8 pb-12 lg:pt-10 lg:pb-16">
      {PRIMITIVES.map((primitive, index) => {
        const Demo = DEMO_MAP[primitive.id];
        return (
          <ShowcaseSection
            key={primitive.id}
            index={index}
            id={primitive.id}
            title={primitive.title}
            caption={primitive.caption}
            variants={primitive.variants}
          >
            {Demo ? <Demo /> : null}
          </ShowcaseSection>
        );
      })}

      <section className="px-8 py-12">
        <h2 className="text-[15px] font-semibold text-ink">New components, in your inbox.</h2>
        <p className="mt-2 text-[13px] text-ink-2">
          Get new primitives and updates as they ship — copy-paste ready. No spam, unsubscribe anytime.
        </p>
        <form className="mt-4 flex gap-2">
          <input
            type="email"
            placeholder="Email"
            className="flex-1 rounded-control border border-line bg-field px-3 py-2 text-[13px] text-ink outline-none focus:border-line-strong"
          />
          <button type="button" className="rounded-full bg-accent px-4 py-2 text-[12px] font-medium text-white">
            Notify me
          </button>
        </form>
      </section>
    </div>
  );
}
