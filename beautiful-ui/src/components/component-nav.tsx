"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { PRIMITIVES } from "@/lib/primitives";

export function ComponentNav() {
  const [active, setActive] = useState(PRIMITIVES[0].id);
  const [hover, setHover] = useState<string | null>(null);
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    PRIMITIVES.forEach((p) => {
      const el = document.getElementById(p.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const key = hover ?? active;
    const el = itemRefs.current[key];
    if (el) setIndicator({ top: el.offsetTop, height: el.offsetHeight });
  }, [hover, active]);

  return (
    <nav aria-label="Components">
      <p className="mb-2 text-[11.5px] text-ink-3">Components</p>
      <ul
        className="relative flex flex-col"
        onMouseLeave={() => setHover(null)}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 rounded-[7px] bg-hover"
          style={{
            top: indicator?.top ?? 0,
            height: indicator?.height ?? 0,
            opacity: indicator ? 1 : 0,
            transition:
              "top 220ms cubic-bezier(0.23,1,0.32,1), height 220ms cubic-bezier(0.23,1,0.32,1), opacity 150ms ease",
          }}
        />
        {PRIMITIVES.map((p) => (
          <li
            key={p.id}
            ref={(el) => {
              itemRefs.current[p.id] = el;
            }}
          >
            <a
              href={`#${p.id}`}
              onMouseEnter={() => setHover(p.id)}
              onFocus={() => setHover(p.id)}
              onBlur={() => setHover(null)}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(p.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`relative z-10 flex items-center rounded-[7px] px-2 py-[5px] text-[12.5px] transition-colors duration-150 ${
                active === p.id ? "font-medium text-ink" : "text-ink-2 hover:text-ink"
              }`}
            >
              {p.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
