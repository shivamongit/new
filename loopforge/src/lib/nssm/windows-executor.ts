import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { DeployPhase } from "@/lib/types";
import type { LoopContext, LoopStepResult, ServiceExecutor } from "../deploy-loop/engine";
import { createSimulatedExecutor } from "./simulator";

const execFileAsync = promisify(execFile);

function isWindows(): boolean {
  return process.platform === "win32";
}

function nssmCmd(nssmPath: string, args: string[]): Promise<string> {
  return execFileAsync(nssmPath, args, { windowsHide: true }).then(
    (r) => r.stdout?.toString() ?? "",
  );
}

export function createWindowsExecutor(
  nssmPath: string,
  simulateMode: boolean,
): ServiceExecutor {
  if (simulateMode || !isWindows()) {
    return createSimulatedExecutor();
  }

  return {
    async installDeps(ctx: LoopContext): Promise<LoopStepResult> {
      try {
        if (ctx.command.includes("npm") || ctx.template === "node") {
          await execFileAsync("npm", ["ci", "--omit=dev"], {
            cwd: ctx.workDir,
            windowsHide: true,
          });
        }
        return {
          phase: DeployPhase.INSTALL,
          success: true,
          message: "Install step completed",
          shouldRetry: false,
        };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Install failed";
        return {
          phase: DeployPhase.INSTALL,
          success: false,
          message: msg,
          shouldRetry: true,
          haltReason: "install_failed",
        };
      }
    },

    async registerService(ctx: LoopContext): Promise<LoopStepResult> {
      try {
        await nssmCmd(nssmPath, ["stop", ctx.serviceName]).catch(() => {});
        await nssmCmd(nssmPath, ["remove", ctx.serviceName, "confirm"]).catch(
          () => {},
        );
        await nssmCmd(nssmPath, ["install", ctx.serviceName, ctx.command]);
        if (ctx.arguments) {
          await nssmCmd(nssmPath, [
            "set",
            ctx.serviceName,
            "AppParameters",
            ctx.arguments,
          ]);
        }
        await nssmCmd(nssmPath, [
          "set",
          ctx.serviceName,
          "AppDirectory",
          ctx.workDir,
        ]);
        await nssmCmd(nssmPath, [
          "set",
          ctx.serviceName,
          "DisplayName",
          `LoopForge — ${ctx.serviceName}`,
        ]);
        await nssmCmd(nssmPath, [
          "set",
          ctx.serviceName,
          "Start",
          "SERVICE_AUTO_START",
        ]);
        for (const [key, value] of Object.entries(ctx.envVars)) {
          await nssmCmd(nssmPath, [
            "set",
            ctx.serviceName,
            "AppEnvironmentExtra",
            `${key}=${value}`,
          ]);
        }
        return {
          phase: DeployPhase.REGISTER,
          success: true,
          message: `NSSM registered ${ctx.serviceName}`,
          shouldRetry: false,
        };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "NSSM register failed";
        return {
          phase: DeployPhase.REGISTER,
          success: false,
          message: msg,
          shouldRetry: true,
          haltReason: "register_failed",
        };
      }
    },

    async startService(ctx: LoopContext): Promise<LoopStepResult> {
      try {
        await nssmCmd(nssmPath, ["start", ctx.serviceName]);
        return {
          phase: DeployPhase.START,
          success: true,
          message: "Service started",
          shouldRetry: false,
        };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Start failed";
        return {
          phase: DeployPhase.START,
          success: false,
          message: msg,
          shouldRetry: true,
          haltReason: "start_failed",
        };
      }
    },

    async healthCheck(ctx: LoopContext): Promise<LoopStepResult> {
      const url = ctx.healthUrl ?? `http://127.0.0.1:${ctx.port}`;
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return {
          phase: DeployPhase.HEALTH_CHECK,
          success: true,
          message: `Healthy: ${url}`,
          shouldRetry: false,
        };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Health check failed";
        return {
          phase: DeployPhase.HEALTH_CHECK,
          success: false,
          message: msg,
          shouldRetry: true,
          haltReason: "health_check_failed",
        };
      }
    },

    async stopService(serviceName: string): Promise<LoopStepResult> {
      try {
        await nssmCmd(nssmPath, ["stop", serviceName]);
        return {
          phase: DeployPhase.COMPLETE,
          success: true,
          message: "Stopped",
          shouldRetry: false,
        };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Stop failed";
        return {
          phase: DeployPhase.FAILED,
          success: false,
          message: msg,
          shouldRetry: false,
        };
      }
    },

    async removeService(serviceName: string): Promise<LoopStepResult> {
      try {
        await nssmCmd(nssmPath, ["stop", serviceName]).catch(() => {});
        await nssmCmd(nssmPath, ["remove", serviceName, "confirm"]);
        return {
          phase: DeployPhase.COMPLETE,
          success: true,
          message: "Removed",
          shouldRetry: false,
        };
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Remove failed";
        return {
          phase: DeployPhase.FAILED,
          success: false,
          message: msg,
          shouldRetry: false,
        };
      }
    },
  };
}
