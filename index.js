const puppeteer = require("puppeteer");

(async () => {
  const keyword = "Rec2Tech Scuba";
  const targetwebsite = "rec2techscuba.com";
  const browser = await puppeteer.launch({
    defaultViewport: false,
    headless: false });
  const page = await browser.newPage();

  await page.goto("https://www.google.com");
  try { await page.click('[aria-label="Accept all"]'); } catch {}
  try { await page.click('[aria-label="Stay signed out"]'); } catch {}

  await page.waitForSelector("input[name='q']");
  await page.type("input[name='q']", keyword);
  await page.keyboard.press("Enter");
  await page.waitForNavigation();

  for (let i = 0; i < 6; i++) {
    const links = await page.$$eval("a", a => a.map(e => e.href));
    const match = links.find(h => h.includes(targetwebsite));
    if (match) {
      await page.goto(match, { waitUntil: "networkidle2" });

      const internal = await page.$$eval("a", a =>
        a.map(e => e.href).filter(h => h.includes(targetwebsite) && !h.includes("#"))
      );

      for (let j = 0; j < 3; j++) {
        const link = internal[Math.floor(Math.random() * internal.length)];
        await page.goto(link, { waitUntil: "networkidle2" });
        await page.waitForTimeout(2000 + Math.random() * 2000);
      }
      break;
    }
    const next = await page.$("#pnnext");
    if (!next) break;
    await Promise.all([page.waitForNavigation(), next.click()]);
  }

    await browser.close();
})();
