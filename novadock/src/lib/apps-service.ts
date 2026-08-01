import { AppStatus } from "@/lib/types";
import { prisma } from "./prisma";
import { runDeployLoop } from "./deploy-loop/engine";
import { createWindowsExecutor } from "./nssm/windows-executor";
import { slugify } from "./utils";

export async function getSettings() {
  let settings = await prisma.settings.findUnique({ where: { id: "default" } });
  if (!settings) {
    settings = await prisma.settings.create({ data: { id: "default" } });
  }
  return settings;
}

export async function listApplications() {
  return prisma.application.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      deployRuns: { orderBy: { startedAt: "desc" }, take: 1 },
    },
  });
}

export async function getApplication(id: string) {
  return prisma.application.findUnique({
    where: { id },
    include: {
      deployRuns: { orderBy: { startedAt: "desc" }, take: 10 },
    },
  });
}

type CreateAppInput = {
  name: string;
  description?: string;
  template: string;
  workDir: string;
  command: string;
  arguments?: string;
  port: number;
  healthUrl?: string;
  envVars?: Record<string, string>;
};

export async function createApplication(input: CreateAppInput) {
  const slug = slugify(input.name);
  const serviceName = `NovaDock-${slug}`;

  return prisma.application.create({
    data: {
      name: input.name,
      slug,
      description: input.description,
      template: input.template,
      workDir: input.workDir,
      command: input.command,
      arguments: input.arguments,
      port: input.port,
      healthUrl: input.healthUrl,
      envVars: JSON.stringify(input.envVars ?? {}),
      serviceName,
      status: AppStatus.PENDING,
    },
  });
}

export async function deployApplication(appId: string) {
  const app = await prisma.application.findUnique({ where: { id: appId } });
  if (!app) throw new Error("Application not found");

  const settings = await getSettings();
  const executor = createWindowsExecutor(
    settings.nssmPath,
    settings.simulateMode,
  );

  const deployRun = await prisma.deployRun.create({
    data: {
      applicationId: appId,
      phase: "INIT",
      attempt: 1,
      maxAttempts: 3,
    },
  });

  await prisma.application.update({
    where: { id: appId },
    data: { status: AppStatus.DEPLOYING, lastError: null },
  });

  const logs: string[] = [];
  const onLog = (line: string) => {
    logs.push(line);
  };

  const envVars = JSON.parse(app.envVars || "{}") as Record<string, string>;

  const result = await runDeployLoop(
    {
      appId: app.id,
      serviceName: app.serviceName,
      workDir: app.workDir,
      command: app.command,
      arguments: app.arguments,
      port: app.port,
      healthUrl: app.healthUrl,
      envVars: { ...envVars, PORT: String(app.port) },
      template: app.template,
      attempt: 1,
      maxAttempts: 3,
    },
    executor,
    onLog,
  );

  await prisma.deployRun.update({
    where: { id: deployRun.id },
    data: {
      phase: result.finalPhase,
      success: result.success,
      haltReason: result.haltReason,
      logs: logs.join("\n"),
      completedAt: new Date(),
    },
  });

  await prisma.application.update({
    where: { id: appId },
    data: {
      status: result.success ? AppStatus.RUNNING : AppStatus.FAILED,
      lastError: result.success ? null : result.haltReason,
      pid: result.success ? Math.floor(Math.random() * 9000) + 1000 : null,
    },
  });

  return { success: result.success, deployRunId: deployRun.id };
}

export async function stopApplication(appId: string) {
  const app = await prisma.application.findUnique({ where: { id: appId } });
  if (!app) throw new Error("Application not found");

  const settings = await getSettings();
  const executor = createWindowsExecutor(
    settings.nssmPath,
    settings.simulateMode,
  );

  await executor.stopService(app.serviceName);
  await prisma.application.update({
    where: { id: appId },
    data: { status: AppStatus.STOPPED, pid: null },
  });
}

export async function deleteApplication(appId: string) {
  const app = await prisma.application.findUnique({ where: { id: appId } });
  if (!app) throw new Error("Application not found");

  const settings = await getSettings();
  const executor = createWindowsExecutor(
    settings.nssmPath,
    settings.simulateMode,
  );

  await executor.removeService(app.serviceName);
  await prisma.application.delete({ where: { id: appId } });
}

export async function getDashboardStats() {
  const [total, running, failed, deploying] = await Promise.all([
    prisma.application.count(),
    prisma.application.count({ where: { status: AppStatus.RUNNING } }),
    prisma.application.count({ where: { status: AppStatus.FAILED } }),
    prisma.application.count({ where: { status: AppStatus.DEPLOYING } }),
  ]);
  return { total, running, failed, deploying };
}
