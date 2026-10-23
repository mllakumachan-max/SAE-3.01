import { test } from "@playwright/test";
import { aller } from "./helpers.js";

test("debug links", async ({ page }) => {
  await aller(page);
  const links = await page.locator("a[data-link]").all();
  for (const l of links) {
    const href = await l.getAttribute("href");
    const text = (await l.textContent()).trim();
    console.log(`LINK: href="${href}" text="${text}"`);
  }
});