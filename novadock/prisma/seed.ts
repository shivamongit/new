import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.settings.upsert({
    where: { id: "default" },
    create: { id: "default", simulateMode: true },
    update: {},
  });

  const demo = await prisma.application.upsert({
    where: { slug: "demo-analytics" },
    create: {
      name: "Demo Analytics POC",
      slug: "demo-analytics",
      description: "Sample POC for dashboard preview",
      template: "node",
      workDir: "C:\\NovaDock\\apps\\demo-analytics",
      command: "npm",
      arguments: "start",
      port: 3001,
      healthUrl: "http://127.0.0.1:3001/",
      serviceName: "NovaDock-demo-analytics",
      status: "RUNNING",
      pid: 4242,
      envVars: "{}",
    },
    update: {},
  });

  console.log("Seeded:", demo.name);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
