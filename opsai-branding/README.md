# OpsAI — Logo & App Icon (Stitch)

Tool-native logo — **no UI mockups**, grounded in CI/CD pipeline diagnosis (not generic AI spark).

**Primary deliverable:** `output/opsai-logo-icon-only.png`

Four plain panels:
1. App icon — dark tile
2. App icon — light tile  
3. Horizontal lockup `OpsAI` — dark
4. Horizontal lockup — light  
+ 16px favicon proof

**Glyph:** Letter **O** as pipeline ring — 4 stage nodes, **×** on failed step, cited **log line** inside = paste build URL → find failure → cite log → root cause.

**Stitch:** https://stitch.withgoogle.com/projects/5391439844235637781 · Model: `GEMINI_3_1_PRO`

```bash
export STITCH_API_KEY=your_key
cd opsai-branding
node generate-tool-native.mjs   # single icon pass
node generate-4panel.mjs        # full 4-panel sheet (recommended)
```

Legacy board with UI chrome: `output/opsai-logo-board.png`
