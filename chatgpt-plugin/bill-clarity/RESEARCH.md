# Problem research & plugin selection

## Ranked real-world problems (ChatGPT-plugin fit)

| Rank | Problem | Scale (US) | Why ChatGPT + tools |
|------|---------|------------|---------------------|
| **1** | **Medical bill / EOB confusion & surprise bills** | ~56–79% surprised by bill price; ~32% don’t understand last bill; ~47% avoided care after high bill ([Tebra 2026](https://www.tebra.com/theintake/healthcare-reports/medical-price-transparency-survey), [RevSpring 2026](https://www.prnewswire.com/news-releases/94-of-consumers-say-healthcare-needs-to-be-easier-revspring-study-exposes-cost-coverage-and-payment-confusion-302762620.html)) | Users paste bills; need structured rights paths, letters, checklists—not diagnosis |
| 2 | Insurance claim denials / prior auth | 39% struggle with coverage/denials ([RevSpring](https://www.prnewswire.com/news-releases/94-of-consumers-say-healthcare-needs-to-be-easier-revspring-study-exposes-cost-coverage-and-payment-confusion-302762620.html)) | Overlaps #1; appeals are procedural |
| 3 | Rental / tenant repair rights | State-specific | High impact but 50 legal regimes—harder to ship one plugin |
| 4 | Caregiver / Medicare enrollment | Aging population | Seasonal complexity; heavy CMS content |
| 5 | Disaster (FEMA) paperwork | Spikes after events | Episodic demand |

## Selected product: **Bill Clarity** (working name)

**One-liner:** Turn a chaotic hospital bill + EOB into **plain-language breakdown**, **red-flag screening**, and **federal/state next-step playbooks** (No Surprises Act, itemized bill request, appeal checklist).

**Not:** medical advice, legal advice, or guaranteed savings. **Is:** education + structured advocacy templates aligned with [CMS medical bill rights](https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights).

## Primary sources

- CMS No Surprises Act consumer rights: https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/know-your-medical-bill-rights/know-your-rights-insurance
- Dispute a bill (PPDR, uninsured): https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/dispute-medical-bill
- NSA key protections PDF: https://www.cms.gov/files/document/nsa-keyprotections.pdf
- No Surprises Help Desk: **1-800-985-3059**

## ChatGPT packaging (2026)

Plugins = **MCP server** at public `https://…/mcp` + optional UI ([OpenAI quickstart](https://developers.openai.com/plugins/build/app-quickstart)).
