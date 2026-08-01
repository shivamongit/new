import { describe, it, expect } from "vitest";
import { runDeployLoop } from "@/lib/deploy-loop/engine";
import { createSimulatedExecutor } from "@/lib/nssm/simulator";
import { slugify } from "@/lib/utils";
import { DeployPhase } from "@/lib/types";

describe("slugify", () => {
  it("normalizes names to slugs", () => {
    expect(slugify("Customer POC Dashboard")).toBe("customer-poc-dashboard");
    expect(slugify("  Hello World!  ")).toBe("hello-world");
  });
});

describe("deploy loop", () => {
  it("converges to healthy service in simulate mode", async () => {
    const logs: string[] = [];
    const result = await runDeployLoop(
      {
        appId: "test-1",
        serviceName: "LoopForge-test",
        workDir: "/tmp/test-app",
        command: "npm",
        arguments: "start",
        port: 3000,
        healthUrl: "http://127.0.0.1:3000/",
        envVars: { PORT: "3000" },
        template: "node",
        attempt: 1,
        maxAttempts: 3,
      },
      createSimulatedExecutor(),
      (line) => logs.push(line),
    );

    expect(result.success).toBe(true);
    expect(result.finalPhase).toBe(DeployPhase.COMPLETE);
    expect(logs.length).toBeGreaterThan(0);
  });
});
