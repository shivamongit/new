"use client";

import { useEffect, useState, type ComponentType } from "react";

const delays = [90, 180, 270, 0, 90, 180, 90, 180, 270];

export function LoadingStateDemo() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 0.1), 100);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex w-fit items-center gap-2.5">
      <span aria-hidden className="grid grid-cols-[repeat(3,4px)] gap-[1.5px]">
        {delays.map((d, i) => (
          <span
            key={i}
            className="size-[4px] rounded-[1px] bg-ink"
            style={{
              opacity: 0.15,
              animation: `pixel-on 650ms ease-in-out ${d}ms infinite`,
            }}
          />
        ))}
      </span>
      <span className="shimmer-text text-[13px] font-medium">Churning</span>
      <span className="font-mono text-[12px] text-ink-3 tabular-nums">{elapsed.toFixed(1)}s</span>
    </div>
  );
}

export function ThinkingStateDemo() {
  const [open, setOpen] = useState(false);
  const steps = [
    "Scanning flavor velocity exports",
    "Comparing mint chip weekend peaks",
    "Ranking suppliers by lead time",
  ];
  return (
    <div className="flex min-h-[176px] w-full max-w-[23.75rem] flex-col">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="-mx-1.5 flex w-fit items-center gap-2 rounded-control px-1.5 py-1 transition-colors duration-100 hover:bg-hover-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--ink-2)">
          <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
        </svg>
        <span className="shimmer-text text-[13px] font-medium whitespace-nowrap">Thinking</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--ink-3)"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        className="grid transition-[grid-template-rows,opacity] duration-400"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
          transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div className="overflow-hidden">
          <div className="relative mt-1 ml-[5px] pl-4">
            <span aria-hidden className="absolute left-[3px] top-0 h-full w-px bg-line" />
            <div className="flex flex-col gap-1 py-1">
              {steps.map((s) => (
                <p key={s} className="text-[12.5px] text-ink-2">{s}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StreamingTextDemo() {
  const text =
    "Mint chip is trending up 12% versus last summer, with stronger weekend scoops at Aurora Scoops and Kumo Creamery.";
  return (
    <div className="space-y-3 text-[13px] leading-relaxed text-ink">
      <p>{text}</p>
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-full bg-field px-2 py-0.5 text-[11.5px] text-ink-2">10 sources</span>
      </div>
      <div className="space-y-1">
        <p className="text-[11px] font-medium text-ink-3">Follow-ups</p>
        <button type="button" className="block text-left text-[12.5px] text-accent hover:underline">
          Which flavors sell best in winter
        </button>
        <button type="button" className="block text-left text-[12.5px] text-accent hover:underline">
          Compare gelato and soft serve margins
        </button>
      </div>
    </div>
  );
}

export function ApprovalCardDemo() {
  return (
    <div className="w-full max-w-[20rem] rounded-window bg-surface p-4 shadow-hairline">
      <p className="text-[13px] font-medium text-ink">How many flavors should we launch?</p>
      <div className="mt-3 flex flex-col gap-1.5">
        {["Three (core line)", "Five (full case)", "Just one hero"].map((opt) => (
          <button
            key={opt}
            type="button"
            className="rounded-control border border-line bg-inset px-3 py-2 text-left text-[12.5px] text-ink transition-colors hover:bg-hover"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ToolChipsDemo() {
  const chips = ["read_pos_export", "match_suppliers", "draft_email", "update_menu"];
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[12px] text-ink-3">4 tool calls, 2 messages</span>
      {chips.map((c) => (
        <span
          key={c}
          className="rounded-full bg-field px-2 py-0.5 font-mono text-[11px] text-ink-2"
        >
          {c}
        </span>
      ))}
    </div>
  );
}

export function TaskRowsDemo() {
  const tasks = [
    { label: "Verified vendor records", meta: "12 suppliers", status: "Completed", color: "green" },
    { label: "Build reorder task list", meta: "7 SKUs", status: "Running", color: "accent" },
    { label: "Draft supplier emails", meta: "2 messages", status: "Running", color: "accent" },
  ];
  return (
    <div className="w-full space-y-2">
      {tasks.map((t) => (
        <div key={t.label} className="flex items-center justify-between gap-2 rounded-control bg-surface px-3 py-2 shadow-hairline">
          <div>
            <p className="text-[12.5px] font-medium text-ink">{t.label}</p>
            <p className="text-[11.5px] text-ink-3">{t.meta}</p>
          </div>
          <span
            className={`text-[11px] font-medium ${
              t.color === "green" ? "text-green" : "text-accent"
            }`}
          >
            {t.status}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ChatComposerDemo() {
  const [tab, setTab] = useState("Flavors");
  return (
    <div className="w-full max-w-[22rem] rounded-window bg-surface shadow-hairline">
      <div className="flex border-b border-line px-2">
        {["Flavors", "Suppliers"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-[12px] font-medium ${tab === t ? "text-ink" : "text-ink-3"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-3 p-3">
        <div className="rounded-control bg-field px-3 py-2 text-[12px] text-ink-2">
          Compare mint chip to last summer
        </div>
        <div className="space-y-1">
          <p className="text-[11px] text-ink-3">Sales History · Flavor Data · for 4s</p>
          <p className="text-[12.5px] text-ink">
            Pulled 3 summers of mint chip sales for comparison.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-control border border-line px-3 py-2">
          <span className="text-[12px] text-ink-3">Ask about flavors…</span>
        </div>
      </div>
    </div>
  );
}

export function PromptBarDemo() {
  return (
    <div className="w-full max-w-[24rem] rounded-window border border-line bg-surface p-2 shadow-btn">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <span className="text-[12.5px] text-ink-3">@</span>
        <span className="text-[13px] text-ink">Forecast waffle cone demand for July</span>
      </div>
      <div className="flex items-center justify-between px-2 pb-1">
        <div className="flex gap-1">
          <span className="rounded-full bg-field px-2 py-0.5 text-[11px] text-ink-2">Vanilla 1</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-ink-3">
          <span>GPT-4.1</span>
          <span>·</span>
          <span>Dictate</span>
        </div>
      </div>
    </div>
  );
}

export function RecommendationCardDemo() {
  return (
    <div className="w-full max-w-[22rem] rounded-window bg-surface p-4 shadow-hairline">
      <p className="text-[13px] font-medium text-ink">Want me to place this restock order?</p>
      <p className="mt-2 text-[12.5px] text-ink-2">
        Reorder waffle cones from <code className="rounded bg-field px-1 font-mono text-[11px]">cone_king</code> with
        lead time <code className="rounded bg-field px-1 font-mono text-[11px]">7_days</code>.
      </p>
      <div className="mt-3 h-1.5 w-full rounded-full bg-field">
        <div className="h-full w-[82%] rounded-full bg-accent" />
      </div>
      <p className="mt-1 text-[11px] text-ink-3">High confidence</p>
      <div className="mt-3 flex gap-2">
        <button type="button" className="rounded-full bg-accent px-3 py-1 text-[12px] font-medium text-white">
          Accept
        </button>
        <button type="button" className="rounded-full bg-field px-3 py-1 text-[12px] text-ink-2">
          Alternatives
        </button>
      </div>
    </div>
  );
}

export function ContextCardsDemo() {
  const chunks = [
    {
      title: "Vendor onboarding rule",
      chars: "290 characters",
      body: "Cold-chain certification must be verified before a new dairy can be added to the reorder workflow.",
      source: "Dairy Onboarding SOP.pdf",
    },
    {
      title: "Seasonal demand row",
      chars: "1,250 characters",
      body: "Q4 velocity table: pistachio +18%, vanilla +6%, rocky road -11%; retire flavors below 40 scoops weekly.",
      source: "Sales Velocity Export.csv",
    },
  ];
  return (
    <div className="w-full space-y-2">
      <p className="text-[11px] text-ink-3">All chunks · 32</p>
      {chunks.map((c) => (
        <div key={c.title} className="rounded-window bg-surface p-3 shadow-hairline">
          <div className="flex justify-between text-[11px] text-ink-3">
            <span>{c.title}</span>
            <span>{c.chars}</span>
          </div>
          <p className="mt-1 text-[12.5px] text-ink-2">{c.body}</p>
          <p className="mt-2 text-[11px] text-accent">{c.source}</p>
        </div>
      ))}
    </div>
  );
}

export function DiffTableDemo() {
  const rows = [
    ["Rocky Road", "Classic", "aurora-scoops"],
    ["Bubblegum", "Retro", "kumo-creamery"],
    ["Mint Chip", "Classic", "maple-orbit"],
    ["Pistachio", "Seasonal", "maple-orbit"],
  ];
  return (
    <div className="w-full overflow-hidden rounded-window bg-surface shadow-hairline">
      <p className="border-b border-line px-3 py-2 text-[12px] font-medium text-ink">Proposed menu cleanup</p>
      <table className="w-full text-left text-[12px]">
        <thead>
          <tr className="border-b border-line text-ink-3">
            <th className="px-3 py-2">Flavor</th>
            <th className="px-3 py-2">Category</th>
            <th className="px-3 py-2">Supplier</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b border-line last:border-0">
              <td className="px-3 py-2 text-ink">{r[0]}</td>
              <td className="px-3 py-2 text-ink-2">{r[1]}</td>
              <td className="px-3 py-2 font-mono text-[11px] text-ink-3">{r[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RecordsTableDemo() {
  const rows = [
    { co: "Aurora Scoops — Reykjavík", tags: ["Gelato", "Seasonal"], ago: "9 days ago", strength: "Very strong" },
    { co: "Kumo Creamery — Tokyo", tags: ["B2C", "Cafe", "Vegan"], ago: "3 weeks ago", strength: "Very strong" },
    { co: "Maple Orbit — Montréal", tags: ["B2B", "Wholesale"], ago: "15 days ago", strength: "Weak" },
  ];
  return (
    <div className="w-full overflow-x-auto rounded-window bg-surface shadow-hairline">
      <table className="w-full min-w-[28rem] text-left text-[11.5px]">
        <thead>
          <tr className="border-b border-line text-ink-3">
            <th className="px-2 py-2">Company</th>
            <th className="px-2 py-2">Categories</th>
            <th className="px-2 py-2">Last interaction</th>
            <th className="px-2 py-2">Connection</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.co} className="border-b border-line last:border-0">
              <td className="px-2 py-2 text-ink">{r.co}</td>
              <td className="px-2 py-2">
                <div className="flex flex-wrap gap-1">
                  {r.tags.map((t) => (
                    <span key={t} className="rounded bg-field px-1.5 py-0.5 text-[10px] text-ink-2">{t}</span>
                  ))}
                </div>
              </td>
              <td className="px-2 py-2 text-ink-2">{r.ago}</td>
              <td className="px-2 py-2 text-ink-2">{r.strength}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function FilterTableDemo() {
  const [filter, setFilter] = useState("All");
  const tasks = [
    { name: "Restock mango sorbet", date: "Dec 03", status: "To do", advisor: "Mango Moon Gelato" },
    { name: "Churn black sesame", date: "Sep 22", status: "In Progress", advisor: "Kumo Creamery" },
    { name: "Order waffle cones", date: "Apr 14", status: "Completed", advisor: "Aurora Scoops" },
  ];
  const filtered =
    filter === "All" ? tasks : tasks.filter((t) => t.status === filter || filter === "To do" && t.status === "To do");
  const counts = { All: 5, "To do": 2, "In Progress": 2, Completed: 1 };
  return (
    <div className="w-full">
      <div className="mb-2 flex flex-wrap gap-1">
        {(["All", "To do", "In Progress", "Completed"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-2 py-0.5 text-[11px] ${
              filter === f ? "bg-surface text-ink shadow-btn" : "text-ink-3"
            }`}
          >
            {f}{counts[f] ? ` ${counts[f]}` : ""}
          </button>
        ))}
      </div>
      <div className="rounded-window bg-surface shadow-hairline">
        {filtered.map((t) => (
          <div key={t.name} className="flex justify-between border-b border-line px-3 py-2 text-[12px] last:border-0">
            <span className="text-ink">{t.name}</span>
            <span className="text-ink-3">{t.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SidebarNavDemo() {
  return (
    <div className="w-full max-w-[14rem] rounded-window bg-surface p-3 shadow-hairline">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-control bg-accent-tint text-[11px] font-bold text-accent">C</span>
        <div>
          <p className="text-[12px] font-medium text-ink">Creamery Ops</p>
          <p className="text-[10px] text-ink-3">Production Workspace</p>
        </div>
      </div>
      <nav className="space-y-1 text-[12px]">
        <p className="text-[10px] text-ink-3">Workspace</p>
        {["Home", "Agent tasks 4", "Inbox"].map((item) => (
          <div key={item} className="rounded-control px-2 py-1 text-ink-2 hover:bg-hover">{item}</div>
        ))}
        <p className="pt-2 text-[10px] text-ink-3">Objects</p>
        {["Suppliers", "Inventory"].map((item) => (
          <div key={item} className="rounded-control px-2 py-1 text-ink-2 hover:bg-hover">{item}</div>
        ))}
      </nav>
    </div>
  );
}

export function SearchListDemo() {
  const items = [
    "Forecast summer demand",
    "Find waffle cone suppliers",
    "Compare seasonal flavors",
    "Draft flavor launch plan",
    "Check cold-chain status",
  ];
  return (
    <div className="w-full max-w-[18rem] rounded-window bg-surface shadow-hairline">
      <div className="border-b border-line px-3 py-2 text-[12px] text-ink-3">Search commands…</div>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className="block w-full px-3 py-2 text-left text-[12.5px] text-ink hover:bg-hover"
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function InsightCardsDemo() {
  return (
    <div className="w-full max-w-[20rem] rounded-window bg-surface p-4 shadow-hairline">
      <p className="text-[11px] text-ink-3">Insights · 3</p>
      <p className="mt-2 text-[12.5px] text-ink">
        The worst performer in your Creamery is Rocky Road — down <span className="text-red">-6%</span> or{" "}
        <span className="text-red">-$2,453.44</span>.
      </p>
      <div className="mt-3 space-y-1">
        <div className="flex justify-between text-[11px]">
          <span className="text-ink-2">Mint Chip</span>
          <span className="text-red">-4.41%</span>
        </div>
        <div className="h-1 rounded-full bg-field">
          <div className="h-full w-[35%] rounded-full bg-red" />
        </div>
        <div className="flex justify-between text-[11px]">
          <span className="text-ink-2">Pistachio</span>
          <span className="text-green">+1.15%</span>
        </div>
        <div className="h-1 rounded-full bg-field">
          <div className="h-full w-[55%] rounded-full bg-green" />
        </div>
      </div>
      <button type="button" className="mt-3 text-[12px] text-accent hover:underline">
        Should I rebalance flavors?
      </button>
    </div>
  );
}

export function CodeBlockDemo() {
  const lines = [
    "export function churnFlavor(batch: Batch) {",
    "  const velocity = scoreVelocity(batch.flavor);",
    "  if (velocity < THRESHOLD) {",
    "    return scheduleChurn(batch, { priority: 'weekend' });",
    "  }",
    "  return keepInRotation(batch);",
    "}",
  ];
  return (
    <div className="w-full overflow-hidden rounded-window bg-inset shadow-hairline">
      <div className="flex items-center justify-between border-b border-line px-3 py-1.5 text-[11px] text-ink-3">
        <span className="font-mono">churn.ts · TypeScript</span>
        <button type="button" className="text-accent">Copy</button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[11.5px] leading-relaxed text-ink-2">
        {lines.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </pre>
    </div>
  );
}

export function FineTuneCardDemo() {
  return (
    <div className="w-full max-w-[16rem] rounded-window bg-surface p-3 shadow-hairline">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-medium text-ink">Flavor card</p>
        <span className="text-[11px] text-accent">Adjust</span>
      </div>
      <div className="mt-3 space-y-2">
        <p className="text-[10px] text-ink-3">Layout</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-control bg-field px-2 py-1 text-[11px] text-ink-2">W 320</div>
          <div className="rounded-control bg-field px-2 py-1 text-[11px] text-ink-2">H 180</div>
        </div>
        <div className="rounded-control bg-field px-2 py-1 text-[11px] text-ink-2">Radius 12px</div>
        <div className="rounded-control bg-field px-2 py-1 text-[11px] text-ink-2">Opacity 100%</div>
      </div>
    </div>
  );
}

export function SelectionActionsDemo() {
  return (
    <div className="w-full max-w-[22rem]">
      <p className="text-[12.5px] leading-relaxed text-ink">
        <mark className="rounded bg-accent-tint px-0.5 text-ink">
          Pistachio holds the top slot all weekend. Churn it first thing Saturday so the batch has time to firm up before
          the afternoon rush.
        </mark>
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {["Explain", "Improve", "Shorten", "Tone", "Grammar", "/ more"].map((a) => (
          <button
            key={a}
            type="button"
            className="rounded-full bg-field px-2 py-0.5 text-[11px] text-ink-2 hover:bg-hover"
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}

export const DEMO_MAP: Record<string, ComponentType> = {
  "loading-state": LoadingStateDemo,
  "thinking-state": ThinkingStateDemo,
  "streaming-text": StreamingTextDemo,
  "approval-card": ApprovalCardDemo,
  "tool-chips": ToolChipsDemo,
  "task-rows": TaskRowsDemo,
  "chat-composer": ChatComposerDemo,
  "prompt-bar": PromptBarDemo,
  "recommendation-card": RecommendationCardDemo,
  "context-cards": ContextCardsDemo,
  "diff-table": DiffTableDemo,
  "records-table": RecordsTableDemo,
  "filter-table": FilterTableDemo,
  "sidebar-nav": SidebarNavDemo,
  search: SearchListDemo,
  "insight-cards": InsightCardsDemo,
  "code-block": CodeBlockDemo,
  "fine-tune-card": FineTuneCardDemo,
  "selection-actions": SelectionActionsDemo,
};
