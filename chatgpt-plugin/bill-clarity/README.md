# Bill Clarity — ChatGPT Plugin (MCP)

**Problem:** Most Americans do not understand medical bills; surprise pricing drives care avoidance and debt ([Tebra 2026](https://www.tebra.com/theintake/healthcare-reports/medical-price-transparency-survey), [RevSpring 2026](https://www.prnewswire.com/news-releases/94-of-consumers-say-healthcare-needs-to-be-easier-revspring-study-exposes-cost-coverage-and-payment-confusion-302762620.html)).

**Solution:** A ChatGPT **plugin** (MCP server) that:

1. **Screens** pasted bill/EOB text for red flags  
2. **Routes** users to federal pathways (No Surprises Act, PPDR, appeals) using [CMS](https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights) rules  
3. **Generates** itemized-bill request letters and insurance appeal checklists  
4. **Explains** billing jargon  

**Disclaimer:** Educational tool only. Not medical, legal, or financial advice. For emergencies call 911; for NSA help **1-800-985-3059**.

## Quick start

```bash
cd chatgpt-plugin/bill-clarity
pnpm install   # or npm install
pnpm test
pnpm start     # http://localhost:8787/mcp
```

Expose with ngrok: `ngrok http 8787` → connect `https://….ngrok.app/mcp` in ChatGPT **Settings → Developer mode → Plugins** ([docs](https://developers.openai.com/plugins/build/app-quickstart)).

## MCP tools

| Tool | Purpose |
|------|---------|
| `screen_medical_bill` | Red-flag heuristics on pasted text + UI widget |
| `assess_patient_rights` | NSA / PPDR / appeal path suggestions |
| `generate_itemized_bill_request` | Letter template |
| `build_insurance_appeal_checklist` | Denial appeal steps |
| `explain_billing_term` | Glossary |

## Suggested ChatGPT plugin instructions

```
You help users understand US medical bills and insurance EOBs. Always:
- Ask if they have insurance and whether care was emergency or in-network facility.
- Call screen_medical_bill when user pastes a bill.
- Call assess_patient_rights before suggesting disputes.
- Never tell users to skip paying without reviewing deadlines; cite CMS and No Surprises Help Desk 1-800-985-3059.
- State you are not a lawyer or doctor.
```

## Research

See [RESEARCH.md](./RESEARCH.md) for alternative ideas considered.

## License

MIT
