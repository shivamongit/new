/**
 * Spectra AI — single definitive logo via Stitch (GEMINI_3_1_PRO).
 */
import { StitchToolClient } from "@google/stitch-sdk";
import { writeFile, mkdir } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const OUT_DIR = new URL("./output", import.meta.url).pathname;
const PROJECT_ID = process.env.STITCH_PROJECT_ID || "17912602839836262882";

const PROMPT = `Design ONE premium app logo lockup for "Spectra AI" — an enterprise Requirement Quality Engine that audits Excel/PDF/Word specs, scores each requirement 0–100 against a 21-rule ontology across 8 quality pillars, and produces A+–F grades with rule-compliant rewrites.

VISUAL CONCEPT (unified, not cluttered):
Create a single iconic mark that fuses three ideas into one cohesive symbol:
1) SPECTRA — a refined glass prism refracting one clean white input ray into a tight fan of 5–6 spectral bands (cyan → violet → amber), NOT a childish rainbow; bands are parallel, precise, engineered.
2) REQUIREMENTS — a minimal document sheet silhouette integrated INTO the left edge of the prism (folded corner + 2–3 horizontal requirement lines), so the beam appears to scan the document.
3) AUDIT PASS — the spectral bands terminate into a subtle integrated checkmark notch or verified tick at the bottom-right, implying deterministic rule compliance.

LOCKUP:
- Icon left, wordmark right on one horizontal line (or icon centered above wordmark if cleaner).
- Wordmark: "Spectra" in premium geometric sans (Inter/Geist style), weight 600, white #F4F7FA.
- "AI" as a small rounded pill badge or separated word in electric cyan #00D4FF with very subtle glow — technical, not flashy.

STYLE — MODERN ADVANCED:
- Dark void background #06080C with soft radial vignette (no gradients on background except subtle depth).
- Flat vector + ONE restrained glass refraction highlight on prism (no cheesy 3D).
- Micro grid or faint scan-line texture at 3% opacity for "analysis engine" feel — optional, very subtle.
- Apple/Vercel/Linear tier polish: crisp 1px edges, perfect optical balance, generous negative space.
- NO: robot brains, chat bubbles, Excel green, generic sparkles, clipart, mockup laptops, UI dashboards, paragraphs of text, font name labels, lorem ipsum.

OUTPUT:
Single centered logo presentation, 1024×1024 feel, favicon-safe silhouette, enterprise ZF automotive engineering credibility. This is the definitive brand mark.`;

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

  console.log("Generating Spectra AI definitive logo (GEMINI_3_1_PRO)...");
  const start = Date.now();

  const result = await client.callTool("generate_screen_from_text", {
    projectId: PROJECT_ID,
    prompt: PROMPT,
    deviceType: "DESKTOP",
    modelId: "GEMINI_3_1_PRO",
  });

  const screen = extractScreen(result);
  if (!screen?.screenshot?.downloadUrl) throw new Error("No screenshot in response");

  const imagePath = `${OUT_DIR}/spectra-ai-logo-primary.png`;
  await download(screen.screenshot.downloadUrl, imagePath);

  const meta = {
    id: "spectra-ai-primary",
    name: "Spectra AI — Definitive Mark",
    model: "GEMINI_3_1_PRO",
    screenId: screen.id,
    title: screen.title,
    projectId: PROJECT_ID,
    stitchUrl: `https://stitch.withgoogle.com/projects/${PROJECT_ID}`,
    imagePath: "output/spectra-ai-logo-primary.png",
    durationMs: Date.now() - start,
    rationale: result.outputComponents?.find((c) => c.text)?.text ?? "",
  };

  await writeFile(`${OUT_DIR}/spectra-ai-logo-primary.json`, JSON.stringify(meta, null, 2));
  await client.close();

  console.log(`Done in ${meta.durationMs}ms → ${imagePath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
