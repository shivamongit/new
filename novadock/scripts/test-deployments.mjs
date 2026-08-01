/**
 * E2E smoke test: create and deploy four sample applications via API.
 * Usage: node scripts/test-deployments.mjs [baseUrl]
 */

const BASE = process.argv[2] || "http://localhost:3000";

const APPLICATIONS = [
  {
    name: "Retail Analytics",
    template: "node",
    workDir: "C:\\NovaDock\\apps\\retail-analytics",
    command: "npm",
    arguments: "start",
    port: 3011,
    healthUrl: "http://127.0.0.1:3011/",
  },
  {
    name: "Inventory API",
    template: "python",
    workDir: "C:\\NovaDock\\apps\\inventory-api",
    command: "python",
    arguments: "-m uvicorn main:app --host 0.0.0.0 --port 3012",
    port: 3012,
    healthUrl: "http://127.0.0.1:3012/docs",
  },
  {
    name: "Partner Portal",
    template: "dotnet",
    workDir: "C:\\NovaDock\\apps\\partner-portal",
    command: "dotnet",
    arguments: "run",
    port: 3013,
    healthUrl: "http://127.0.0.1:3013/",
  },
  {
    name: "Internal Tools",
    template: "node",
    workDir: "C:\\NovaDock\\apps\\internal-tools",
    command: "npm",
    arguments: "start",
    port: 3014,
    healthUrl: "http://127.0.0.1:3014/",
  },
];

async function main() {
  console.log(`NovaDock deployment smoke test → ${BASE}\n`);
  const results = [];

  for (const appDef of APPLICATIONS) {
    process.stdout.write(`Creating ${appDef.name}... `);
    const createRes = await fetch(`${BASE}/api/apps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appDef),
    });
    if (!createRes.ok) {
      console.log("FAIL create", await createRes.text());
      results.push({ name: appDef.name, ok: false });
      continue;
    }
    const app = await createRes.json();
    process.stdout.write(`deploying... `);
    const deployRes = await fetch(`${BASE}/api/apps/${app.id}/deploy`, {
      method: "POST",
    });
    const deploy = await deployRes.json();
    const detailRes = await fetch(`${BASE}/api/apps/${app.id}`);
    const detail = await detailRes.json();
    const ok = deploy.success && detail.status === "RUNNING";
    console.log(ok ? "OK (RUNNING)" : `FAIL (${detail.status})`);
    results.push({
      name: appDef.name,
      id: app.id,
      status: detail.status,
      ok,
    });
  }

  console.log("\n--- Summary ---");
  const passed = results.filter((r) => r.ok).length;
  console.log(`${passed}/${results.length} deployments succeeded`);
  results.forEach((r) =>
    console.log(`  ${r.ok ? "✓" : "✗"} ${r.name} → ${r.status}`),
  );

  const statsRes = await fetch(`${BASE}/api/stats`);
  const stats = await statsRes.json();
  console.log("\nDashboard stats:", stats);

  process.exit(passed === results.length ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
