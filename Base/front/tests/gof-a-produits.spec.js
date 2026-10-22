// @ts-check
import { test, expect } from "@playwright/test";
import { aller, api } from "./helpers.js";
import { COMPTES } from "./constantes.js";

async function seConnecterAdmin(page) {
  await aller(page, "admin");
  await page.locator('input[name="login"]').fill(COMPTES.admin.login);
  await page.locator('input[name="mdp"]').fill(COMPTES.admin.mdp);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await aller(page, "admin/produits");
}

test.describe("US GOF-a — Gestion des produits", () => {
  test.beforeEach(async ({ page }) => {
    await seConnecterAdmin(page);
    await expect(page.getByRole("heading", { name: "Gestion des produits" })).toBeVisible();
  });

  test("CA — Je peux trier et choisir le nombre de produits par page", async ({ page }) => {
    const { statut, donnees: initial } = await api(page, "admin/produits?page=1");
    expect(statut).toBe(200);
    expect(initial.total).toBeGreaterThan(0);
    await expect(page.locator('select[name="tri"]')).toHaveValue(initial.tri);
    await expect(page.locator('select[name="parPage"]')).toHaveValue(String(initial.parPage));
    await expect(page.locator("tbody tr")).toHaveCount(Math.min(initial.total, initial.parPage));

    const reponseTri = page.waitForResponse((reponse) =>
      reponse.url().includes("/api/admin/produits?") && reponse.url().includes("tri=prix")
    );
    await page.locator('select[name="tri"]').selectOption("prix");
    const listeTriee = await (await reponseTri).json();
    expect(listeTriee.tri).toBe("prix");
    await expect(page.locator("tbody tr").first().locator("td").first()).toHaveText(listeTriee.produits[0].nom);

    const reponseTaille = page.waitForResponse((reponse) =>
      reponse.url().includes("/api/admin/produits?") && reponse.url().includes("parPage=24")
    );
    await page.locator('select[name="parPage"]').selectOption("24");
    const listePaginee = await (await reponseTaille).json();
    await expect(page.locator("tbody tr")).toHaveCount(Math.min(listePaginee.total, 24));
    await expect(page.getByText(`Page 1 sur ${listePaginee.pagesTotal}`, { exact: true })).toBeVisible();
  });

  test("CA — Je peux trier par catégorie, stock et état", async ({ page }) => {
    const selectTri = page.locator('select[name="tri"]');

    for (const tri of ["categorie", "stock", "etat"]) {
      const reponseTri = page.waitForResponse((reponse) =>
        reponse.url().includes("/api/admin/produits?") && reponse.url().includes(`tri=${tri}`)
      );
      await selectTri.selectOption(tri);
      const liste = await (await reponseTri).json();
      expect(liste.tri).toBe(tri);
      await expect(page.locator("tbody tr").first().locator("td").first()).toHaveText(liste.produits[0].nom);

      if (tri === "categorie") {
        for (let index = 1; index < liste.produits.length; index++) {
          expect(liste.produits[index - 1].categorie.localeCompare(liste.produits[index].categorie, "fr", { sensitivity: "base" })).toBeLessThanOrEqual(0);
        }
      } else if (tri === "stock") {
        for (let index = 1; index < liste.produits.length; index++) {
          expect(liste.produits[index - 1].stock).toBeLessThanOrEqual(liste.produits[index].stock);
        }
      } else {
        const rangEtat = (produit) =>
          produit.stock <= 0 ? 0 : produit.stock <= produit.seuil_alerte ? 1 : 2;
        for (let index = 1; index < liste.produits.length; index++) {
          expect(rangEtat(liste.produits[index - 1])).toBeLessThanOrEqual(rangEtat(liste.produits[index]));
        }
      }
    }
  });
});