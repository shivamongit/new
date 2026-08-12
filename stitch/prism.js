(function () {
  "use strict";

  const BRAND = {
    name: "Stitch UI",
    tagline: "Glass-dark primitives for agent products.",
    title: "Stitch UI — Intelligent interface primitives",
    description:
      "A curated library of polished, copy-paste components for agents, approvals, streaming states, and everything AI products need to feel premium.",
  };

  function applyStitchBranding() {
    document.title = BRAND.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", BRAND.description);

    const h1 = document.querySelector("aside.stitch-legacy-aside h1, aside h1");
    if (h1 && !h1.dataset.stitch) {
      h1.dataset.stitch = "true";
      h1.innerHTML = `<span class="stitch-hero-gradient">${BRAND.name}</span><br><span class="text-[13px] font-normal text-on-surface-variant">${BRAND.tagline}</span>`;
    }

    const navLabel = document.querySelector("nav[aria-label='Components'] > p");
    if (navLabel && !navLabel.dataset.stitch) {
      navLabel.dataset.stitch = "true";
      navLabel.textContent = "Primitives";
      navLabel.className = "mb-2 text-[11px] uppercase tracking-widest text-on-surface-variant font-medium";
    }

    const logoImg = document.querySelector("aside img[alt]");
    if (logoImg && !logoImg.dataset.stitch) {
      logoImg.dataset.stitch = "true";
      logoImg.style.display = "none";
      const wrap = logoImg.parentElement;
      if (wrap && !wrap.querySelector(".stitch-logo-mark")) {
        const brand = document.createElement("div");
        brand.className = "stitch-logo-mark";
        brand.innerHTML = `
          <div class="stitch-logo-icon cyan-glow">
            <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">auto_awesome</span>
          </div>
          <div class="stitch-logo-text">
            <span class="stitch-logo-name">${BRAND.name}</span>
            <span class="stitch-logo-sub">Interface kit</span>
          </div>`;
        wrap.insertBefore(brand, logoImg);
      }
    }

    const themeToggle = document.querySelector("aside .relative.inline-grid.h-9");
    if (themeToggle) themeToggle.style.display = "none";
  }

  function markLegacyLayout() {
    const legacyMain = document.querySelector("main.relative.mx-auto");
    const aside = legacyMain?.querySelector("aside");
    if (aside) aside.classList.add("stitch-legacy-aside");
    if (legacyMain) legacyMain.classList.add("stitch-legacy-main");
  }

  function setupSearch() {
    const input = document.getElementById("stitch-search");
    if (!input) return;
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      document.querySelectorAll("nav[aria-label='Components'] ul li").forEach((li) => {
        const text = li.textContent?.toLowerCase() || "";
        li.style.display = !q || text.includes(q) ? "" : "none";
      });
      document.querySelectorAll("section.primitive-showcase").forEach((sec) => {
        const title = sec.querySelector("h3")?.textContent?.toLowerCase() || "";
        const cap = sec.querySelector("p")?.textContent?.toLowerCase() || "";
        const match = !q || title.includes(q) || cap.includes(q) || sec.id.includes(q);
        sec.style.display = match ? "" : "none";
      });
    });
  }

  function init() {
    markLegacyLayout();
    applyStitchBranding();
    setupSearch();
    document.documentElement.dataset.stitchUi = "true";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
