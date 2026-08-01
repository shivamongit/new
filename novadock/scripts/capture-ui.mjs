const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.screenshot({
    path: "/opt/cursor/artifacts/screenshots/novadock-dashboard.png",
    fullPage: false,
  });
  await page.goto("http://localhost:3000/apps/new", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({
    path: "/opt/cursor/artifacts/screenshots/novadock-deploy-wizard.png",
    fullPage: false,
  });
  await browser.close();
  console.log("Screenshots saved");
})();
