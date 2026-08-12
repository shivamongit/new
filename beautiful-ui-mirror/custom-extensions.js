(function () {
  "use strict";

  const BASE = document.querySelector("base")?.href?.replace(/\/$/, "") || "";
  const BRAND = {
    name: "Prism Kit",
    tagline: "Luminous primitives for agent interfaces.",
    title: "Prism Kit — Intelligent interface primitives",
    description:
      "A curated library of polished, copy-paste components for agents, approvals, streaming states, and everything AI products need to feel premium.",
  };

  const NEW_PRIMITIVES = [
    {
      id: "error-recovery",
      number: "20",
      title: "Error Recovery",
      caption: "Graceful failure with retry, fallback, and clear operator context.",
      variants: ["Timeout", "Auth", "Rate limit"],
    },
    {
      id: "live-toasts",
      number: "21",
      title: "Live Toasts",
      caption: "Stacked transient alerts with severity, progress, and dismiss.",
      variants: ["Success", "Warning", "Error"],
    },
    {
      id: "attachment-tray",
      number: "22",
      title: "Attachment Tray",
      caption: "Upload chips with type badges, size, and remove-on-hover.",
      variants: ["Files", "Images", "Mixed"],
    },
    {
      id: "response-rating",
      number: "23",
      title: "Response Rating",
      caption: "Inline feedback on agent output — quick rating or correction.",
      variants: ["Thumbs", "Stars", "Tags"],
    },
    {
      id: "tool-trace",
      number: "24",
      title: "Tool Trace",
      caption: "Expandable trace of tool calls with timing and status pills.",
      variants: ["Collapsed", "Expanded", "Failed"],
    },
    {
      id: "memory-pins",
      number: "25",
      title: "Memory Pins",
      caption: "Pinned facts the agent recalls across sessions and handoffs.",
      variants: ["Pinned", "Suggested", "Expired"],
    },
    {
      id: "confidence-gate",
      number: "26",
      title: "Confidence Gate",
      caption: "Low-confidence blocker with meter, rationale, and override path.",
      variants: ["High", "Medium", "Blocked"],
    },
    {
      id: "model-router",
      number: "27",
      title: "Model Router",
      caption: "Route requests to fast, balanced, or reasoning models.",
      variants: ["Auto", "Fast", "Reasoning"],
    },
  ];

  const ICONS = {
    copy:
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2.5"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
    code:
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"></path></svg>',
    chevron:
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"></path></svg>',
    check:
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>',
    x: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>',
    spark:
      '<svg width="9" height="9" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"></path></svg>',
  };

  function variantBar(variants, active = 0) {
    if (!variants?.length) return "";
    return `<div class="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 rounded-full p-0.5 bui-ext-variants pk-variant-bar">${variants
      .map(
        (v, i) =>
          `<button type="button" data-variant="${v}" class="pk-variant-btn ${i === active ? "pk-variant-btn-active" : ""} rounded-full px-2.5 py-1 text-[11.5px] font-medium">${v}</button>`,
      )
      .join("")}</div>`;
  }

  function actionButtons() {
    return `<div class="absolute top-3 right-3 flex gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
      <button type="button" aria-label="Copy code" class="flex size-7 items-center justify-center rounded-control bg-surface shadow-btn transition-colors duration-100 hover:bg-hover text-ink-3 hover:text-ink">${ICONS.copy}</button>
      <button type="button" aria-label="View code" class="flex size-7 items-center justify-center rounded-control bg-surface text-ink-3 shadow-btn transition-colors duration-100 hover:bg-hover hover:text-ink">${ICONS.code}</button>
    </div>`;
  }

  function showcaseSection(primitive, innerHtml, delayMs = 240) {
    return `
<section id="${primitive.id}" class="primitive-showcase group bui-ext-section flex w-full scroll-mt-8 flex-col border-b border-dashed border-line px-8 py-10 bui-ext-fade-up" style="animation-delay:${delayMs}ms" data-ext-id="${primitive.id}">
  <div class="mb-3 flex items-start gap-2 sm:items-baseline">
    <span class="mt-0.5 font-mono text-[11px] text-ink-3 tabular-nums sm:mt-0">${primitive.number}</span>
    <div class="min-w-0 sm:flex sm:items-baseline sm:gap-2">
      <h3 class="whitespace-nowrap text-[13px] font-semibold text-ink">${primitive.title}</h3>
      <p class="mt-0.5 text-[12.5px] text-ink-3 text-pretty sm:mt-0 sm:truncate">${primitive.caption}</p>
    </div>
  </div>
  <div class="primitive-demo-surface relative flex items-center justify-center overflow-hidden rounded-window bg-canvas p-3 shadow-hairline" style="min-height:272px">
    <div class="w-full max-w-120 [&>*]:mx-auto">${innerHtml}</div>
    ${variantBar(primitive.variants)}
    ${actionButtons()}
  </div>
</section>`;
  }

  const DEMOS = {
    "error-recovery": `
<div class="flex min-h-[196px] w-full max-w-80 flex-col items-stretch" data-demo="error-recovery">
  <div class="w-full overflow-hidden rounded-card bg-surface shadow-card">
    <div class="primitive-card-pad" style="animation:fade-up 350ms cubic-bezier(0.23,1,0.32,1) both">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-start gap-2.5">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-tint text-red">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          </span>
          <div class="min-w-0">
            <p class="text-[13px] font-medium text-ink" data-state-label>POS export timed out</p>
            <p class="mt-1 text-[12.5px] leading-relaxed text-ink-2" data-state-body>Could not read <code class="rounded-md bg-accent-tint px-1.5 py-0.5 font-mono text-[11px] text-accent-ink">weekend_sales.csv</code> after 30s. Cached export from 2h ago is available.</p>
          </div>
        </div>
        <button type="button" aria-label="Dismiss" class="primitive-icon-button shrink-0 text-ink-3 hover:bg-hover hover:text-ink">${ICONS.x}</button>
      </div>
    </div>
    <div class="primitive-card-footer flex items-center justify-between gap-3 border-t border-line bg-inset">
      <span class="text-[12px] text-ink-3 tabular-nums" data-retry-meta>Attempt 1 of 3</span>
      <span class="flex items-center gap-2">
        <button type="button" class="h-7 rounded-control px-2.5 text-[12.5px] font-medium shadow-btn bg-surface text-ink-2 hover:bg-hover transition-[background-color,transform] duration-100 active:scale-[0.96]" data-use-cache>Use cache</button>
        <button type="button" class="h-7 rounded-control px-3 text-[12.5px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_0_0_1px_rgba(16,24,40,0.12),0_1px_2px_rgba(16,24,40,0.1)] bg-accent text-white transition-[background-color,transform] duration-150 active:scale-[0.96] flex items-center gap-1.5" data-retry-btn>
          <span data-retry-label>Retry export</span>
          <span class="hidden size-3.5 rounded-full border-2 border-white/30 border-t-white meridian-spin" data-retry-spin></span>
        </button>
      </span>
    </div>
  </div>
</div>`,

    "live-toasts": `
<div class="flex w-full max-w-95 flex-col gap-2 min-h-[200px]" data-demo="live-toasts">
  <div class="bui-ext-toast-enter flex items-center gap-2.5 rounded-[10px] bg-surface px-3 py-2 shadow-raised border border-line" data-toast>
    <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-tint text-green">${ICONS.check}</span>
    <div class="min-w-0 flex-1">
      <p class="text-[12.5px] font-medium text-ink">Reorder draft saved</p>
      <p class="text-[11.5px] text-ink-3">Aurora Scoops · cone_king PO</p>
    </div>
    <button type="button" aria-label="Dismiss" class="flex size-6 items-center justify-center rounded-[6px] text-ink-3 hover:bg-hover hover:text-ink" data-dismiss-toast>${ICONS.x}</button>
  </div>
  <div class="bui-ext-toast-enter flex items-center gap-2.5 rounded-[10px] bg-surface px-3 py-2 shadow-raised border border-line" style="animation-delay:80ms" data-toast>
    <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-tint text-orange">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/></svg>
    </span>
    <div class="min-w-0 flex-1">
      <p class="text-[12.5px] font-medium text-ink">Mint chip below threshold</p>
      <div class="mt-1 h-1 w-full overflow-hidden rounded-full bg-field"><div class="h-full w-[68%] rounded-full bg-orange transition-all duration-500" data-toast-progress></div></div>
    </div>
    <button type="button" aria-label="Dismiss" class="flex size-6 items-center justify-center rounded-[6px] text-ink-3 hover:bg-hover hover:text-ink" data-dismiss-toast>${ICONS.x}</button>
  </div>
  <div class="bui-ext-toast-enter flex items-center gap-2.5 rounded-[10px] bg-surface px-3 py-2 shadow-raised border border-line opacity-90" style="animation-delay:160ms" data-toast>
    <span class="relative flex size-6 shrink-0 items-center justify-center">
      <span class="absolute size-2 rounded-full bg-accent bui-ext-pulse-dot"></span>
      <span class="flex size-6 items-center justify-center rounded-full bg-accent-tint text-accent">${ICONS.spark}</span>
    </span>
    <div class="min-w-0 flex-1">
      <p class="text-[12.5px] font-medium text-ink">Agent drafting supplier emails</p>
      <p class="text-[11.5px] text-ink-3">2 of 3 messages queued</p>
    </div>
  </div>
</div>`,

    "attachment-tray": `
<div class="w-full max-w-105" data-demo="attachment-tray">
  <div class="rounded-[14px] border border-line bg-surface p-2 shadow-card">
    <div class="flex items-center justify-between px-1.5 pb-2">
      <span class="text-[12px] font-medium text-ink">Attachments</span>
      <span class="text-[11px] text-ink-3 tabular-nums">3 files · 2.1 MB</span>
    </div>
    <div class="flex flex-wrap gap-1.5" data-attachment-list>
      <div class="group/chip flex items-center gap-2 rounded-control bg-field px-2 py-1.5 shadow-hairline transition-colors duration-150 hover:bg-hover" data-attachment-chip>
        <span class="flex size-7 items-center justify-center rounded-[6px] bg-surface text-[10px] font-mono font-semibold text-red shadow-btn">PDF</span>
        <div class="min-w-0">
          <p class="truncate text-[12.5px] font-medium text-ink">menu_q3_draft.pdf</p>
          <p class="text-[10.5px] text-ink-3 tabular-nums">1.2 MB</p>
        </div>
        <button type="button" aria-label="Remove" class="ml-1 flex size-6 items-center justify-center rounded-[6px] text-ink-3 opacity-0 transition-all duration-150 group-hover/chip:opacity-100 hover:bg-hover hover:text-ink" data-remove-chip>${ICONS.x}</button>
      </div>
      <div class="group/chip flex items-center gap-2 rounded-control bg-field px-2 py-1.5 shadow-hairline transition-colors duration-150 hover:bg-hover" data-attachment-chip>
        <span class="flex size-7 items-center justify-center rounded-[6px] bg-surface text-[10px] font-mono font-semibold text-accent-ink shadow-btn">CSV</span>
        <div class="min-w-0">
          <p class="truncate text-[12.5px] font-medium text-ink">flavor_velocity.csv</p>
          <p class="text-[10.5px] text-ink-3 tabular-nums">84 KB</p>
        </div>
        <button type="button" aria-label="Remove" class="ml-1 flex size-6 items-center justify-center rounded-[6px] text-ink-3 opacity-0 transition-all duration-150 group-hover/chip:opacity-100 hover:bg-hover hover:text-ink" data-remove-chip>${ICONS.x}</button>
      </div>
      <div class="group/chip flex items-center gap-2 rounded-control bg-field px-2 py-1.5 shadow-hairline transition-colors duration-150 hover:bg-hover" data-attachment-chip>
        <span class="flex size-7 items-center justify-center rounded-[6px] bg-surface overflow-hidden shadow-btn">
          <span class="size-full bg-gradient-to-br from-accent-tint to-green-tint"></span>
        </span>
        <div class="min-w-0">
          <p class="truncate text-[12.5px] font-medium text-ink">storefront.jpg</p>
          <p class="text-[10.5px] text-ink-3 tabular-nums">756 KB</p>
        </div>
        <button type="button" aria-label="Remove" class="ml-1 flex size-6 items-center justify-center rounded-[6px] text-ink-3 opacity-0 transition-all duration-150 group-hover/chip:opacity-100 hover:bg-hover hover:text-ink" data-remove-chip>${ICONS.x}</button>
      </div>
      <button type="button" class="flex size-9 items-center justify-center rounded-control border border-dashed border-line-strong bg-inset text-ink-3 transition-colors duration-150 hover:border-line hover:bg-hover hover:text-ink" aria-label="Add file">+</button>
    </div>
  </div>
</div>`,

    "response-rating": `
<div class="w-full max-w-95 space-y-3" data-demo="response-rating">
  <div class="rounded-xl bg-field px-3 py-2 text-[12.5px] leading-relaxed text-ink">
  Pistachio should lead the weekend menu — demand peaks after 2pm at <span class="font-medium">Kumo Creamery</span> with <code class="rounded bg-accent-tint px-1 font-mono text-[11px] text-accent-ink">+18%</code> lift.
  </div>
  <div class="flex items-center gap-1" data-rating-row>
    <button type="button" aria-label="Helpful" aria-pressed="false" class="flex size-8 items-center justify-center rounded-full bg-field text-ink-2 transition-[background-color,color,transform] duration-150 hover:bg-hover active:scale-[0.94]" data-rating="up">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>
    </button>
    <button type="button" aria-label="Not helpful" aria-pressed="false" class="flex size-8 items-center justify-center rounded-full bg-field text-ink-2 transition-[background-color,color,transform] duration-150 hover:bg-hover active:scale-[0.94]" data-rating="down">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/></svg>
    </button>
    <span class="ml-2 text-[11.5px] text-ink-3" data-rating-hint>Rate this answer</span>
  </div>
  <div class="grid transition-[grid-template-rows,opacity] duration-300" style="grid-template-rows:0fr;opacity:0" data-correction-panel>
    <div class="overflow-hidden">
      <label class="flex flex-col gap-1.5 rounded-control border border-line bg-surface p-2 shadow-hairline focus-within:border-line-strong">
        <span class="text-[11px] font-medium text-ink-3">Tell the agent what's wrong</span>
        <input type="text" placeholder="Peak is after 3pm, not 2pm…" class="bg-transparent text-[12.5px] text-ink outline-none placeholder:text-ink-3" />
      </label>
    </div>
  </div>
</div>`,

    "tool-trace": `
<div class="min-h-[220px] w-full max-w-95 pb-1" data-demo="tool-trace">
  <button type="button" aria-expanded="true" class="-mx-1.5 flex w-fit items-center gap-1.5 rounded-control px-1.5 py-1 text-[12.5px] text-ink-2 transition-colors duration-100 hover:bg-hover-2" data-trace-toggle>
    <span class="transition-transform duration-200" data-trace-chevron style="display:inline-flex">${ICONS.chevron}</span>
    <span class="tabular-nums">4 tool calls · 1.2s</span>
  </button>
  <div class="grid transition-[grid-template-rows,opacity] duration-300" style="grid-template-rows:1fr;opacity:1" data-trace-body>
    <div class="-mx-1 overflow-hidden px-1.5 pb-1">
      <div class="mt-1.5 flex flex-col gap-1">
        <div class="flex items-center gap-2 rounded-control px-1.5 py-1 text-[12px] hover:bg-hover-2">
          <span class="flex size-5 items-center justify-center rounded-full bg-green-tint text-green">${ICONS.check}</span>
          <span class="min-w-0 flex-1 truncate font-mono text-[11.5px] text-ink-2">read_pos_export</span>
          <span class="rounded-full bg-green-tint px-2 py-0.5 text-[10.5px] font-medium text-green">240ms</span>
        </div>
        <div class="flex items-center gap-2 rounded-control px-1.5 py-1 text-[12px] hover:bg-hover-2">
          <span class="flex size-5 items-center justify-center rounded-full bg-green-tint text-green">${ICONS.check}</span>
          <span class="min-w-0 flex-1 truncate font-mono text-[11.5px] text-ink-2">match_suppliers</span>
          <span class="rounded-full bg-green-tint px-2 py-0.5 text-[10.5px] font-medium text-green">180ms</span>
        </div>
        <div class="flex items-center gap-2 rounded-control px-1.5 py-1 text-[12px] bg-accent-tint/40">
          <span class="relative flex size-5 items-center justify-center">
            <svg width="18" height="18" class="absolute meridian-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="none" stroke="var(--line)" stroke-width="2"/><circle cx="12" cy="12" r="11" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-dasharray="19 50"/></svg>
          </span>
          <span class="min-w-0 flex-1 truncate font-mono text-[11.5px] text-ink">score_stockout_risk</span>
          <span class="rounded-full bg-field px-2 py-0.5 text-[10.5px] font-medium text-accent-ink">running</span>
        </div>
        <div class="flex items-center gap-2 rounded-control px-1.5 py-1 text-[12px] text-ink-3">
          <span class="flex size-5 items-center justify-center rounded-full border border-line"></span>
          <span class="min-w-0 flex-1 truncate font-mono text-[11.5px]">draft_emails</span>
          <span class="text-[10.5px]">queued</span>
        </div>
      </div>
    </div>
  </div>
</div>`,

    "memory-pins": `
<div class="w-full max-w-95 space-y-2" data-demo="memory-pins">
  <div class="bui-ext-pin-pop overflow-hidden rounded-card bg-surface shadow-card" data-pin>
    <div class="primitive-card-pad flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <span class="text-[12.5px] font-semibold text-ink">Weekend churn window</span>
          <span class="rounded-full bg-accent-tint px-2 py-0.5 text-[10px] font-medium text-accent-ink">Pinned</span>
        </div>
        <p class="mt-1 text-[12px] leading-relaxed text-ink-2">Churn pistachio batches before Saturday 10am for afternoon service peaks.</p>
        <p class="mt-1.5 text-[10.5px] text-ink-3">Source: ops_playbook · updated 2d ago</p>
      </div>
      <button type="button" aria-label="Unpin" class="primitive-icon-button text-ink-3 hover:bg-hover hover:text-ink" data-pin-toggle>${ICONS.x}</button>
    </div>
  </div>
  <div class="bui-ext-pin-pop overflow-hidden rounded-card bg-surface shadow-card" style="animation-delay:60ms" data-pin>
    <div class="primitive-card-pad flex items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <span class="text-[12.5px] font-semibold text-ink">Cone lead time</span>
          <span class="rounded-full bg-field px-2 py-0.5 text-[10px] font-medium text-ink-3">Auto</span>
        </div>
        <p class="mt-1 text-[12px] leading-relaxed text-ink-2"><code class="rounded bg-field px-1 font-mono text-[11px]">cone_king</code> ships in 7 days — reorder at 40% stock.</p>
      </div>
      <button type="button" aria-label="Pin" class="primitive-icon-button text-ink-3 hover:bg-hover hover:text-ink" data-pin-toggle>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 17v5M9 10V4h6v6"/><path d="M9 10h6"/></svg>
      </button>
    </div>
  </div>
  <button type="button" class="flex w-full items-center justify-center gap-1.5 rounded-control border border-dashed border-line-strong py-2 text-[12px] text-ink-3 transition-colors duration-150 hover:border-line hover:bg-hover hover:text-ink">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
    Pin new fact from chat
  </button>
</div>`,

    "confidence-gate": `
<div class="w-full max-w-95 overflow-hidden rounded-card bg-surface shadow-card" data-demo="confidence-gate">
  <div class="primitive-card-pad">
    <span class="text-[13px] font-semibold text-ink">Approve restock for pistachio?</span>
    <p class="mt-1.5 min-h-10 text-[13px] leading-relaxed text-ink-2">Agent confidence is below your threshold for autonomous PO creation.</p>
    <div class="mt-3 flex items-center gap-2">
      <span class="flex items-end gap-0.5" data-confidence-bars>
        <span class="w-1 rounded-full bg-orange" style="height:10px"></span>
        <span class="w-1 rounded-full bg-orange" style="height:10px"></span>
        <span class="w-1 rounded-full bg-line-strong" style="height:10px"></span>
      </span>
      <span class="text-[12.5px] font-medium text-orange" data-confidence-label>Medium confidence</span>
    </div>
  </div>
  <div class="grid transition-[grid-template-rows,opacity] duration-300" style="grid-template-rows:0fr;opacity:0" data-alt-panel>
    <div class="overflow-hidden">
      <div class="border-t border-line bg-inset px-2 py-2">
        <p class="px-1.5 pb-1 text-[11px] font-medium text-ink-3">Safer alternatives</p>
        <button type="button" class="flex w-full items-center gap-2.5 rounded-control px-1.5 py-1.5 text-left hover:bg-hover">
          <span class="flex items-end gap-0.5"><span class="w-1 rounded-full bg-green" style="height:10px"></span><span class="w-1 rounded-full bg-green" style="height:10px"></span><span class="w-1 rounded-full bg-green" style="height:10px"></span></span>
          <span class="min-w-0 flex-1 truncate text-[12.5px] text-ink">Draft PO for review only</span>
        </button>
      </div>
    </div>
  </div>
  <div class="primitive-card-footer flex items-center justify-between gap-3 border-t border-line bg-inset">
    <button type="button" aria-expanded="false" class="h-7 rounded-control px-2.5 text-[12.5px] font-medium shadow-btn bg-surface text-ink hover:bg-hover transition-transform active:scale-[0.96]" data-alt-toggle>Alternatives</button>
    <span class="flex gap-2">
      <button type="button" class="h-7 rounded-control px-2.5 text-[12.5px] font-medium text-ink-2 hover:bg-hover">Reject</button>
      <button type="button" class="h-7 rounded-control px-3 text-[12.5px] font-medium bg-accent text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_0_0_1px_rgba(16,24,40,0.12),0_1px_2px_rgba(16,24,40,0.1)] active:scale-[0.96]">Override &amp; accept</button>
    </span>
  </div>
</div>`,

    "model-router": `
<div class="w-full max-w-95" data-demo="model-router">
  <div class="overflow-hidden rounded-[14px] border border-line bg-surface shadow-card">
    <div class="flex items-center justify-between border-b border-line px-3 py-2">
      <span class="text-[12.5px] font-medium text-ink">Route request</span>
      <span class="flex items-center gap-1.5 text-[11px] text-ink-3"><span class="size-1.5 rounded-full bg-green"></span> Auto</span>
    </div>
    <div class="flex flex-col p-1" data-model-list>
      <button type="button" aria-pressed="true" class="flex items-center gap-3 rounded-control px-2.5 py-2 text-left transition-colors duration-150 bg-field" data-model-option="vanilla">
        <span class="flex size-8 items-center justify-center rounded-[8px] bg-surface shadow-btn text-[11px] font-semibold text-accent-ink">V1</span>
        <div class="min-w-0 flex-1">
          <p class="text-[12.5px] font-medium text-ink">Vanilla 1</p>
          <p class="text-[11px] text-ink-3">Balanced · 1.2s avg latency</p>
        </div>
        <span class="rounded-full bg-green-tint px-2 py-0.5 text-[10px] font-medium text-green">Fast</span>
      </button>
      <button type="button" aria-pressed="false" class="flex items-center gap-3 rounded-control px-2.5 py-2 text-left transition-colors duration-150 hover:bg-hover-2" data-model-option="mint">
        <span class="flex size-8 items-center justify-center rounded-[8px] bg-surface shadow-btn text-[11px] font-semibold text-ink-2">M2</span>
        <div class="min-w-0 flex-1">
          <p class="text-[12.5px] font-medium text-ink">Mint 2</p>
          <p class="text-[11px] text-ink-3">Reasoning · 4.8s avg latency</p>
        </div>
        <span class="rounded-full bg-accent-tint px-2 py-0.5 text-[10px] font-medium text-accent-ink">Deep</span>
      </button>
      <button type="button" aria-pressed="false" class="flex items-center gap-3 rounded-control px-2.5 py-2 text-left transition-colors duration-150 hover:bg-hover-2" data-model-option="sorbet">
        <span class="flex size-8 items-center justify-center rounded-[8px] bg-surface shadow-btn text-[11px] font-semibold text-ink-2">S0</span>
        <div class="min-w-0 flex-1">
          <p class="text-[12.5px] font-medium text-ink">Sorbet 0</p>
          <p class="text-[11px] text-ink-3">Ultra fast · 420ms avg latency</p>
        </div>
        <span class="rounded-full bg-field px-2 py-0.5 text-[10px] font-medium text-ink-3">Lite</span>
      </button>
    </div>
    <div class="border-t border-line bg-inset px-3 py-2">
      <p class="text-[11.5px] text-ink-2" data-model-hint>Routing <span class="font-medium text-ink">inventory query</span> to Vanilla 1</p>
    </div>
  </div>
</div>`,
  };

  const VARIANT_CONTENT = {
    "error-recovery": {
      Timeout: {
        label: "POS export timed out",
        body: "Could not read <code class=\"rounded-md bg-accent-tint px-1.5 py-0.5 font-mono text-[11px] text-accent-ink\">weekend_sales.csv</code> after 30s.",
      },
      Auth: {
        label: "Supplier API unauthorized",
        body: "Token for <code class=\"rounded-md bg-accent-tint px-1.5 py-0.5 font-mono text-[11px] text-accent-ink\">cone_king</code> expired. Reconnect to continue.",
      },
      "Rate limit": {
        label: "Rate limit reached",
        body: "POS sync paused — 120 requests/min exceeded. Retry in <span class=\"font-mono text-[11.5px]\">42s</span>.",
      },
    },
    "live-toasts": {
      Success: { progress: "100%", color: "green" },
      Warning: { progress: "68%", color: "orange" },
      Error: { progress: "12%", color: "red" },
    },
    "confidence-gate": {
      High: { level: 3, label: "High confidence", class: "text-green" },
      Medium: { level: 2, label: "Medium confidence", class: "text-orange" },
      Blocked: { level: 1, label: "Blocked — review required", class: "text-red" },
    },
  };

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

  function injectNav() {
    const nav = document.querySelector("nav[aria-label='Components'] ul");
    if (!nav) return;
    NEW_PRIMITIVES.forEach((p) => {
      if (nav.querySelector(`a[href="#${p.id}"]`)) return;
      const li = document.createElement("li");
      li.innerHTML = `<a href="#${p.id}" data-bui-nav-link class="meridian-nav-ext relative z-10 flex items-center rounded-[7px] px-2 py-[5px] text-[12.5px] transition-colors duration-150 text-ink-2 hover:text-ink">${p.title}</a>`;
      nav.appendChild(li);
    });
  }

  function injectSections() {
    const col = document.querySelector(".min-w-0 > .flex.w-full.flex-col");
    if (!col) return false;
    const html = NEW_PRIMITIVES
      .filter((p) => !col.querySelector(`#${p.id}`))
      .map((p, i) => showcaseSection(p, DEMOS[p.id], 240 + i * 40))
      .join("");
    if (html) col.insertAdjacentHTML("beforeend", html);
    return !!html;
  }

  function setActiveVariantButton(bar, activeBtn) {
    bar.querySelectorAll("button").forEach((b) => {
      b.className =
        "rounded-full px-2 py-0.5 text-[11.5px] font-medium transition-[background-color,color,box-shadow] duration-150 text-ink-3 hover:text-ink-2";
    });
    activeBtn.className =
      "rounded-full px-2 py-0.5 text-[11.5px] font-medium transition-[background-color,color,box-shadow] duration-150 bg-surface text-ink shadow-btn";
  }

  function flashDemo(section) {
    const demo = section.querySelector("[data-demo]");
    if (!demo) return;
    demo.classList.remove("meridian-swap-in");
    demo.classList.add("meridian-swapping");
    requestAnimationFrame(() => {
      setTimeout(() => {
        demo.classList.remove("meridian-swapping");
        demo.classList.add("meridian-swap-in");
      }, 140);
    });
  }

  function applyVariant(id, variant, section) {
    if (id === "error-recovery" && VARIANT_CONTENT["error-recovery"][variant]) {
      const data = VARIANT_CONTENT["error-recovery"][variant];
      const label = section.querySelector("[data-state-label]");
      const body = section.querySelector("[data-state-body]");
      if (label) label.textContent = data.label;
      if (body) body.innerHTML = data.body;
    }
    if (id === "live-toasts") {
      const stack = section.querySelector("[data-demo]");
      if (stack && VARIANT_TOAST_HTML[variant]) {
        stack.innerHTML = VARIANT_TOAST_HTML[variant];
      }
    }
    if (id === "attachment-tray" && VARIANT_ATTACHMENT_HTML[variant]) {
      const list = section.querySelector("[data-attachment-list]");
      if (list) list.innerHTML = VARIANT_ATTACHMENT_HTML[variant];
    }
    if (id === "response-rating" && VARIANT_RATING_HTML[variant]) {
      const demo = section.querySelector("[data-demo]");
      if (demo) demo.innerHTML = VARIANT_RATING_HTML[variant];
    }
    if (id === "tool-trace") {
      const toggle = section.querySelector("[data-trace-toggle]");
      const body = section.querySelector("[data-trace-body]");
      const chevron = section.querySelector("[data-trace-chevron]");
      if (variant === "Collapsed") {
        toggle?.setAttribute("aria-expanded", "false");
        if (body) {
          body.style.gridTemplateRows = "0fr";
          body.style.opacity = "0";
        }
        if (chevron) chevron.style.transform = "rotate(-90deg)";
      } else if (variant === "Expanded") {
        toggle?.setAttribute("aria-expanded", "true");
        if (body) {
          body.style.gridTemplateRows = "1fr";
          body.style.opacity = "1";
        }
        if (chevron) chevron.style.transform = "rotate(0)";
      } else if (variant === "Failed") {
        toggle?.setAttribute("aria-expanded", "true");
        if (body) {
          body.style.gridTemplateRows = "1fr";
          body.style.opacity = "1";
          const list = body.querySelector(".flex.flex-col");
          if (list) {
            list.innerHTML = `
              <div class="flex items-center gap-2 rounded-control px-1.5 py-1 bg-red-tint/50">
                <span class="flex size-5 items-center justify-center rounded-full bg-red-tint text-red">${ICONS.x}</span>
                <span class="min-w-0 flex-1 truncate font-mono text-[11.5px] text-ink">score_stockout_risk</span>
                <span class="rounded-full bg-red-tint px-2 py-0.5 text-[10.5px] font-medium text-red">failed</span>
              </div>
              <div class="flex items-center gap-2 rounded-control px-1.5 py-1 text-ink-3">
                <span class="flex size-5 items-center justify-center rounded-full border border-line"></span>
                <span class="min-w-0 flex-1 truncate font-mono text-[11.5px]">draft_emails</span>
                <span class="text-[10.5px]">skipped</span>
              </div>`;
          }
        }
      }
    }
    if (id === "memory-pins" && VARIANT_PINS_HTML[variant]) {
      const demo = section.querySelector("[data-demo]");
      if (demo) demo.innerHTML = VARIANT_PINS_HTML[variant];
    }
    if (id === "confidence-gate" && VARIANT_CONTENT["confidence-gate"][variant]) {
      const data = VARIANT_CONTENT["confidence-gate"][variant];
      const bars = section.querySelectorAll("[data-confidence-bars] span");
      const label = section.querySelector("[data-confidence-label]");
      bars.forEach((bar, i) => {
        bar.className = `w-1 rounded-full transition-all duration-300 ${i < data.level ? (data.level === 3 ? "bg-green" : data.level === 2 ? "bg-orange" : "bg-red") : "bg-line-strong"}`;
        bar.style.height = "10px";
      });
      if (label) {
        label.textContent = data.label;
        label.className = `text-[12.5px] font-medium transition-colors duration-300 ${data.class}`;
      }
    }
    if (id === "model-router") {
      const hint = section.querySelector("[data-model-hint]");
      const map = {
        Auto: { q: "inventory query", policy: "Auto policy" },
        Fast: { q: "quick lookup", policy: "Sorbet 0" },
        Reasoning: { q: "multi-step forecast", policy: "Mint 2" },
      };
      const m = map[variant] || map.Auto;
      if (hint) {
        hint.innerHTML = `Routing <span class="font-medium text-ink">${m.q}</span> via <span class="text-accent-ink">${m.policy}</span>`;
      }
      const options = section.querySelectorAll("[data-model-option]");
      const pick = variant === "Fast" ? "sorbet" : variant === "Reasoning" ? "mint" : "vanilla";
      options.forEach((btn) => {
        const on = btn.dataset.modelOption === pick;
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        btn.classList.toggle("bg-field", on);
        btn.classList.toggle("hover:bg-hover-2", !on);
      });
    }
    flashDemo(section);
  }

  const VARIANT_TOAST_HTML = {
    Success: `
      <div class="bui-ext-toast-enter flex items-center gap-2.5 rounded-[10px] bg-surface px-3 py-2 shadow-raised border border-line">
        <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-tint text-green">${ICONS.check}</span>
        <div class="min-w-0 flex-1"><p class="text-[12.5px] font-medium text-ink">Reorder confirmed</p><p class="text-[11.5px] text-ink-3">cone_king PO #4821</p></div>
      </div>`,
    Warning: `
      <div class="bui-ext-toast-enter flex items-center gap-2.5 rounded-[10px] bg-surface px-3 py-2 shadow-raised border border-line">
        <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-orange-tint text-orange"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01"/></svg></span>
        <div class="min-w-0 flex-1"><p class="text-[12.5px] font-medium text-ink">Mint chip below threshold</p><div class="mt-1 h-1 w-full overflow-hidden rounded-full bg-field"><div class="h-full w-[68%] rounded-full bg-orange transition-all duration-500"></div></div></div>
      </div>`,
    Error: `
      <div class="bui-ext-toast-enter flex items-center gap-2.5 rounded-[10px] bg-surface px-3 py-2 shadow-raised border border-red-tint">
        <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-tint text-red">${ICONS.x}</span>
        <div class="min-w-0 flex-1"><p class="text-[12.5px] font-medium text-ink">Sync failed</p><p class="text-[11.5px] text-ink-3">POS connector unreachable</p></div>
      </div>`,
  };

  const VARIANT_ATTACHMENT_HTML = {
    Files: `
      <div class="group/chip flex items-center gap-2 rounded-control bg-field px-2 py-1.5 shadow-hairline" data-attachment-chip><span class="flex size-7 items-center justify-center rounded-[6px] bg-surface text-[10px] font-mono font-semibold text-red shadow-btn">PDF</span><div class="min-w-0"><p class="truncate text-[12.5px] font-medium text-ink">menu_q3.pdf</p><p class="text-[10.5px] text-ink-3">1.2 MB</p></div></div>
      <div class="group/chip flex items-center gap-2 rounded-control bg-field px-2 py-1.5 shadow-hairline" data-attachment-chip><span class="flex size-7 items-center justify-center rounded-[6px] bg-surface text-[10px] font-mono font-semibold text-accent-ink shadow-btn">CSV</span><div class="min-w-0"><p class="truncate text-[12.5px] font-medium text-ink">velocity.csv</p><p class="text-[10.5px] text-ink-3">84 KB</p></div></div>
      <button type="button" class="flex size-9 items-center justify-center rounded-control border border-dashed border-line-strong bg-inset text-ink-3">+</button>`,
    Images: `
      <div class="group/chip flex items-center gap-2 rounded-control bg-field px-2 py-1.5 shadow-hairline" data-attachment-chip><span class="flex size-7 items-center justify-center rounded-[6px] bg-gradient-to-br from-accent-tint to-green-tint shadow-btn overflow-hidden"></span><div class="min-w-0"><p class="truncate text-[12.5px] font-medium text-ink">storefront.jpg</p><p class="text-[10.5px] text-ink-3">756 KB</p></div></div>
      <div class="group/chip flex items-center gap-2 rounded-control bg-field px-2 py-1.5 shadow-hairline" data-attachment-chip><span class="flex size-7 items-center justify-center rounded-[6px] bg-gradient-to-br from-orange-tint to-red-tint shadow-btn"></span><div class="min-w-0"><p class="truncate text-[12.5px] font-medium text-ink">menu_board.png</p><p class="text-[10.5px] text-ink-3">412 KB</p></div></div>
      <button type="button" class="flex size-9 items-center justify-center rounded-control border border-dashed border-line-strong bg-inset text-ink-3">+</button>`,
    Mixed: `
      <div class="group/chip flex items-center gap-2 rounded-control bg-field px-2 py-1.5 shadow-hairline" data-attachment-chip><span class="flex size-7 items-center justify-center rounded-[6px] bg-surface text-[10px] font-mono text-accent-ink shadow-btn">CSV</span><div class="min-w-0"><p class="truncate text-[12.5px] font-medium text-ink">sales.csv</p></div></div>
      <div class="group/chip flex items-center gap-2 rounded-control bg-field px-2 py-1.5 shadow-hairline" data-attachment-chip><span class="flex size-7 items-center justify-center rounded-[6px] bg-gradient-to-br from-accent-tint to-green-tint shadow-btn"></span><div class="min-w-0"><p class="truncate text-[12.5px] font-medium text-ink">photo.jpg</p></div></div>
      <button type="button" class="flex size-9 items-center justify-center rounded-control border border-dashed border-line-strong bg-inset text-ink-3">+</button>`,
  };

  const VARIANT_RATING_HTML = {
    Thumbs: `
      <div class="rounded-xl bg-field px-3 py-2 text-[12.5px] leading-relaxed text-ink">Pistachio should lead the weekend menu.</div>
      <div class="flex items-center gap-1 mt-3" data-rating-row>
        <button type="button" data-rating="up" class="flex size-8 items-center justify-center rounded-full bg-field text-ink-2 hover:bg-hover"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg></button>
        <button type="button" data-rating="down" class="flex size-8 items-center justify-center rounded-full bg-field text-ink-2 hover:bg-hover"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 14V2M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/></svg></button>
        <span class="ml-2 text-[11.5px] text-ink-3" data-rating-hint>Rate this answer</span>
      </div>`,
    Stars: `
      <div class="rounded-xl bg-field px-3 py-2 text-[12.5px] text-ink">Response quality for supplier draft</div>
      <div class="mt-3 flex items-center gap-0.5">${[1,2,3,4,5].map(i => `<button type="button" class="flex size-8 items-center justify-center rounded-full text-ink-3 hover:bg-hover hover:text-orange" aria-label="Star ${i}"><svg width="16" height="16" viewBox="0 0 24 24" fill="${i<=4?'var(--orange)':'none'}" stroke="var(--orange)" stroke-width="1.5"><path d="M12 2l2.9 6.5L22 9.5l-5 4.5 1.5 6.5L12 17l-6.5 3 1.5-6.5-5-4.5 6.1-1 2.9-6.5z"/></svg></button>`).join("")}</div>
      <p class="mt-1 text-[11.5px] text-ink-3">4 stars — almost perfect tone</p>`,
    Tags: `
      <div class="rounded-xl bg-field px-3 py-2 text-[12.5px] text-ink">Tag what was wrong</div>
      <div class="mt-2 flex flex-wrap gap-1">${["Inaccurate","Too long","Off tone","Missing data"].map((t,i)=>`<button type="button" class="rounded-full px-2.5 py-1 text-[11.5px] font-medium transition-colors duration-150 ${i===0?'bg-accent-tint text-accent-ink':'bg-field text-ink-2 hover:bg-hover'}">${t}</button>`).join("")}</div>`,
  };

  const VARIANT_PINS_HTML = {
    Pinned: `
      <div class="overflow-hidden rounded-card bg-surface shadow-card bui-ext-pin-pop"><div class="primitive-card-pad"><div class="flex items-center gap-2"><span class="text-[12.5px] font-semibold text-ink">Weekend churn window</span><span class="rounded-full bg-accent-tint px-2 py-0.5 text-[10px] font-medium text-accent-ink">Pinned</span></div><p class="mt-1 text-[12px] text-ink-2">Churn pistachio before Saturday 10am.</p></div></div>
      <div class="overflow-hidden rounded-card bg-surface shadow-card bui-ext-pin-pop" style="animation-delay:60ms"><div class="primitive-card-pad"><div class="flex items-center gap-2"><span class="text-[12.5px] font-semibold text-ink">Cone lead time</span><span class="rounded-full bg-accent-tint px-2 py-0.5 text-[10px] font-medium text-accent-ink">Pinned</span></div><p class="mt-1 text-[12px] text-ink-2">cone_king · 7 day lead</p></div></div>`,
    Suggested: `
      <div class="overflow-hidden rounded-card border border-dashed border-accent/30 bg-surface shadow-card bui-ext-pin-pop"><div class="primitive-card-pad"><div class="flex items-center gap-2"><span class="text-[12.5px] font-semibold text-ink">Peak hour shift</span><span class="rounded-full bg-field px-2 py-0.5 text-[10px] font-medium text-accent-ink">Suggested</span></div><p class="mt-1 text-[12px] text-ink-2">Weekend demand peaks after 3pm — pin this?</p><button type="button" class="mt-2 rounded-full bg-accent px-3 py-1 text-[11.5px] font-medium text-white">Pin fact</button></div></div>`,
    Expired: `
      <div class="overflow-hidden rounded-card bg-inset shadow-hairline opacity-80"><div class="primitive-card-pad"><div class="flex items-center gap-2"><span class="text-[12.5px] font-semibold text-ink-3">Summer pop-up hours</span><span class="rounded-full bg-field px-2 py-0.5 text-[10px] text-ink-3">Expired</span></div><p class="mt-1 text-[12px] text-ink-3">Valid through Aug 1 — archived automatically.</p></div></div>`,
  };

  function setupDelegation() {
    if (document.documentElement.dataset.buiExtDelegation) return;
    document.documentElement.dataset.buiExtDelegation = "true";

    document.addEventListener("click", (e) => {
      const variantBtn = e.target.closest(".bui-ext-variants button[data-variant]");
      if (variantBtn) {
        e.preventDefault();
        e.stopPropagation();
        const section = variantBtn.closest(".bui-ext-section");
        const bar = variantBtn.closest(".bui-ext-variants");
        if (!section || !bar) return;
        setActiveVariantButton(bar, variantBtn);
        variantBtn.classList.remove("meridian-variant-flash");
        void variantBtn.offsetWidth;
        variantBtn.classList.add("meridian-variant-flash");
        applyVariant(section.dataset.extId, variantBtn.dataset.variant, section);
        return;
      }

      const retryBtn = e.target.closest("[data-retry-btn]");
      if (retryBtn && !retryBtn.disabled) {
        e.preventDefault();
        const spin = retryBtn.querySelector("[data-retry-spin]");
        const label = retryBtn.querySelector("[data-retry-label]");
        const demo = retryBtn.closest("[data-demo]");
        const meta = demo?.querySelector("[data-retry-meta]");
        if (spin) spin.classList.remove("hidden");
        if (label) label.textContent = "Retrying…";
        retryBtn.disabled = true;
        setTimeout(() => {
          if (spin) spin.classList.add("hidden");
          if (label) label.textContent = "Retry export";
          retryBtn.disabled = false;
          if (meta) meta.textContent = "Attempt 2 of 3";
          const stateLabel = demo?.querySelector("[data-state-label]");
          if (stateLabel) stateLabel.textContent = "Export recovered";
        }, 1400);
        return;
      }

      const dismissToast = e.target.closest("[data-dismiss-toast]");
      if (dismissToast) {
        const toast = dismissToast.closest("[data-toast]");
        if (toast) {
          toast.style.transition = "opacity 200ms ease, transform 200ms ease";
          toast.style.opacity = "0";
          toast.style.transform = "translateY(-8px)";
          setTimeout(() => toast.remove(), 200);
        }
        return;
      }

      const removeChip = e.target.closest("[data-remove-chip]");
      if (removeChip) {
        const chip = removeChip.closest("[data-attachment-chip]");
        if (chip) {
          chip.style.transition = "opacity 150ms ease, transform 150ms ease";
          chip.style.opacity = "0";
          chip.style.transform = "scale(0.94)";
          setTimeout(() => chip.remove(), 150);
        }
        return;
      }

      const ratingBtn = e.target.closest("[data-rating]");
      if (ratingBtn) {
        const demo = ratingBtn.closest("[data-demo]");
        const row = ratingBtn.closest("[data-rating-row]");
        const panel = demo?.querySelector("[data-correction-panel]");
        const hint = demo?.querySelector("[data-rating-hint]");
        row?.querySelectorAll("[data-rating]").forEach((b) => {
          b.classList.remove("bg-accent-tint", "text-accent-ink");
          b.classList.add("bg-field", "text-ink-2");
        });
        ratingBtn.classList.remove("bg-field", "text-ink-2");
        ratingBtn.classList.add("bg-accent-tint", "text-accent-ink");
        if (hint) hint.textContent = ratingBtn.dataset.rating === "up" ? "Thanks for the feedback" : "We'll improve this";
        if (panel && ratingBtn.dataset.rating === "down") {
          panel.style.gridTemplateRows = "1fr";
          panel.style.opacity = "1";
        }
        return;
      }

      const traceToggle = e.target.closest("[data-trace-toggle]");
      if (traceToggle) {
        const expanded = traceToggle.getAttribute("aria-expanded") === "true";
        traceToggle.setAttribute("aria-expanded", String(!expanded));
        const body = traceToggle.closest("[data-demo]")?.querySelector("[data-trace-body]");
        const chevron = traceToggle.querySelector("[data-trace-chevron]");
        if (body) {
          body.style.gridTemplateRows = expanded ? "0fr" : "1fr";
          body.style.opacity = expanded ? "0" : "1";
        }
        if (chevron) chevron.style.transform = expanded ? "rotate(-90deg)" : "rotate(0)";
        return;
      }

      const pinToggle = e.target.closest("[data-pin-toggle]");
      if (pinToggle) {
        const pin = pinToggle.closest("[data-pin]");
        if (pin) {
          pin.style.transition = "opacity 200ms ease, transform 200ms ease";
          pin.style.opacity = "0";
          pin.style.transform = "scale(0.96)";
          setTimeout(() => pin.remove(), 200);
        }
        return;
      }

      const altToggle = e.target.closest("[data-alt-toggle]");
      if (altToggle) {
        const expanded = altToggle.getAttribute("aria-expanded") === "true";
        altToggle.setAttribute("aria-expanded", String(!expanded));
        const panel = altToggle.closest("[data-demo]")?.querySelector("[data-alt-panel]");
        if (panel) {
          panel.style.gridTemplateRows = expanded ? "0fr" : "1fr";
          panel.style.opacity = expanded ? "0" : "1";
        }
        return;
      }

      const modelBtn = e.target.closest("[data-model-option]");
      if (modelBtn) {
        const list = modelBtn.closest("[data-model-list]");
        list?.querySelectorAll("[data-model-option]").forEach((b) => {
          b.setAttribute("aria-pressed", "false");
          b.classList.remove("bg-field");
          b.classList.add("hover:bg-hover-2");
        });
        modelBtn.setAttribute("aria-pressed", "true");
        modelBtn.classList.add("bg-field");
        modelBtn.classList.remove("hover:bg-hover-2");
        const hint = modelBtn.closest("[data-demo]")?.querySelector("[data-model-hint]");
        const name = modelBtn.querySelector("p.font-medium")?.textContent || "model";
        if (hint) hint.innerHTML = `Routing <span class="font-medium text-ink">inventory query</span> to <span class="text-accent-ink">${name}</span>`;
      }
    });
  }

  window.__prismApplyVariant = applyVariant;

  function applyBranding() {
    document.title = BRAND.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", BRAND.description);

    if (document.querySelector(".stitch-logo-mark")) return;

    const h1 = document.querySelector("aside h1");
    if (h1 && !h1.dataset.meridian) {
      h1.dataset.meridian = "true";
      h1.innerHTML = `<span class="meridian-hero-accent">${BRAND.name}</span> — ${BRAND.tagline}`;
    }

    const navLabel = document.querySelector("nav[aria-label='Components'] > p");
    if (navLabel && !navLabel.dataset.meridian) {
      navLabel.dataset.meridian = "true";
      navLabel.textContent = "Primitives";
    }

    const logoImg = document.querySelector("aside img[alt]");
    if (logoImg && !logoImg.dataset.meridian) {
      logoImg.dataset.meridian = "true";
      logoImg.style.display = "none";
      const wrap = logoImg.parentElement;
      if (wrap && !wrap.querySelector(".meridian-logo")) {
        const brand = document.createElement("div");
        brand.className = "meridian-logo";
        brand.innerHTML = `
          <div class="meridian-logo-mark meridian-live-pulse">M</div>
          <div class="meridian-logo-word">${BRAND.name}<span>Interface kit</span></div>`;
        wrap.insertBefore(brand, logoImg);
      }
    }
  }

  function setupNavHover() {
    const nav = document.querySelector("nav[aria-label='Components']");
    if (!nav || nav.dataset.meridianHover) return;
    nav.dataset.meridianHover = "true";

    const ul = nav.querySelector("ul");
    if (!ul) return;

    const pill =
      ul.querySelector("span.pointer-events-none.absolute") ||
      (() => {
        const s = document.createElement("span");
        s.setAttribute("aria-hidden", "true");
        s.className =
          "pointer-events-none absolute inset-x-0 rounded-[7px] bg-hover";
        s.style.cssText =
          "top:0;height:0;opacity:0;transition:top 220ms cubic-bezier(0.23,1,0.32,1), height 220ms cubic-bezier(0.23,1,0.32,1), opacity 150ms ease";
        ul.prepend(s);
        return s;
      })();

    let activeId = null;

    function movePill(link) {
      if (!link) return;
      pill.style.top = `${link.offsetTop}px`;
      pill.style.height = `${link.offsetHeight}px`;
      pill.style.opacity = "1";
    }

    function hidePillToActive() {
      const active = ul.querySelector("a.meridian-nav-active");
      if (active) movePill(active);
      else pill.style.opacity = "0";
    }

    ul.addEventListener("mouseover", (e) => {
      const link = e.target.closest("a");
      if (link && ul.contains(link)) movePill(link);
    });

    ul.addEventListener("mouseleave", () => hidePillToActive());

    ul.querySelectorAll("a").forEach((link) => {
      link.addEventListener("focus", () => movePill(link));
    });

    window.__meridianSetActiveNav = (id) => {
      activeId = id;
      ul.querySelectorAll("a").forEach((a) => {
        const on = a.getAttribute("href") === `#${id}`;
        a.classList.toggle("meridian-nav-active", on);
        a.classList.toggle("font-medium", on);
        a.classList.toggle("text-ink", on);
        a.classList.toggle("text-ink-2", !on);
      });
      if (!ul.matches(":hover")) {
        const active = ul.querySelector(`a[href="#${id}"]`);
        if (active) movePill(active);
      }
    };
  }

  function setupScrollSpy() {
    if (window.__meridianScrollSpy) return;
    window.__meridianScrollSpy = true;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && window.__meridianSetActiveNav) {
            window.__meridianSetActiveNav(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    function observeAll() {
      document.querySelectorAll("section.primitive-showcase[id]").forEach((s) => observer.observe(s));
    }

    observeAll();
    setInterval(observeAll, 3000);
  }

  function wireNavScroll() {
    document.querySelectorAll("nav[aria-label='Components'] a[href^='#']").forEach((link) => {
      if (link.dataset.extNav) return;
      link.dataset.extNav = "true";
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href").slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          if (window.__meridianSetActiveNav) window.__meridianSetActiveNav(id);
        }
      });
    });
  }

  function ensureStylesheet() {
    if (document.querySelector("link[data-bui-ext-css]")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = BASE ? `${BASE}/custom-extensions.css?v=8` : "custom-extensions.css?v=8";
    link.setAttribute("data-bui-ext-css", "true");
    document.head.appendChild(link);
  }

  let navWired = false;

  function run() {
    removeMarketing();
    applyBranding();
    ensureStylesheet();
    setupDelegation();
    injectNav();
    injectSections();
    setupNavHover();
    setupScrollSpy();
    if (!navWired) {
      wireNavScroll();
      navWired = true;
    }
  }

  function scheduleRun() {
    setTimeout(run, 0);
  }

  // Setup delegation immediately so clicks work even before sections exist.
  setupDelegation();

  if (document.readyState === "complete") {
    scheduleRun();
  } else {
    window.addEventListener("load", scheduleRun, { once: true });
    document.addEventListener("DOMContentLoaded", scheduleRun, { once: true });
  }

  // Re-inject after React hydration (it can replace the showcase column).
  [800, 1600, 2800, 4500].forEach((ms) => setTimeout(run, ms));
})();
