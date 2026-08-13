/**
 * OpsAI logo + app icon via Google Stitch (GEMINI_3_1_PRO).
 */
import { StitchToolClient } from "@google/stitch-sdk";
import { writeFile, mkdir } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const OUT_DIR = new URL("./output", import.meta.url).pathname;

const PROMPT = `Design a high-quality app icon and logo for "OpsAI" — an AI assistant for DevOps and build engineers.

What the app does (for context, so the mark is relatable): OpsAI is like "ChatGPT for the Ops team." Engineers paste an Azure DevOps build URL or describe a failure, and OpsAI diagnoses the root cause by grounding every answer in real CI/CD build logs and thousands of historical incidents, then cites its sources. It's a premium, intelligent, trustworthy internal engineering tool.

Concept: Fuse an operations/build signal with an AI intelligence signal into one clean, memorable mark. Explore these directions:
1. An abstract "O" or "Ops" monogram that doubles as a diagnostic/pulse motif — a signal waveform, a heartbeat/telemetry line, or a build-pipeline node graph flowing through the letterform.
2. A spark / neural node (representing AI reasoning) sitting at the center of a connected pipeline or gear/circuit path (representing Ops), suggesting "AI that understands the build."
3. A subtle nod to diagnosis / root-cause — a magnifier, focus reticle, or converging lines resolving to a single point — integrated into a geometric glyph, not literal or clip-arty.

Style:
• Modern, minimal, geometric, enterprise-grade — think Vercel / Linear / Anthropic-level polish.
• Flat with restrained depth; crisp vector shapes, balanced negative space, strong silhouette that stays legible at 16px favicon size.
• Confident and technical, not playful or cartoonish. It should feel intelligent and dependable.

Color: Deep charcoal / near-black or midnight-navy base, with a single vivid accent gradient (electric blue → violet/teal) for the AI/signal element. Must work on both light and dark backgrounds and in a single-color (monochrome) version.

Deliverables ON ONE LOGO PRESENTATION BOARD (organized grid, premium design-system layout):
• A standalone app icon (square, rounded-corner tile) — the glyph alone.
• A horizontal logo lockup: the glyph + wordmark "OpsAI" in a clean geometric sans-serif (Ops in one weight, AI accented/bolder).
• Show the icon at LARGE size and at SMALL 16px favicon scale side by side to prove legibility.
• Provide LIGHT-background and DARK-background variants of both icon and lockup.
• Include one monochrome (single-color white on dark) variant.

Avoid: generic robot heads, generic chat bubbles, literal gears-only clichés, stock "AI brain" imagery, gradients that muddy at small sizes, and anything that loses meaning in monochrome.

Background of presentation: subtle midnight-navy #0A0E17 with labeled sections. High-fidelity vector aesthetic. No lorem ipsum, no font name labels.`;

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

function extractScreen(result) {
  for (const comp of result.outputComponents ?? []) {
    const screens = comp.design?.screens;
    if (screens?.length) return screens[0];
  }
  return null;
}

async function main() {
  if (!process.env.STITCH_API_KEY) throw new Error("STITCH_API_KEY required");

  await mkdir(OUT_DIR, { recursive: true });
  const client = new StitchToolClient({ apiKey: process.env.STITCH_API_KEY });

  let projectId = process.env.STITCH_PROJECT_ID;
  if (!projectId) {
    const created = await client.callTool("create_project", { title: "OpsAI Logo" });
    projectId = created.project?.projectId ?? created.name?.replace("projects/", "");
    console.log(`Created project: ${projectId}`);
  }

  console.log("Generating OpsAI logo board (GEMINI_3_1_PRO)...");
  const start = Date.now();

  const result = await client.callTool("generate_screen_from_text", {
    projectId,
    prompt: PROMPT,
    deviceType: "DESKTOP",
    modelId: "GEMINI_3_1_PRO",
  });

  const screen = extractScreen(result);
  if (!screen?.screenshot?.downloadUrl) throw new Error("No screenshot in response");

  const imagePath = `${OUT_DIR}/opsai-logo-board.png`;
  await download(screen.screenshot.downloadUrl, imagePath);

  const meta = {
    product: "OpsAI — AI assistant for DevOps and build engineers",
    model: "GEMINI_3_1_PRO",
    projectId,
    stitchUrl: `https://stitch.withgoogle.com/projects/${projectId}`,
    screenId: screen.id,
    title: screen.title,
    imagePath: "output/opsai-logo-board.png",
    durationMs: Date.now() - start,
    rationale: result.outputComponents?.find((c) => c.text)?.text ?? "",
  };

  await writeFile(`${OUT_DIR}/opsai-logo-board.json`, JSON.stringify(meta, null, 2));
  await client.close();

  console.log(`Done in ${meta.durationMs}ms → ${imagePath}`);
  console.log(`Stitch: ${meta.stitchUrl}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
