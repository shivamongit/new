import { describe, expect, it } from "vitest";
import { screenBillText } from "./red-flags.js";

describe("screenBillText", () => {
  it("flags out-of-network language", () => {
    const r = screenBillText("Patient responsibility - OUT-OF-NETWORK surgeon $4,200.00");
    expect(r.flags.some((f) => f.id === "oon_language")).toBe(true);
  });

  it("flags high balance", () => {
    const r = screenBillText("Amount due: $2,450.00");
    expect(r.flags.some((f) => f.id === "high_balance_due")).toBe(true);
  });
});
