/**
 * OpsAI — Azure DevOps-native logo (NO rings). GEMINI_3_1_PRO
 */
import { StitchToolClient } from "@google/stitch-sdk";
import { createWriteStream, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const OUT_DIR = new URL("./output", import.meta.url).pathname;
const PROJECT_ID = "5391439844235637781";

const PROMPT = `FLAT LOGO ASSET SHEET — 4 panels, plain backgrounds. NO website UI, NO dashboards, NO nav bars, NO buttons.

CRITICAL CONSTRAINTS:
• NO circles, NO rings, NO letter "O", NO circular monograms, NO radial node webs, NO orb shapes.
• Do NOT copy the official Microsoft or Azure logo — abstract Azure DevOps ENGINEERING language only.

PRODUCT — OpsAI on Azure DevOps:
Engineers paste an Azure DevOps PIPELINE BUILD URL. OpsAI pulls CI/CD logs, matches historical incidents, cites exact log lines, returns root cause. This is Azure Pipelines / ADO build diagnosis — not generic chat AI.

GLYPH CONCEPT — horizontal Azure DevOps pipeline (the UI engineers actually see):

Design a compact HORIZONTAL mark like the Azure Pipelines stage view:
• 4 small rounded rectangles in a ROW (pipeline stages: restore, build, test, deploy) connected by short horizontal lines/chevrons.
• Stage 3 (build) shows FAILED state: small × or orange-red accent bar on that box — like ADO failed task.
• Below or attached: 2–3 thin horizontal LOG LINES; one line highlighted in Azure blue #0078D4 with a small citation bracket or pin — the cited log line OpsAI returns.
• Optional subtle hint: very abstract soft cloud curve ABOVE the pipeline (single flat arc, NOT the Microsoft Azure logo shape) suggesting Azure cloud host — minimal, one stroke.

Reads instantly to ADO users: "failed pipeline stage → cited build log → diagnosis."

STYLE:
• Microsoft/Azure enterprise internal tool — professional, restrained, Fluent-design adjacent (clean geometry, no decoration).
• Colors: charcoal #1B1B1F dark bg, white light bg, Azure blue #0078D4 accent, failure hint #E74856 (ADO failed red) ONLY on failed stage — no purple gradients, no teal, no GPT sparkles.
• Flat vector, 2px strokes, favicon-safe at 16px (max 4 boxes in row).

4 PANELS:
1) Square app icon tile dark — glyph only
2) Square app icon tile light — glyph only  
3) Horizontal lockup dark: glyph + "OpsAI" (Ops regular white, AI semibold #0078D4)
4) Horizontal lockup light: glyph navy + same wordmark

Tiny 16px icon bottom margin. Logo assets only.`;

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

function extractScreen(result) {
  for (const comp of result.outputComponents ?? []) {
    if (comp.design?.screens?.length) return comp.design.screens[0];
  }
  return null;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const client = new StitchToolClient({ apiKey: process.env.STITCH_API_KEY });

  console.log("Generating Azure-native OpsAI logo (GEMINI_3_1_PRO)...");
  const start = Date.now();

  const result = await client.callTool("generate_screen_from_text", {
    projectId: PROJECT_ID,
    prompt: PROMPT,
    deviceType: "DESKTOP",
    modelId: "GEMINI_3_1_PRO",
  });

  const screen = extractScreen(result);
  if (!screen?.screenshot?.downloadUrl) throw new Error("No screenshot");

  const imagePath = `${OUT_DIR}/opsai-logo-azure-pipeline.png`;
  await download(screen.screenshot.downloadUrl, imagePath);

  writeFileSync(
    `${OUT_DIR}/opsai-logo-azure-pipeline.json`,
    JSON.stringify({
      screenId: screen.id,
      title: screen.title,
      projectId: PROJECT_ID,
      stitchUrl: `https://stitch.withgoogle.com/projects/${PROJECT_ID}`,
      durationMs: Date.now() - start,
      rationale: result.outputComponents?.find((c) => c.text)?.text ?? "",
    }, null, 2)
  );

  await client.close();
  console.log(`Done → ${imagePath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
