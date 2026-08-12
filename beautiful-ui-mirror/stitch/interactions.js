/**
 * Capture-phase interactions that do not depend on React hydration.
 * Wires every variant pill (original 19 + extensions 20–27) and nav hover.
 */
(function () {
  "use strict";

  const ACTIVE_BTN =
    "pk-variant-btn pk-variant-btn-active rounded-full px-2.5 py-1 text-[11.5px] font-medium";
  const IDLE_BTN =
    "pk-variant-btn rounded-full px-2.5 py-1 text-[11.5px] font-medium";

  function sectionOf(el) {
    return el.closest("section.primitive-showcase");
  }

  function demoRoot(section) {
    return (
      section.querySelector("[data-demo]") ||
      section.querySelector(".primitive-demo-surface > div.w-full") ||
      section.querySelector(".primitive-demo-surface > div")
    );
  }

  function tagVariantBars() {
    document.querySelectorAll("section.primitive-showcase").forEach((section) => {
      if (!section.dataset.extId) section.dataset.extId = section.id;
    const surface = section.querySelector(".primitive-demo-surface");
    if (!surface) return;
    surface.style.overflow = "visible";
      Array.from(surface.children).forEach((child) => {
        if (child.tagName !== "DIV") return;
        const cls = child.className || "";
        const isBar =
          child.classList.contains("bui-ext-variants") ||
          (cls.includes("absolute") && cls.includes("bottom") && child.querySelector("button"));
        if (!isBar) return;
        child.classList.add("bui-ext-variants", "pk-variant-bar");
        child.querySelectorAll("button").forEach((btn) => {
          if (!btn.dataset.variant) btn.dataset.variant = (btn.textContent || "").trim();
          btn.type = "button";
          btn.classList.add("pk-variant-btn");
        });
      });
    });
  }

  function setActiveVariantButton(bar, activeBtn) {
    bar.querySelectorAll("button").forEach((b) => {
      b.className = IDLE_BTN;
    });
    activeBtn.className = ACTIVE_BTN;
  }

  function flash(section) {
    const demo = demoRoot(section);
    if (!demo) return;
    demo.classList.remove("pk-swap-in");
    demo.classList.add("pk-swapping");
    requestAnimationFrame(() => {
      setTimeout(() => {
        demo.classList.remove("pk-swapping");
        demo.classList.add("pk-swap-in");
      }, 120);
    });
  }

  const ORIGINAL = {
    "loading-state": {
      Drive: `<div class="flex w-fit items-center gap-3 pk-loader">
        <span class="grid grid-cols-3 gap-[3px]">${[90,180,270,0,90,180,90,180,270].map((d)=>`<span class="pk-pixel" style="animation-delay:${d}ms"></span>`).join("")}</span>
        <span class="pk-shimmer">Churning</span>
        <span class="font-mono text-[12px] text-ink-3 tabular-nums pk-elapsed">0.0s</span>
      </div>`,
      Dots: `<div class="flex items-center gap-4 pk-loader">
        <span class="flex items-center gap-1.5">${[0,1,2].map((i)=>`<span class="pk-dot" style="animation-delay:${i*140}ms"></span>`).join("")}</span>
        <span class="pk-shimmer">Thinking</span>
      </div>`,
      Orbit: `<div class="flex items-center gap-3 pk-loader">
        <span class="pk-orbit"></span>
        <span class="pk-shimmer">Generating</span>
      </div>`,
    },
    "thinking-state": {
      Steps: `<div class="w-full max-w-sm space-y-2">
        <p class="pk-shimmer text-[13px] font-medium">Thinking</p>
        <div class="relative ml-2 border-l border-white/10 pl-4 space-y-2">
          <p class="text-[12.5px] text-ink-2">Scanning flavor velocity exports</p>
          <p class="text-[12.5px] text-ink-2">Comparing mint chip weekend peaks</p>
          <p class="text-[12.5px] text-ink-2">Ranking suppliers by lead time</p>
        </div>
      </div>`,
      Reasoning: `<div class="w-full max-w-sm rounded-xl pk-glass p-3 text-[12.5px] leading-relaxed text-ink-2">Weekend pistachio demand is driven by afternoon service, not morning prep — reorder before Saturday 10am.</div>`,
      Search: `<div class="w-full max-w-sm space-y-1.5">
        <p class="text-[11px] uppercase tracking-widest text-on-surface-variant">Search</p>
        ${["pistachio velocity Q3","cone_king lead time","weekend churn window"].map((q)=>`<div class="pk-glass rounded-lg px-3 py-2 text-[12.5px] font-mono text-ink-2">${q}</div>`).join("")}
      </div>`,
      Coding: `<pre class="w-full max-w-sm pk-glass rounded-xl p-3 font-mono text-[11.5px] leading-relaxed text-ink-2">if (velocity &lt; THRESHOLD) {\n  return scheduleChurn(batch);\n}</pre>`,
    },
    "task-rows": {
      Capsules: `<div class="w-full max-w-md space-y-2">
        <div class="pk-glass flex items-center justify-between rounded-2xl px-3 py-2.5"><span class="text-[13px] font-medium">Verified vendor records</span><span class="pk-pill pk-pill-ok">Completed</span></div>
        <div class="pk-glass flex items-center justify-between rounded-2xl px-3 py-2.5"><span class="text-[13px] font-medium">Build reorder task list</span><span class="pk-pill pk-pill-run">Running</span></div>
        <div class="pk-glass flex items-center justify-between rounded-2xl px-3 py-2.5"><span class="text-[13px] font-medium">Draft supplier emails</span><span class="pk-pill pk-pill-run">Running</span></div>
      </div>`,
      List: `<div class="w-full max-w-md pk-glass overflow-hidden rounded-xl">
        <div class="flex justify-between border-b border-white/10 px-3 py-2 text-[12.5px]"><span>Verified vendor records</span><span class="text-emerald-400">Done</span></div>
        <div class="flex justify-between border-b border-white/10 px-3 py-2 text-[12.5px]"><span>Build reorder task list</span><span class="text-cyan-300">Live</span></div>
        <div class="flex justify-between px-3 py-2 text-[12.5px]"><span>Draft supplier emails</span><span class="text-cyan-300">Live</span></div>
      </div>`,
    },
    "prompt-bar": {
      Rounded: `<div class="w-full max-w-md pk-glass rounded-2xl p-2">
        <div class="flex items-center gap-2 px-2 py-2"><span class="text-cyan-300">@</span><span class="text-[13px]">Forecast waffle cone demand for July</span></div>
        <div class="flex justify-between px-2 pb-1 text-[11px] text-ink-3"><span class="pk-pill">Vanilla 1</span><span>Dictate</span></div>
      </div>`,
      Pill: `<div class="w-full max-w-md pk-glass rounded-full px-4 py-3 flex items-center gap-2">
        <span class="text-cyan-300">@</span>
        <span class="flex-1 text-[13px]">Forecast waffle cone demand for July</span>
        <span class="pk-pill">Vanilla 1</span>
      </div>`,
    },
  };

  function applyOriginal(id, variant, section) {
    const map = ORIGINAL[id];
    if (!map || !map[variant]) return false;
    const root = demoRoot(section);
    if (!root) return false;
    root.innerHTML = map[variant];
    return true;
  }

  function applyVariant(section, variant) {
    const id = section.dataset.extId || section.id;
    if (window.__prismApplyVariant && section.classList.contains("bui-ext-section")) {
      window.__prismApplyVariant(id, variant, section);
      return;
    }
    if (applyOriginal(id, variant, section)) {
      flash(section);
      return;
    }
    if (window.__prismApplyVariant) {
      window.__prismApplyVariant(id, variant, section);
    }
  }

  function onClickCapture(e) {
    const btn = e.target.closest?.("button[data-variant], .pk-variant-bar button, .bui-ext-variants button");
    if (!btn) return;
    const section = sectionOf(btn);
    const bar = btn.closest(".pk-variant-bar, .bui-ext-variants");
    if (!section || !bar) return;
    const variant = btn.dataset.variant || (btn.textContent || "").trim();
    if (!variant) return;
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();
    setActiveVariantButton(bar, btn);
    applyVariant(section, variant);
  }

  function setupNavHover() {
    const nav = document.querySelector("nav[aria-label='Components']");
    const ul = nav?.querySelector("ul");
    if (!ul) return;

    let pill = ul.querySelector("[data-pk-pill]");
    if (!pill) {
      pill = document.createElement("span");
      pill.setAttribute("data-pk-pill", "true");
      pill.setAttribute("aria-hidden", "true");
      pill.className = "pk-nav-pill pointer-events-none absolute inset-x-0";
      ul.style.position = "relative";
      ul.prepend(pill);
    }

    function move(link) {
      if (!link) return;
      pill.style.top = `${link.offsetTop}px`;
      pill.style.height = `${link.offsetHeight}px`;
      pill.style.opacity = "1";
    }

    if (!ul.dataset.pkHover) {
      ul.dataset.pkHover = "true";
      ul.addEventListener(
        "mouseover",
        (e) => {
          const link = e.target.closest("a");
          if (link && ul.contains(link)) move(link);
        },
        true,
      );
      ul.addEventListener("mouseleave", () => {
        const active = ul.querySelector("a.meridian-nav-active, a.pk-nav-active");
        if (active) move(active);
        else pill.style.opacity = "0";
      });
    }

    window.__meridianSetActiveNav = (id) => {
      ul.querySelectorAll("a").forEach((a) => {
        const href = a.getAttribute("href") || "";
        const on = href.endsWith(`#${id}`) || href === `#${id}`;
        a.classList.toggle("meridian-nav-active", on);
        a.classList.toggle("pk-nav-active", on);
      });
      if (!ul.matches(":hover")) {
        const active = ul.querySelector(`a[href$="#${id}"]`);
        if (active) move(active);
      }
    };
  }

  function wireNavScroll() {
    document.querySelectorAll("nav[aria-label='Components'] a[href*='#']").forEach((link) => {
      if (link.dataset.pkNav) return;
      link.dataset.pkNav = "true";
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href") || "";
        const id = href.split("#")[1];
        const target = id && document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (window.__meridianSetActiveNav) window.__meridianSetActiveNav(id);
      });
    });
  }

  function tickElapsed() {
    document.querySelectorAll(".pk-elapsed").forEach((el) => {
      const n = parseFloat(el.textContent) || 0;
      el.textContent = (n + 0.1).toFixed(1) + "s";
    });
  }

  function boot() {
    tagVariantBars();
    setupNavHover();
    wireNavScroll();
    document.documentElement.dataset.pkInteractions = "true";
  }

  document.addEventListener("click", onClickCapture, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  [400, 900, 1800, 3200, 5000].forEach((ms) => setTimeout(boot, ms));
  setInterval(tickElapsed, 100);

  let t = 0;
  const obs = new MutationObserver(() => {
    clearTimeout(t);
    t = setTimeout(boot, 80);
  });
  obs.observe(document.body, { childList: true, subtree: true });
})();
