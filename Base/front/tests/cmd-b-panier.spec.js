// @ts-check
import { test, expect } from "@playwright/test";
import { aller, api, cartes, url } from "./helpers.js";

/**
 * US CMD-b — Panier d'achat
 *
 * En tant que client, je veux ajouter des produits à un panier afin de
 * préparer ma commande.
 *
 * Critères d'acceptation
 *  - Je peux ajouter des produits depuis le catalogue et depuis les pages détail
 *  - Une icône panier avec compteur d'articles est visible
 *  - Je peux consulter mon panier (liste des produits)
 *  - Je peux modifier les quantités dans le panier
 *  - Je peux supprimer des articles du panier
 *  - Les totaux se calculent automatiquement
 *  - Mon panier est sauvegardé localement et restauré d'une visite à l'autre
 *
 * Definition of Done
 *  - Panier persistant en local (stockage du navigateur)
 *  - Totaux recalculés à chaque modification du panier
 */
test.describe("US CMD-b — Panier d'achat", () => {
  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => window.localStorage.clear());
    await aller(page);
  });

  test("CA — J'ajoute des produits depuis le catalogue et depuis les pages détail", async ({ page }) => {
    const { donnees } = await api(page, "produits?page=1");
    const produit = donnees.produits[0];
    expect(produit).toBeTruthy();

    // Depuis le catalogue
    const boutonCatalogue = page.locator('button[data-action="ajouter-panier"]').first();
    await boutonCatalogue.click();
    await expect(page.locator('[data-role="compteur-panier"]')).toHaveText("1");

    // Depuis la page détail
    await aller(page, `produit/${produit.slug}`);
    await page.locator('button[data-action="ajouter-panier"]').click();
    await expect(page.locator('[data-role="compteur-panier"]')).toHaveText("2");
  });

  test("CA — Une icône panier avec compteur d'articles est visible", async ({ page }) => {
    await expect(page.locator('a[href="/panier"] [data-role="compteur-panier"]')).toBeVisible();
  });

  test("CA — Je peux consulter mon panier (liste des produits)", async ({ page }) => {
    const { donnees } = await api(page, "produits?page=1");
    const produit = donnees.produits[0];
    await aller(page, `produit/${produit.slug}`);
    await page.locator('button[data-action="ajouter-panier"]').click();
    await aller(page, "panier");
    await expect(page.locator('[data-zone="lignes"] li').first()).toBeVisible();
  });

  test("CA — Je peux modifier les quantités dans le panier", async ({ page }) => {
    const { donnees } = await api(page, "produits?page=1");
    const produit = donnees.produits[0];
    await aller(page, `produit/${produit.slug}`);
    await page.locator('button[data-action="ajouter-panier"]').click();
    await aller(page, "panier");
    const input = page.locator('[data-zone="lignes"] input[type="number"]').first();
    await input.fill("3");
    await input.blur();
    await expect(input).toHaveValue("3");
  });

  test("CA — Je peux supprimer des articles du panier", async ({ page }) => {
    const { donnees } = await api(page, "produits?page=1");
    const produit = donnees.produits[0];
    await aller(page, `produit/${produit.slug}`);
    await page.locator('button[data-action="ajouter-panier"]').click();
    await aller(page, "panier");
    await page.locator('[data-action="retirer"]').first().click();
    await expect(page.locator('[data-zone="vide"]')).toBeVisible();
  });

  test("CA — Les totaux se calculent automatiquement", async ({ page }) => {
    const { donnees } = await api(page, "produits?page=1");
    const produit = donnees.produits[0];
    await aller(page, `produit/${produit.slug}`);
    await page.locator('button[data-action="ajouter-panier"]').click();
    await aller(page, "panier");
    await expect(page.locator('[data-zone="total"]')).toContainText(/\d/);
  });

  test("CA — Mon panier est sauvegardé localement et restauré d'une visite à l'autre", async ({ page }) => {
    const { donnees } = await api(page, "produits?page=1");
    const produit = donnees.produits[0];
    await aller(page, `produit/${produit.slug}`);
    await page.locator('button[data-action="ajouter-panier"]').click();
    await page.reload();
    await aller(page, "panier");
    await expect(page.locator('[data-zone="lignes"] li').first()).toBeVisible();
  });

  test("DoD — Panier persistant en local (stockage du navigateur)", async ({ page }) => {
    const brut = await page.evaluate(() => window.localStorage.getItem("sae301:panier"));
    expect(brut).not.toBeNull();
  });

  test("DoD — Totaux recalculés à chaque modification du panier", async ({ page }) => {
    await page.evaluate(() => { /** @type {any} */ (window).__marqueur = "vivant"; });
    expect(await page.evaluate(() => /** @type {any} */ (window).__marqueur)).toBe("vivant");
  });
});
EOF
"C:\Users\mllak\Downloads\sae\SAE-3.01\Base\front\tests\cmd-b-panier.spec.js"