export function itemizedBillRequestLetter(fields) {
  const {
    patientName = "[Your full name]",
    patientAddress = "[Your address]",
    patientPhone = "[Phone]",
    patientEmail = "[Email]",
    providerName = "[Provider or hospital billing department]",
    providerAddress = "[Billing address]",
    accountNumber = "[Account / statement number]",
    dateOfService = "[Date(s) of service]",
  } = fields;

  return `Subject: Request for Itemized Bill and Billing Records — Account ${accountNumber}

${new Date().toISOString().slice(0, 10)}

${providerName}
${providerAddress}

Dear Billing Department,

I am writing to request a complete, itemized statement for services provided on ${dateOfService} associated with account ${accountNumber}.

Please provide:
1. Itemized charges with CPT, HCPCS, or revenue codes and units for each line.
2. Names of rendering providers and place of service for each line.
3. Any adjustments, contractual write-offs, and payments posted to date.
4. The date each charge was first billed to me or my insurer.

I am reviewing this bill for accuracy. Please send the itemized statement within 30 days to:
${patientName}
${patientAddress}
Email: ${patientEmail}
Phone: ${patientPhone}

Please place a hold on collection activity while this request is pending, if applicable.

Thank you,
${patientName}

---
Template for educational use. Not legal advice. You may have rights under state law and the No Surprises Act; see CMS.gov medical bill rights.`;
}

export function insuranceAppealChecklist(fields) {
  const {
    memberName = "[Member name]",
    memberId = "[Member ID]",
    claimNumber = "[Claim number]",
    dateOfService = "[Date of service]",
    denialReason = "[Reason stated on EOB]",
    appealDeadline = "[Deadline from denial notice]",
  } = fields;

  return {
    deadline: appealDeadline,
    steps: [
      {
        step: 1,
        title: "Confirm appeal level",
        detail: "First-level internal appeal is usually required before external review.",
      },
      {
        step: 2,
        title: "Gather documents",
        detail: [
          "EOB showing denial",
          "Claim number " + claimNumber,
          "Itemized bill from provider",
          "Physician letter if medical necessity disputed",
          "Plan documents (Summary of Benefits and Coverage)",
        ],
      },
      {
        step: 3,
        title: "Write appeal letter",
        detail: `State that you appeal the denial for DOS ${dateOfService}. Member: ${memberName}, ID: ${memberId}. Challenge: ${denialReason}. Request full file and clinical review criteria.`,
      },
      {
        step: 4,
        title: "Send with proof",
        detail: "Use plan's fax/portal; keep confirmation. Mail certified copy if no portal.",
      },
      {
        step: 5,
        title: "External review if upheld",
        detail:
          "If internal appeal fails, request external review per denial notice. NSA-related denials may be reviewable federally.",
      },
    ],
    cmsUrl: "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights",
    disclaimer: "Check your plan documents for exact deadlines and forms.",
  };
}

export function explainTerm(term) {
  const glossary = {
    deductible: "Amount you pay before insurance starts paying its share for covered services.",
    coinsurance: "Your share of costs after deductible, usually a percentage of allowed amount.",
    copay: "Fixed amount you pay for a covered service, often at visit time.",
    "allowed amount": "Maximum plan will pay for a service; out-of-network bills may exceed this.",
    "balance billing": "Provider bills you for difference between charge and allowed amount.",
    eob: "Explanation of Benefits—insurer's statement of what was billed, allowed, paid, and your responsibility (not a bill).",
    "good faith estimate": "Uninsured/self-pay estimate before scheduled care; large excess may enable federal dispute.",
    "in-network": "Provider contracted with your plan; lower cost-sharing typically applies.",
    "out-of-network": "No contract; higher costs; NSA may limit surprises in specific settings.",
  };
  const key = term.toLowerCase().trim();
  const match = Object.entries(glossary).find(([k]) => key.includes(k));
  if (!match) {
    return {
      term,
      found: false,
      suggestion: "Ask user to paste the sentence from bill/EOB containing the term.",
    };
  }
  return { term: match[0], definition: match[1], found: true };
}
