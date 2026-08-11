(function () {
  const NEW_PRIMITIVES = [
    {
      id: "error-recovery",
      title: "Error Recovery",
      caption: "Graceful failure with retry and context for the user.",
      number: "20",
    },
    {
      id: "toast-alert",
      title: "Toast Alert",
      caption: "Transient success, warning, and error notifications.",
      number: "21",
    },
    {
      id: "file-attachments",
      title: "File Attachments",
      caption: "Upload previews with type icons and remove actions.",
      number: "22",
    },
    {
      id: "response-feedback",
      title: "Response Feedback",
      caption: "Thumbs, stars, and quick correction on agent output.",
      number: "23",
    },
    {
      id: "agent-timeline",
      title: "Agent Timeline",
      caption: "Vertical timeline of tool calls and checkpoints.",
      number: "24",
    },
    {
      id: "memory-pins",
      title: "Memory Pins",
      caption: "Pinned facts the agent keeps across sessions.",
      number: "25",
    },
  ];

  function removeMarketing() {
    document.querySelectorAll("section.px-8.py-14").forEach((el) => {
      if (el.textContent.includes("in your inbox")) el.remove();
    });
    document.querySelectorAll('a[href*="turbodesign.co"]').forEach((el) => {
      const block = el.closest(".mt-8.shrink-0");
      if (block) block.remove();
    });
    document.querySelectorAll('a[href*="cal.com"]').forEach((el) => el.remove());
  }

  function showcaseSection(primitive, innerHtml, variants) {
    const variantsHtml =
      variants && variants.length
        ? `<div class="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 rounded-full bg-field p-0.5">${variants
            .map(
              (v, i) =>
                `<button type="button" class="rounded-full px-2 py-0.5 text-[11.5px] font-medium transition-[background-color,color,box-shadow] duration-150 ${i === 0 ? "bg-surface text-ink shadow-btn" : "text-ink-3 hover:text-ink-2"}">${v}</button>`,
            )
            .join("")}</div>`
        : "";

    return `
<section id="${primitive.id}" class="primitive-showcase group flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-8 py-10">
  <div class="mb-3 flex items-start gap-2 sm:items-baseline">
    <span class="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">${primitive.number}</span>
    <div class="min-w-0 sm:flex sm:items-baseline sm:gap-2">
      <h3 class="whitespace-nowrap text-[13px] font-semibold text-ink">${primitive.title}</h3>
      <p class="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">${primitive.caption}</p>
    </div>
  </div>
  <div class="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style="min-height:272px">
    <div class="w-full max-w-120 [&>*]:mx-auto">${innerHtml}</div>
    ${variantsHtml}
    <div class="absolute top-3 right-3 flex gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
      <button aria-label="Copy code" class="flex size-7 items-center justify-center rounded-control bg-surface shadow-btn transition-colors duration-100 hover:bg-hover text-ink-3 hover:text-ink">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2.5"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
      </button>
    </div>
  </div>
</section>`;
  }

  const DEMOS = {
    "error-recovery": `
      <div class="w-full max-w-95 rounded-window bg-surface p-4 shadow-hairline">
        <div class="flex items-start gap-3">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-tint text-red">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          </span>
          <div class="min-w-0">
            <p class="text-[13px] font-medium text-ink">POS export timed out</p>
            <p class="mt-1 text-[12.5px] text-ink-2">The agent couldn't read <code class="rounded bg-field px-1 font-mono text-[11px]">weekend_sales.csv</code>. Retry or switch to the cached export.</p>
            <div class="mt-3 flex gap-2">
              <button type="button" class="rounded-full bg-ink px-3 py-1 text-[12px] font-medium text-surface">Retry</button>
              <button type="button" class="rounded-full bg-field px-3 py-1 text-[12px] text-ink-2">Use cache</button>
            </div>
          </div>
        </div>
      </div>`,
    "toast-alert": `
      <div class="flex w-full max-w-95 flex-col gap-2">
        <div class="flex items-center gap-2 rounded-window bg-surface px-3 py-2 shadow-raised">
          <span class="flex size-6 items-center justify-center rounded-full bg-green-tint text-green"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg></span>
          <span class="text-[12.5px] text-ink">Reorder draft saved for Aurora Scoops</span>
        </div>
        <div class="flex items-center gap-2 rounded-window bg-surface px-3 py-2 shadow-raised">
          <span class="flex size-6 items-center justify-center rounded-full bg-orange-tint text-orange"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/></svg></span>
          <span class="text-[12.5px] text-ink">Mint chip velocity is below threshold</span>
        </div>
      </div>`,
    "file-attachments": `
      <div class="flex w-full max-w-95 flex-wrap gap-2">
        <div class="flex items-center gap-2 rounded-control bg-surface px-2.5 py-1.5 shadow-hairline">
          <span class="rounded bg-field px-1.5 py-0.5 font-mono text-[10px] text-ink-3">PDF</span>
          <span class="text-[12.5px] text-ink">menu_q3_draft.pdf</span>
          <span class="text-[11px] text-ink-3">1.2 MB</span>
        </div>
        <div class="flex items-center gap-2 rounded-control bg-surface px-2.5 py-1.5 shadow-hairline">
          <span class="rounded bg-field px-1.5 py-0.5 font-mono text-[10px] text-ink-3">CSV</span>
          <span class="text-[12.5px] text-ink">flavor_velocity.csv</span>
          <span class="text-[11px] text-ink-3">84 KB</span>
        </div>
        <button type="button" class="flex size-8 items-center justify-center rounded-control bg-field text-ink-3 hover:bg-hover hover:text-ink">+</button>
      </div>`,
    "response-feedback": `
      <div class="w-full max-w-95 space-y-3">
        <p class="text-[12.5px] leading-relaxed text-ink">Pistachio should lead the weekend menu — demand peaks after 2pm at Kumo Creamery.</p>
        <div class="flex items-center gap-1">
          <button type="button" class="flex size-8 items-center justify-center rounded-full bg-field text-ink-2 hover:bg-hover"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg></button>
          <button type="button" class="flex size-8 items-center justify-center rounded-full bg-field text-ink-2 hover:bg-hover"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/></svg></button>
          <span class="ml-2 text-[11.5px] text-ink-3">Was this helpful?</span>
        </div>
      </div>`,
    "agent-timeline": `
      <div class="w-full max-w-95">
        <div class="relative ml-2 space-y-3 pl-4">
          <span class="absolute left-[3px] top-1 bottom-1 w-px bg-line"></span>
          <div class="relative"><span class="absolute -left-[13px] top-1.5 size-2 rounded-full bg-green"></span><p class="text-[12.5px] font-medium text-ink">Matched suppliers</p><p class="text-[11.5px] text-ink-3">12 records · 0.8s</p></div>
          <div class="relative"><span class="absolute -left-[13px] top-1.5 size-2 rounded-full bg-accent"></span><p class="text-[12.5px] font-medium text-ink">Scoring stockout risk</p><p class="text-[11.5px] text-ink-3">68% confidence · running</p></div>
          <div class="relative"><span class="absolute -left-[13px] top-1.5 size-2 rounded-full bg-field border border-line"></span><p class="text-[12.5px] text-ink-2">Draft supplier emails</p><p class="text-[11.5px] text-ink-3">queued</p></div>
        </div>
      </div>`,
    "memory-pins": `
      <div class="w-full max-w-95 space-y-2">
        <div class="rounded-window bg-surface p-3 shadow-hairline">
          <div class="flex items-center justify-between"><span class="text-[12px] font-medium text-ink">Weekend churn window</span><span class="text-[10px] text-accent">Pinned</span></div>
          <p class="mt-1 text-[12px] text-ink-2">Churn pistachio batches before Saturday 10am for afternoon service.</p>
        </div>
        <div class="rounded-window bg-surface p-3 shadow-hairline">
          <div class="flex items-center justify-between"><span class="text-[12px] font-medium text-ink">Cone lead time</span><span class="text-[10px] text-ink-3">Auto</span></div>
          <p class="mt-1 text-[12px] text-ink-2">cone_king ships in 7 days — reorder at 40% stock.</p>
        </div>
      </div>`,
  };

  function injectNav() {
    const nav = document.querySelector("nav[aria-label='Components'] ul");
    if (!nav || nav.dataset.extensions) return;
    nav.dataset.extensions = "true";
    NEW_PRIMITIVES.forEach((p) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="#${p.id}" class="relative z-10 flex items-center rounded-[7px] px-2 py-[5px] text-[12.5px] transition-colors duration-150 text-ink-2 hover:text-ink">${p.title}</a>`;
      nav.appendChild(li);
    });
  }

  function injectSections() {
    const col = document.querySelector(".min-w-0 > .flex.w-full.flex-col");
    if (!col || col.dataset.extensions) return;
    col.dataset.extensions = "true";
    const html = NEW_PRIMITIVES.map((p) => showcaseSection(p, DEMOS[p.id], null)).join("");
    col.insertAdjacentHTML("beforeend", html);
  }

  function run() {
    removeMarketing();
    injectNav();
    injectSections();
  }

  run();
  document.addEventListener("DOMContentLoaded", run);
  setTimeout(run, 500);
  setTimeout(run, 2000);
})();
