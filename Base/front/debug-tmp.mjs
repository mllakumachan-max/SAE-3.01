import { chromium } from "@playwright/test";

const navigateur = await chromium.launch();
const page = await navigateur.newPage();
await page.goto("http://localhost:5173/~ribatet1/SAE-3.01/Base/");
await page.waitForSelector("main article");
const html = await page.locator("main article").first().innerHTML();
console.log(html.slice(0, 1500));
const textes = await page.locator("main article").first().locator("span").allInnerTexts();
console.log("SPANS:", JSON.stringify(textes));
await navigateur.close();
