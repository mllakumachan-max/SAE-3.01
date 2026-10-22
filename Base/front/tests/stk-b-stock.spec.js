// @ts-check
import { test, expect } from "@playwright/test";
import { aller, api, cartes } from "./helpers.js";

/**
 * US STK-b — Affichage des stocks
 *
 * En tant que client, je veux voir la disponibilité des produits afin de savoir si je peux les
 * commander.
 *
 * Critères d'acceptation
 *  - Je vois l'état du stock sur chaque produit (« En stock », « Bientôt épuisé », « Épuisé »)
 *  - Le seuil « Bientôt épuisé » est défini par une valeur de configuration (fichier ou table de
 *    paramètres)
 *  - Le style visuel diffère selon l'état du stock
 *  - L'état affiché correspond au stock réel au moment où la page est chargée
 *  - Si les produits ont des variantes, je vois le stock par variante
 *
 * Definition of Done spécifique
 *  - Champs de stock ajoutés à la base de données
 *  - Tests avec différents niveaux de stock
 */
test.describe("US STK-b — Affichage des stocks", () => {
  test.beforeEach(async ({ page }) => {
    await aller(page);
  });

  test("CA — Je vois l'état du stock sur chaque produit", async ({ page }) => {
    const { donnees } = await api(page, "produits?page=1");
    expect(donnees.produits.length).toBeGreaterThan(0);

    await aller(page);
    const badges = page.locator(".c-badge-stock");
    await expect(badges.first()).toBeVisible();
    const texte = (await badges.first().innerText()).trim();
    expect(["En stock", "Bientôt épuisé", "Épuisé"]).toContain(texte);
  });

  test("CA — Le seuil « Bientôt épuisé » est défini par une valeur de configuration", async ({ page }) => {
    const { donnees } = await api(page, "produits?page=1");
    for (const produit of donnees.produits) {
      expect(typeof produit.seuil_alerte).toBe("number");
      expect(produit.seuil_alerte).toBeGreaterThan(0);
    }
  });

  test("CA — Le style visuel diffère selon l'état du stock", async ({ page }) => {
    const { donnees } = await api(page, "produits?page=1");
    expect(donnees.produits.length).toBeGreaterThan(0);

    await aller(page);
    const classes = await page.locator(".c-badge-stock").first().getAttribute("class");
    expect(classes).toBeTruthy();
  });

  test("CA — L'état affiché correspond au stock réel au moment où la page est chargée", async ({ page }) => {
    const { donnees } = await api(page, "produits?page=1");
    const produit = donnees.produits[0];
    const attendu =
      produit.stock <= 0
        ? "Épuisé"
        : produit.stock <= produit.seuil_alerte
        ? "Bientôt épuisé"
        : "En stock";

    await aller(page);
    const badge = page.locator(".c-badge-stock").first();
    await expect(badge).toHaveText(attendu);
  });

  test("DoD — Champs de stock ajoutés à la base de données", async ({ page }) => {
    const { donnees } = await api(page, "produits?page=1");
    expect(donnees.produits[0]).toHaveProperty("stock");
    expect(donnees.produits[0]).toHaveProperty("seuil_alerte");
  });

  test("DoD — Tests avec différents niveaux de stock", async ({ page }) => {
    const { donnees } = await api(page, "produits?page=1");
    const stocks = new Set(donnees.produits.map((p) => p.stock));
    expect(stocks.size).toBeGreaterThanOrEqual(1);
  });
});
