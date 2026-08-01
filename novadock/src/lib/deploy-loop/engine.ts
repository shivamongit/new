import { DeployPhase } from "@/lib/types";

export type LoopContext = {
  appId: string;
  serviceName: string;
  workDir: string;
  command: string;
  arguments?: string | null;
  port: number;
  healthUrl?: string | null;
  envVars: Record<string, string>;
  template: string;
  attempt: number;
  maxAttempts: number;
};

export type LoopStepResult = {
  phase: DeployPhase;
  success: boolean;
  message: string;
  shouldRetry: boolean;
  haltReason?: string;
};

export type ServiceExecutor = {
  installDeps: (ctx: LoopContext) => Promise<LoopStepResult>;
  registerService: (ctx: LoopContext) => Promise<LoopStepResult>;
  startService: (ctx: LoopContext) => Promise<LoopStepResult>;
  healthCheck: (ctx: LoopContext) => Promise<LoopStepResult>;
  stopService: (serviceName: string) => Promise<LoopStepResult>;
  removeService: (serviceName: string) => Promise<LoopStepResult>;
};

const PHASE_ORDER: DeployPhase[] = [
  DeployPhase.INIT,
  DeployPhase.INSTALL,
  DeployPhase.REGISTER,
  DeployPhase.START,
  DeployPhase.HEALTH_CHECK,
  DeployPhase.COMPLETE,
];

export function nextPhase(current: DeployPhase): DeployPhase | null {
  const idx = PHASE_ORDER.indexOf(current);
  if (idx === -1 || idx >= PHASE_ORDER.length - 1) return null;
  return PHASE_ORDER[idx + 1];
}

/**
 * Loop engineering deploy loop: bounded phases with verification and retry.
 * Each phase must prove success before advancing; failures retry up to maxAttempts.
 */
export async function runDeployLoop(
  ctx: LoopContext,
  executor: ServiceExecutor,
  onLog: (line: string) => void,
): Promise<{ success: boolean; finalPhase: DeployPhase; haltReason?: string }> {
  let attempt = ctx.attempt;

  const log = (msg: string) => {
    onLog(`[${new Date().toISOString()}] ${msg}`);
  };

  while (attempt <= ctx.maxAttempts) {
    log(`Deploy attempt ${attempt}/${ctx.maxAttempts}`);

    const steps: Array<() => Promise<LoopStepResult>> = [
      async () => ({
        phase: DeployPhase.INIT,
        success: true,
        message: "Initialized deploy loop",
        shouldRetry: false,
      }),
      () => executor.installDeps({ ...ctx, attempt }),
      () => executor.registerService({ ...ctx, attempt }),
      () => executor.startService({ ...ctx, attempt }),
      () => executor.healthCheck({ ...ctx, attempt }),
    ];

    let failed = false;

    for (const step of steps) {
      const result = await step();
      log(`${result.phase}: ${result.message}`);

      if (!result.success) {
        failed = true;
        if (result.shouldRetry && attempt < ctx.maxAttempts) {
          log(`Retrying after failure: ${result.message}`);
          attempt += 1;
          break;
        }
        return {
          success: false,
          finalPhase: DeployPhase.FAILED,
          haltReason: result.haltReason ?? result.message,
        };
      }
    }

    if (!failed) {
      log("Deploy loop converged — service healthy");
      return { success: true, finalPhase: DeployPhase.COMPLETE };
    }
  }

  return {
    success: false,
    finalPhase: DeployPhase.FAILED,
    haltReason: "max_attempts_exceeded",
  };
}
