# Stitch UI — Component Showcase

Glass-dark primitive library deployed at [https://shivamongit.github.io/new/](https://shivamongit.github.io/new/).

Uses the NovaDock **Stitch** design language (aurora background, cyan glow, Space Grotesk / Geist) with 27 interactive component showcases.

## Files

- `index.html` — Stitch shell + hydrated showcases (built by `stitch/build-index.mjs`)
- `stitch/` — Theme, aurora shader, layout scripts
- `legacy-mirror.html` — Previous flat layout mirror (reference)
- `custom-extensions.js` — Primitives 20–27 with variant toggles

Rebuild after editing legacy showcase HTML:

```bash
node stitch/build-index.mjs
```

Deployed to GitHub Pages via `.github/workflows/deploy-beautiful-ui.yml`.
