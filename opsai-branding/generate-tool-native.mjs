/**
 * OpsAI — standalone logo + icon only (no UI). Tool-specific metaphors.
 */
import { StitchToolClient } from "@google/stitch-sdk";
import { writeFile, mkdir } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const OUT_DIR = new URL("./output", import.meta.url).pathname;
const PROJECT_ID = "5391439844235637781";

const PROMPT = `Create ONLY a logo asset sheet — NO user interface, NO website, NO dashboard, NO navigation bars, NO sidebars, NO buttons, NO "brand guidelines" page, NO mockup frames, NO labels like "Production Dark" or "Download Kit". Plain backgrounds only.

PRODUCT (design the mark from THIS — not generic ChatGPT AI):
OpsAI is an internal engineering tool. Engineers paste an Azure DevOps BUILD URL or describe a CI/CD failure. OpsAI reads real build logs, matches against thousands of historical incidents, cites exact log lines as sources, and returns the ROOT CAUSE. It is grounded diagnosis — not a chatbot.

GLYPH CONCEPT — pick ONE cohesive mark (NOT a neural-network spider web, NOT a central star/spark, NOT a robot, NOT a chat bubble):

Design an abstract "O" monogram built from a HORIZONTAL BUILD PIPELINE:
• 4 small square stage nodes connected by a line (left → right) = CI/CD pipeline stages (restore, build, test, publish).
• The FAILED stage (3rd node) is marked with a small × or break in the connector — the failed build step OpsAI diagnoses.
• From that failed node, ONE clean diagnostic trace line curves back/down to a highlighted LOG LINE (2 short horizontal bars, one accent bar = the cited log line in the answer).
• This reads as: "paste build URL → find failed step → cite the log line → root cause."

Alternative integration: the "O" letterform IS the pipeline ring — broken segment at failure point, log citation bar inside the ring.

STYLE:
• Vercel / Linear / Datadog engineering tool — flat vector, 1–2px strokes, geometric.
• Midnight navy #0A0E17 and white backgrounds ONLY (two plain panels side by side).
• Single accent: electric blue #3B82F6 for failed-step highlight and cited log line — NO purple-teal GPT gradient, NO rainbow, NO glowing sparkles.
• Strong silhouette at 16px — max 4 pipeline nodes, no tiny inner web.

DELIVERABLES ON ONE FLAT CANVAS (4 cells, plain bg, no UI chrome):
1) Square app icon 512px feel — glyph only, dark bg, rounded square tile
2) Same icon — light bg tile
3) Horizontal lockup — glyph + wordmark "OpsAI" (Ops regular, AI semibold in accent blue) — dark plain bg
4) Horizontal lockup — light plain bg

Bottom corner ONLY: tiny 16px icon proving legibility.

Absolutely zero application UI. Zero marketing website. Logo and icon assets only.`;

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
  await mkdir(OUT_DIR, { recursive: true });
  const client = new StitchToolClient({ apiKey: process.env.STITCH_API_KEY });

  console.log("Generating OpsAI tool-native logo (GEMINI_3_1_PRO)...");
  const start = Date.now();

  const result = await client.callTool("generate_screen_from_text", {
    projectId: PROJECT_ID,
    prompt: PROMPT,
    deviceType: "DESKTOP",
    modelId: "GEMINI_3_1_PRO",
  });

  const screen = extractScreen(result);
  if (!screen?.screenshot?.downloadUrl) throw new Error("No screenshot");

  const imagePath = `${OUT_DIR}/opsai-logo-icon-only.png`;
  await download(screen.screenshot.downloadUrl, imagePath);

  const meta = {
    id: "opsai-tool-native",
    model: "GEMINI_3_1_PRO",
    projectId: PROJECT_ID,
    stitchUrl: `https://stitch.withgoogle.com/projects/${PROJECT_ID}`,
    screenId: screen.id,
    title: screen.title,
    imagePath: "output/opsai-logo-icon-only.png",
    durationMs: Date.now() - start,
    rationale: result.outputComponents?.find((c) => c.text)?.text ?? "",
  };

  await writeFile(`${OUT_DIR}/opsai-logo-icon-only.json`, JSON.stringify(meta, null, 2));
  await client.close();
  console.log(`Done → ${imagePath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
