import { DeployPhase } from "@/lib/types";
import type { LoopContext, LoopStepResult, ServiceExecutor } from "../deploy-loop/engine";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Simulated Windows service state for development on non-Windows hosts. */
const simulatedServices = new Map<
  string,
  { running: boolean; port: number; healthy: boolean }
>();

export function createSimulatedExecutor(): ServiceExecutor {
  return {
    async installDeps(ctx: LoopContext): Promise<LoopStepResult> {
      await delay(400);
      return {
        phase: DeployPhase.INSTALL,
        success: true,
        message: `Dependencies ready for ${ctx.workDir}`,
        shouldRetry: false,
      };
    },

    async registerService(ctx: LoopContext): Promise<LoopStepResult> {
      await delay(300);
      simulatedServices.set(ctx.serviceName, {
        running: false,
        port: ctx.port,
        healthy: false,
      });
      return {
        phase: DeployPhase.REGISTER,
        success: true,
        message: `NSSM service registered: ${ctx.serviceName}`,
        shouldRetry: false,
      };
    },

    async startService(ctx: LoopContext): Promise<LoopStepResult> {
      await delay(500);
      const svc = simulatedServices.get(ctx.serviceName);
      if (!svc) {
        return {
          phase: DeployPhase.START,
          success: false,
          message: "Service not registered",
          shouldRetry: true,
          haltReason: "service_not_found",
        };
      }
      svc.running = true;
      svc.healthy = true;
      simulatedServices.set(ctx.serviceName, svc);
      return {
        phase: DeployPhase.START,
        success: true,
        message: `Service started on port ${ctx.port}`,
        shouldRetry: false,
      };
    },

    async healthCheck(ctx: LoopContext): Promise<LoopStepResult> {
      await delay(600);
      const svc = simulatedServices.get(ctx.serviceName);
      if (!svc?.running || !svc.healthy) {
        return {
          phase: DeployPhase.HEALTH_CHECK,
          success: false,
          message: "Health check failed — endpoint not responding",
          shouldRetry: true,
          haltReason: "health_check_failed",
        };
      }
      const url = ctx.healthUrl ?? `http://127.0.0.1:${ctx.port}`;
      return {
        phase: DeployPhase.HEALTH_CHECK,
        success: true,
        message: `Health check passed: ${url}`,
        shouldRetry: false,
      };
    },

    async stopService(serviceName: string): Promise<LoopStepResult> {
      const svc = simulatedServices.get(serviceName);
      if (svc) {
        svc.running = false;
        simulatedServices.set(serviceName, svc);
      }
      return {
        phase: DeployPhase.COMPLETE,
        success: true,
        message: `Service ${serviceName} stopped`,
        shouldRetry: false,
      };
    },

    async removeService(serviceName: string): Promise<LoopStepResult> {
      simulatedServices.delete(serviceName);
      return {
        phase: DeployPhase.COMPLETE,
        success: true,
        message: `Service ${serviceName} removed`,
        shouldRetry: false,
      };
    },
  };
}

export function getSimulatedServiceStatus(serviceName: string) {
  return simulatedServices.get(serviceName);
}

export function listSimulatedServices() {
  return Array.from(simulatedServices.entries()).map(([name, state]) => ({
    name,
    ...state,
  }));
}
