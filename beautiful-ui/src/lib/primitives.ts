export type Primitive = {
  id: string;
  title: string;
  caption: string;
  variants?: string[];
};

export const PRIMITIVES: Primitive[] = [
  {
    id: "loading-state",
    title: "Loading State",
    caption: "Pixel-grid loader with shimmer and elapsed time.",
    variants: ["Drive", "Dots", "Orbit"],
  },
  {
    id: "thinking-state",
    title: "Thinking",
    caption: "Expandable traces — steps, reasoning, search, coding.",
    variants: ["Steps", "Reasoning", "Search", "Coding"],
  },
  {
    id: "streaming-text",
    title: "Streaming Text",
    caption: "Streamed answer with inline sources, actions, and follow-ups.",
  },
  {
    id: "approval-card",
    title: "Approval Card",
    caption: "Human-in-the-loop questions the agent asks before acting.",
  },
  {
    id: "tool-chips",
    title: "Tool Chips",
    caption: "Code edits and tool calls as compact chips.",
  },
  {
    id: "task-rows",
    title: "Task Rows",
    caption: "Live agent task status — running, failed, completed.",
    variants: ["Capsules", "List"],
  },
  {
    id: "chat-composer",
    title: "Chat",
    caption: "Tabbed chat panel with reasoning replies and a composer.",
  },
  {
    id: "prompt-bar",
    title: "Prompt Bar",
    caption: "Composer with @ sources, / commands, model picker, and dictation.",
    variants: ["Rounded", "Pill"],
  },
  {
    id: "recommendation-card",
    title: "Recommendation Card",
    caption: "Agent suggestion with a confidence meter and actions.",
  },
  {
    id: "context-cards",
    title: "Context Cards",
    caption: "Retrieved knowledge chunks with their sources.",
  },
  {
    id: "diff-table",
    title: "Diff Table",
    caption: "AI-proposed edits sweeping through tabular data.",
  },
  {
    id: "records-table",
    title: "Records Table",
    caption: "CRM-style grid with tags, sorting, and relationship status.",
  },
  {
    id: "filter-table",
    title: "Filter Table",
    caption: "Status chips that reorganize live data.",
  },
  {
    id: "sidebar-nav",
    title: "Sidebar Nav",
    caption: "Workspace navigation with quick search.",
  },
  {
    id: "search",
    title: "Search",
    caption: "Command search with live filtering and an empty state.",
  },
  {
    id: "insight-cards",
    title: "Insight Cards",
    caption: "Paged agent insights with scrub-ready live charts.",
  },
  {
    id: "code-block",
    title: "Code Block",
    caption: "Agent-written code streaming in line by line.",
  },
  {
    id: "fine-tune-card",
    title: "Fine-tune Card",
    caption: "The agent adjusts design properties in an inspector.",
  },
  {
    id: "selection-actions",
    title: "Selection Actions",
    caption: "Highlight a passage and hand it to the agent to rewrite.",
  },
];
