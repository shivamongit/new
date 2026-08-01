export const AppStatus = {
  PENDING: "PENDING",
  DEPLOYING: "DEPLOYING",
  RUNNING: "RUNNING",
  STOPPED: "STOPPED",
  FAILED: "FAILED",
  UNHEALTHY: "UNHEALTHY",
} as const;

export type AppStatus = (typeof AppStatus)[keyof typeof AppStatus];

export const DeployPhase = {
  INIT: "INIT",
  INSTALL: "INSTALL",
  REGISTER: "REGISTER",
  START: "START",
  HEALTH_CHECK: "HEALTH_CHECK",
  COMPLETE: "COMPLETE",
  FAILED: "FAILED",
} as const;

export type DeployPhase = (typeof DeployPhase)[keyof typeof DeployPhase];
