/**
 * Heuristic red-flag screening on pasted bill/EOB text (not medical advice).
 */

const DUPLICATE_LINE =
  /(\b\d{5}\b|\bCPT\b|\bHCPCS\b).{0,80}(\d+\.\d{2})/gi;

export function screenBillText(text) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const lower = normalized.toLowerCase();
  const flags = [];

  const amounts = [...normalized.matchAll(/\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/g)].map(
    (m) => parseFloat(m[1].replace(/,/g, ""))
  );
  const maxAmount = amounts.length ? Math.max(...amounts) : null;

  if (/balance\s+due|amount\s+due|pay\s+this\s+amount/i.test(normalized) && maxAmount && maxAmount > 500) {
    flags.push({
      id: "high_balance_due",
      severity: "review",
      title: "Large balance due",
      detail: `Document shows amounts up to ~$${maxAmount.toFixed(2)}. Verify against EOB and in-network status before paying.`,
    });
  }

  if (/out.of.network|out-of-network|oon\b|not covered.*network/i.test(lower)) {
    flags.push({
      id: "oon_language",
      severity: "high",
      title: "Out-of-network language detected",
      detail:
        "Federal No Surprises Act may limit surprise balance billing for emergency care and certain in-facility services. See assess_patient_rights tool.",
      cmsTopic: "no_surprises_act",
    });
  }

  if (/facility\s+fee|trauma\s+activation|observation\s+hours/i.test(lower)) {
    flags.push({
      id: "facility_fees",
      severity: "review",
      title: "Facility / observation charges",
      detail: "These line items are common dispute targets; request itemized detail and compare to EOB.",
    });
  }

  if (/duplicate|charged twice|same date of service/i.test(lower)) {
    flags.push({
      id: "duplicate_mention",
      severity: "high",
      title: "Possible duplicate charge mentioned",
      detail: "Request itemized bill and compare CPT/HCPCS codes and dates of service.",
    });
  }

  const lines = normalized.split(/[\n;]+/).map((l) => l.trim()).filter(Boolean);
  const seen = new Map();
  for (const line of lines) {
    const key = line.toLowerCase().replace(/\s+/g, " ");
    if (key.length < 12) continue;
    seen.set(key, (seen.get(key) || 0) + 1);
  }
  const dupLines = [...seen.entries()].filter(([, n]) => n > 1);
  if (dupLines.length > 0) {
    flags.push({
      id: "repeated_line_items",
      severity: "review",
      title: "Repeated identical line descriptions",
      detail: `${dupLines.length} line pattern(s) appear more than once—verify not double-billed.`,
    });
  }

  if (!/explanation of benefits|eob|member id|claim/i.test(lower) && /hospital|physician|lab/i.test(lower)) {
    flags.push({
      id: "missing_eob_context",
      severity: "info",
      title: "Bill without obvious EOB fields",
      detail: "Ask user to also paste insurance EOB; many disputes require both documents.",
    });
  }

  if (/collections|final notice|credit/i.test(lower)) {
    flags.push({
      id: "collections_language",
      severity: "high",
      title: "Collections or final notice language",
      detail: "Do not ignore; request validation of debt and itemization before paying under pressure.",
    });
  }

  return {
    charCount: normalized.length,
    approximateAmountsFound: amounts.length,
    flags,
    disclaimer:
      "Automated screening only—not a bill audit. Confirm with provider, insurer, or licensed advocate.",
  };
}
