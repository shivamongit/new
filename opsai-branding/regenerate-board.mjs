import { StitchToolClient } from "@google/stitch-sdk";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const PROJECT_ID = "5391439844235637781";
const client = new StitchToolClient({ apiKey: process.env.STITCH_API_KEY });

const prompt = `OpsAI logo IDENTITY SYSTEM presentation board — MUST show ALL panels in one wide canvas (not just one icon centered).

TOP ROW — App icons on rounded square tiles:
- Dark tile #0A0E17: circular OpsAI glyph (O monogram as pipeline node graph + central AI spark, blue→teal gradient)
- Light tile #F4F6FA: same glyph in dark navy monochrome
- Label each tile

MIDDLE ROW — Horizontal lockups:
- Dark bg: glyph + "Ops" regular weight + "AI" bold accent gradient wordmark
- Light bg: same lockup navy monochrome
- Label each

BOTTOM ROW — Legibility proof:
- Large glyph 128px next to 16px favicon size with "16px" label
- Monochrome white glyph on dark strip

Glyph concept: abstract O as diagnostic pulse / pipeline nodes converging to central spark (root-cause diagnosis). Vercel/Linear polish. NO robot, NO chat bubble.

Grid layout with clear section labels. Full board visible, not cropped to single icon.`;

const result = await client.callTool("generate_screen_from_text", {
  projectId: PROJECT_ID,
  prompt,
  deviceType: "DESKTOP",
  modelId: "GEMINI_3_1_PRO",
});

const screen = result.outputComponents.find((c) => c.design?.screens)?.design.screens[0];
const res = await fetch(screen.screenshot.downloadUrl);
await pipeline(Readable.fromWeb(res.body), createWriteStream("output/opsai-logo-board.png"));
console.log("Regenerated", screen.id, screen.title);
await client.close();
