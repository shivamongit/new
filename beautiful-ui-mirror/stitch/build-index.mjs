/**
 * Assembles index.html from Stitch shell + legacy mirror content.
 * Run: node stitch/build-index.mjs
 */
import fs from "fs";
import path from "path";

const root = path.dirname(new URL(import.meta.url).pathname);
const mirror = path.join(root, "..");

const legacyMain = fs.readFileSync(path.join(root, "legacy-main.html"), "utf8");
const legacyScripts = fs.readFileSync(path.join(root, "legacy-scripts.html"), "utf8");

const head = `<!DOCTYPE html>
<html lang="en" class="dark stitch-html">
<head>
  <base href="/new/">
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Prism Kit — Intelligent interface primitives</title>
  <meta name="description" content="A curated library of polished, copy-paste components for agents, approvals, streaming states, and everything AI products need to feel premium."/>
  <link rel="icon" href="icon.png" type="image/png"/>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Geist:wght@400;500;600&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="stitch/prism.css?v=2"/>
  <link rel="stylesheet" href="_next/static/css/05982ab9f2554636.css"/>
  <link rel="stylesheet" href="custom-extensions.css?v=7"/>
  <link rel="preload" href="_next/static/media/bb3ef058b751a6ad-s.p.woff2" as="font" crossorigin="" type="font/woff2"/>
  <link rel="preload" href="_next/static/media/e4af272ccee01ff0-s.p.woff2" as="font" crossorigin="" type="font/woff2"/>
  <link rel="preload" as="script" fetchPriority="low" href="_next/static/chunks/webpack-dca0094f8340a94a.js"/>
  <script src="_next/static/chunks/4bd1b696-c023c6e3521b1417.js" async=""></script>
  <script src="_next/static/chunks/255-3981a3d1f3561bd8.js" async=""></script>
  <script src="_next/static/chunks/main-app-f9b5d20365cb8be2.js" async=""></script>
  <script>(function(){try{document.documentElement.classList.add("dark")}catch(e){}})()</script>
</head>
<body class="stitch-app __variable_f367f3 __variable_3c557b font-sans">
  <div id="stitch-aurora" aria-hidden="true"></div>
  <div class="stitch-frame">
    <header class="stitch-topbar">
      <div class="stitch-topbar-search">
        <span class="material-symbols-outlined">search</span>
        <input id="stitch-search" type="search" placeholder="Filter primitives…" aria-label="Filter primitives"/>
      </div>
      <div class="stitch-topbar-actions">
        <span class="stitch-badge"><span class="stitch-badge-dot"></span>27 primitives</span>
        <span class="material-symbols-outlined" title="Components">widgets</span>
      </div>
    </header>
    <div class="stitch-body">
      <div id="stitch-legacy-main" class="stitch-content">
  ${legacyMain}
      </div>
    </div>
  </div>
`;

const foot = `
  <script src="stitch/aurora.js?v=2"></script>
  <script src="stitch/prism.js?v=2"></script>
  ${legacyScripts}
  <script src="custom-extensions.js?v=7"></script>
</body>
</html>
`;

const out = head + foot;
fs.writeFileSync(path.join(mirror, "index.html"), out);
console.log("Wrote index.html (" + out.length + " bytes)");
