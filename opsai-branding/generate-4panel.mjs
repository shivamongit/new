import { StitchToolClient } from "@google/stitch-sdk";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const PROJECT_ID = "5391439844235637781";
const client = new StitchToolClient({ apiKey: process.env.STITCH_API_KEY });

const prompt = `FLAT LOGO ASSET SHEET — 4 equal panels on one image. NO app UI, NO website, NO buttons, NO nav, NO text labels except the wordmark "OpsAI".

Panel 1 (top-left): Square app icon on plain dark #0A0E17 — rounded tile with GLYPH ONLY.
Panel 2 (top-right): Same glyph on plain white square tile.
Panel 3 (bottom-left): Horizontal LOGO lockup on plain dark bg — glyph + "OpsAI" wordmark (Ops white, AI blue #3B82F6 semibold).
Panel 4 (bottom-right): Same lockup on plain white bg (glyph navy, Ops navy, AI blue).

THE GLYPH (tool-specific, NOT generic AI):
Abstract letter "O" formed by a CI/CD pipeline ring — 4 connected stage nodes around a circle path (like Azure DevOps pipeline stages). One node has × failure marker. Inside the O, one horizontal LOG LINE bar highlighted in blue = cited log source. A thin diagnostic connector links failed node to log bar. Reads: failed build step → cited log line → root cause.

Flat vector, 2px strokes, Datadog/Vercel polish. NO sparkles, NO neural webs, NO stars, NO chat bubbles, NO gears alone. Single accent blue only.

Tiny 16px icon in bottom margin for scale test.`;

const result = await client.callTool("generate_screen_from_text", {
  projectId: PROJECT_ID,
  prompt,
  deviceType: "DESKTOP",
  modelId: "GEMINI_3_1_PRO",
});

const screen = result.outputComponents.find((c) => c.design?.screens)?.design.screens[0];
const res = await fetch(screen.screenshot.downloadUrl);
await pipeline(Readable.fromWeb(res.body), createWriteStream("output/opsai-logo-icon-only.png"));
console.log("Done", screen.title, screen.id);
await client.close();
