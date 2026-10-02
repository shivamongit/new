/**
 * Federal pathway hints from CMS-published No Surprises Act consumer rules.
 * State law may add protections; always verify locally.
 */

const HELP_DESK = "1-800-985-3059";

export function assessPatientRights(input) {
  const {
    hasInsurance = null,
    careType = "unknown", // emergency | in_network_facility | scheduled | unknown
    receivedOutOfNetworkBill = false,
    paidMoreThanInNetworkRate = false,
    hasGoodFaithEstimate = false,
    billExceedsEstimateBy400 = false,
    billWithin120Days = true,
    providerAskedConsentForm = false,
    signedConsentForm = false,
    insuranceDeniedClaim = false,
  } = input;

  const paths = [];
  const warnings = [];

  if (hasInsurance === true) {
    if (receivedOutOfNetworkBill || paidMoreThanInNetworkRate) {
      if (careType === "emergency" || careType === "in_network_facility") {
        paths.push({
          id: "nsa_surprise_bill_complaint",
          title: "No Surprises Act — surprise bill complaint",
          summary:
            "You may have protections from certain out-of-network bills for emergency care or non-emergency care at in-network hospitals/ASCs.",
          actions: [
            "Gather bill, EOB, and plan documents.",
            `Call No Surprises Help Desk: ${HELP_DESK}.`,
            "Submit complaint via CMS if provider did not follow NSA rules.",
          ],
          url: "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/know-your-medical-bill-rights/know-your-rights-insurance",
        });
      } else {
        paths.push({
          id: "nsa_review",
          title: "Review NSA applicability",
          summary: "NSA protections depend on emergency vs facility-based care. Confirm care setting.",
          actions: [`Call No Surprises Help Desk: ${HELP_DESK}.`],
          url: "https://www.cms.gov/files/document/nsa-keyprotections.pdf",
        });
      }
    }

    if (providerAskedConsentForm) {
      if (!signedConsentForm) {
        paths.push({
          id: "consent_not_signed",
          title: "Notice & consent not signed",
          summary:
            "For many non-emergency situations, you may retain NSA protections if you did not validly sign a waiver.",
          actions: ["Document how form was presented.", "File complaint if form rules were violated."],
          url: "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/know-your-medical-bill-rights/know-your-rights-insurance",
        });
      } else {
        warnings.push(
          "Signed notice-and-consent may waive some NSA protections for that service—verify form complied with federal timing/separation rules."
        );
      }
    }

    if (insuranceDeniedClaim) {
      paths.push({
        id: "plan_appeal_external_review",
        title: "Health plan appeal & external review",
        summary:
          "If denial may violate NSA or plan terms, use plan appeal then external review (federal process if state does not apply).",
        actions: [
          "Follow appeal instructions on denial notice (deadlines matter).",
          "Request case file and clinical policy used.",
          "If NSA-related, note that external review can consider NSA compliance.",
        ],
        url: "https://www.cms.gov/files/document/nsa-keyprotections.pdf",
      });
    }
  }

  if (hasInsurance === false) {
    if (hasGoodFaithEstimate && billExceedsEstimateBy400 && billWithin120Days) {
      paths.push({
        id: "ppdr_uninsured",
        title: "Patient-Provider Dispute Resolution (uninsured/self-pay)",
        summary:
          "If bill is at least $400 above a good faith estimate and criteria met, federal PPDR may apply (fee applies).",
        actions: [
          "Confirm estimate date (3 business days before appointment rule).",
          "Confirm initial bill within 120 days.",
          "Start dispute via CMS process; collections should pause during review.",
        ],
        url: "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/dispute-medical-bill",
      });
    } else {
      paths.push({
        id: "uninsured_negotiate",
        title: "Self-pay negotiation & itemization",
        summary: "Without insurance, focus on itemized bill, cash-price comparison, and hospital financial assistance.",
        actions: [
          "Request itemized statement with CPT/HCPCS codes.",
          "Ask for financial assistance / charity care application.",
        ],
        url: "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights",
      });
    }
  }

  if (paths.length === 0) {
    paths.push({
      id: "general_cms",
      title: "CMS medical bill rights hub",
      summary: "Use CMS hub to match scenario to dispute, complaint, or appeal options.",
      actions: [`No Surprises Help Desk: ${HELP_DESK}`],
      url: "https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights",
    });
  }

  return {
    paths,
    warnings,
    helpDesk: HELP_DESK,
    disclaimer:
      "Educational routing only—not legal or medical advice. Deadlines and state law vary.",
  };
}
