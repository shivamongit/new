/**
 * Generate 5 Spectra AI logo concepts via Google Stitch API.
 */
import { StitchToolClient } from "@google/stitch-sdk";
import { writeFile, mkdir } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const OUT_DIR = new URL("./output", import.meta.url).pathname;
const PROJECT_ID = process.env.STITCH_PROJECT_ID || "17912602839836262882";

const CONCEPTS = [
  {
    id: "01-prism-pillars",
    name: "Prism Pillars",
    story:
      "Eight quality pillars scored as a spectrum — clarity through unambiguity.",
    prompt: `Professional app logo design presentation on a single screen. Dark charcoal background (#0f1419).

CENTER: A premium vector logo mark for "Spectra AI" — a geometric prism icon where a single white beam enters from the left and refracts into exactly 8 crisp spectral bands (violet to red), each band a distinct pillar of light. The bands converge into a sharp checkmark at the bottom — audit passed. Minimal, flat vector, no photorealism.

Below the mark: wordmark "Spectra" in clean geometric sans (semibold), "AI" in smaller caps with subtle cyan accent (#00b4d8).

Style: enterprise B2B SaaS, automotive engineering credibility, NOT playful startup. High contrast, scalable favicon-friendly silhouette. No mockup devices, no UI chrome — ONLY logo lockup centered with generous padding. 1024-quality vector aesthetic.`,
  },
  {
    id: "02-scan-pipeline",
    name: "Spectral Scan",
    story:
      "Five-stage pipeline — document ingested, beam extracts and scores each requirement.",
    prompt: `Logo design board, dark navy background (#0a1628).

CENTER: Logo mark combining a minimal document/page silhouette (3 lines of text) with a horizontal spectral scan beam passing through it. The beam is a smooth gradient (cyan #00d4ff → violet #7b61ff → amber #f59e0b). Where the beam hits each text line, a small node dot appears — representing extracted requirements FR-001, FR-002, etc.

Mark is compact, works at 32px. Beside or below: "Spectra AI" wordmark — "Spectra" white, "AI" cyan.

Enterprise requirements-engineering tool aesthetic. Flat vector, sharp edges, no 3D glass, no clutter. Single centered logo lockup only.`,
  },
  {
    id: "03-grade-ring",
    name: "Grade Ring",
    story:
      "0–100 score and A+–F grades — executive scorecard at a glance.",
    prompt: `Logo presentation, near-black background (#050508).

CENTER: Circular logo mark — a ring gauge like an executive scorecard dial. Ring shows subtle spectrum gradient. Inside the ring: bold "S" monogram formed by two spectral arcs. A small tick at the top marks "A+" position (95+). Ring completeness suggests overall document score.

Wordmark below: "Spectra AI" in modern grotesk, tight tracking, white with cyan dot accent on the "i" or between words.

Premium audit/analytics product feel (think executive dashboard, not gaming). Vector flat design, high legibility, no charts or dashboards in background — logo only.`,
  },
  {
    id: "04-atomic-clarity",
    name: "Atomic Clarity",
    story:
      "Atomicity pillar — one fuzzy requirement refined into one verifiable statement.",
    prompt: `Logo design canvas, dark slate background (#121820).

CENTER: Abstract logo mark showing transformation — left side: one blurred fuzzy text blob (vague requirement). Right side: one sharp single-line statement with a green verification check (#22c55e). Between them: a vertical spectral prism wedge (thin, elegant) that "clarifies" the shape — referencing Spectra name and rule-compliant rewrite.

Compact horizontal lockup: icon left, "Spectra AI" wordmark right, aligned center.

Tone: precision engineering, ISO 29148 / IREB quality standards. Minimal vector, no literal Excel icons. Enterprise software brand.`,
  },
  {
    id: "05-ontology-constellation",
    name: "Rule Constellation",
    story:
      "21-rule ontology — interconnected rules across 8 pillars, single source of truth.",
    prompt: `Logo presentation screen, deep blue-black background (#080c14).

CENTER: Logo mark as a constellation/network — 21 tiny nodes arranged in a balanced hexagonal pattern, connected by thin spectral lines (cyan to purple gradient). Central node slightly larger with subtle "S" cutout or spectral core glow. Evokes rule ontology graph, duplicate detection, corpus-level analysis — many requirements, one deterministic engine.

Below: "Spectra AI" wordmark, "Spectra" white bold, "AI" in cyan pill badge.

Sophisticated, data-engine aesthetic without looking like a generic AI brain. Flat vector, crisp 1px lines, favicon-safe simplified form. No full UI, no paragraphs — centered logo lockup only.`,
  },
];

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
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

  const manifest = {
    product: "Spectra AI — Requirement Quality Engine",
    projectId: PROJECT_ID,
    stitchProjectUrl: `https://stitch.withgoogle.com/projects/${PROJECT_ID}`,
    generatedAt: new Date().toISOString(),
    concepts: [],
  };

  for (const concept of CONCEPTS) {
    console.log(`\nGenerating: ${concept.name} (${concept.id})...`);
    const start = Date.now();

    const result = await client.callTool("generate_screen_from_text", {
      projectId: PROJECT_ID,
      prompt: concept.prompt,
      deviceType: "DESKTOP",
      modelId: "GEMINI_3_1_PRO",
    });

    const screen = extractScreen(result);
    if (!screen?.screenshot?.downloadUrl) {
      throw new Error(`No screenshot for ${concept.id}`);
    }

    const imagePath = `${OUT_DIR}/${concept.id}.png`;
    await download(screen.screenshot.downloadUrl, imagePath);

    const rationale =
      result.outputComponents?.find((c) => c.text)?.text?.slice(0, 500) ?? "";

    const entry = {
      id: concept.id,
      name: concept.name,
      story: concept.story,
      screenId: screen.id,
      title: screen.title,
      imagePath: `output/${concept.id}.png`,
      durationMs: Date.now() - start,
      stitchRationale: rationale,
    };
    manifest.concepts.push(entry);

    await writeFile(`${OUT_DIR}/${concept.id}.json`, JSON.stringify(entry, null, 2));
    console.log(`  Done in ${entry.durationMs}ms → ${imagePath}`);
  }

  await client.close();
  await writeFile(`${OUT_DIR}/manifest.json`, JSON.stringify(manifest, null, 2));
  console.log("\nAll 5 concepts generated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
