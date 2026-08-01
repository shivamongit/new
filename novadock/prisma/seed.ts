import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.settings.upsert({
    where: { id: "default" },
    create: { id: "default", simulateMode: true },
    update: {},
  });

  const sample = await prisma.application.upsert({
    where: { slug: "analytics-platform" },
    create: {
      name: "Analytics Platform",
      slug: "analytics-platform",
      description: "Sample application for dashboard preview",
      template: "node",
      workDir: "C:\\NovaDock\\apps\\analytics-platform",
      command: "npm",
      arguments: "start",
      port: 3001,
      healthUrl: "http://127.0.0.1:3001/",
      serviceName: "NovaDock-analytics-platform",
      status: "RUNNING",
      pid: 4242,
      envVars: "{}",
    },
    update: {},
  });

  console.log("Seeded:", sample.name);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
