// @ts-check
import { test, expect } from "@playwright/test";
import { aller, api, url } from "./helpers.js";
import { COMPTES } from "./constantes.js";

/**
 * GOF-c : Gestion des catégories
 * En tant qu'administrateur, je veux gérer les catégories afin d'organiser le catalogue
 *
 * Critères d'acceptation :
 * - Je peux créer de nouvelles catégories avec nom et description
 * - Je peux modifier les catégories existantes
 * - Je peux supprimer une catégorie en gérant les produits qui lui sont rattachés
 * - Je dois confirmer avant toute suppression
 * - La validation empêche les données incohérentes
 *
 * Definition of Done spécifique :
 * - CRUD complet des catégories
 * - Règle explicite pour les produits d'une catégorie supprimée (réaffectation ou blocage de la suppression)
 */

async function seConnecterAdmin(page) {
  await aller(page, "admin");
  await page.locator('input[name="login"]').fill(COMPTES.admin.login);
  await page.locator('input[name="mdp"]').fill(COMPTES.admin.mdp);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await aller(page, "admin/categories");
}

test.describe("US GOF-c — Gestion des catégories", () => {
  test.beforeEach(async ({ page }) => {
    await seConnecterAdmin(page);
  });

  test("CA — Je peux trier les catégories par nom et nombre de produits", async ({ page }) => {
    const selectTri = page.locator('select[name="tri"]');
    await expect(selectTri).toBeVisible();
    await expect(page.locator('select[name="parPage"]')).toBeVisible();

    for (const tri of ["nom", "produits_asc", "produits_desc"]) {
      const reponseTri = page.waitForResponse((reponse) =>
        reponse.url().includes("/api/admin/categories?") && reponse.url().includes(`tri=${tri}`)
      );
      await selectTri.selectOption(tri);
      const liste = await (await reponseTri).json();
      expect(liste.tri).toBe(tri);

      const categories = liste.categories;
      for (let index = 1; index < categories.length; index++) {
        if (tri === "nom") {
          expect(categories[index - 1].libelle.localeCompare(categories[index].libelle, "fr", { sensitivity: "base" })).toBeLessThanOrEqual(0);
        } else if (tri === "produits_asc") {
          expect(categories[index - 1].nb_produits).toBeLessThanOrEqual(categories[index].nb_produits);
        } else {
          expect(categories[index - 1].nb_produits).toBeGreaterThanOrEqual(categories[index].nb_produits);
        }
      }

      await expect(page.locator("tbody tr")).toHaveCount(categories.length);
      await expect(page.locator('select[name="tri"]')).toHaveValue(tri);
    }

    const reponseTaille = page.waitForResponse((reponse) =>
      reponse.url().includes("/api/admin/categories?") && reponse.url().includes("parPage=24")
    );
    await page.locator('select[name="parPage"]').selectOption("24");
    const listePaginee = await (await reponseTaille).json();
    expect(listePaginee.parPage).toBe(24);
    await expect(page.locator("tbody tr")).toHaveCount(Math.min(listePaginee.total, 24));
    await expect(page.getByText(`Page 1 sur ${listePaginee.pagesTotal}`, { exact: true })).toBeVisible();
  });

  test("CA — Je peux créer une nouvelle catégorie", async ({ page }) => {
    const libelle = "Catégorie test " + Date.now();
    const { statut, donnees } = await api(page, "admin/categories", {
      method: "POST",
      body: { libelle, description: "desc" },
    });
    expect(statut).toBe(201);
    expect(donnees.categorie.libelle).toBe(libelle);
  });

  test("CA — Je peux modifier une catégorie existante", async ({ page }) => {
    const libelle = "Catégorie modif " + Date.now();
    const { donnees } = await api(page, "admin/categories", {
      method: "POST",
      body: { libelle, description: "desc" },
    });
    const id = donnees.categorie.id;
    const nouveau = libelle + " mod";
    const { statut, donnees: d2 } = await api(page, `admin/categories/${id}`, {
      method: "PUT",
      body: { libelle: nouveau, description: "desc2" },
    });
    expect(statut).toBe(200);
    expect(d2.categorie.libelle).toBe(nouveau);
  });

  test("CA — Suppression avec réaffectation des produits", async ({ page }) => {
    const libelle = "Catégorie à supprimer " + Date.now();
    const { donnees } = await api(page, "admin/categories", {
      method: "POST",
      body: { libelle, description: "desc" },
    });
    const id = donnees.categorie.id;
    const { donnees: cats } = await api(page, "admin/categories");
    const cible = cats.categories.find((c) => c.id !== id);
    const { statut } = await api(page, `admin/categories/${id}`, {
      method: "DELETE",
      body: { cible_id: cible.id },
    });
    expect(statut).toBe(200);
  });

  test("CA — La validation empêche les données incohérentes", async ({ page }) => {
    const { statut } = await api(page, "admin/categories", {
      method: "POST",
      body: { libelle: "", description: "desc" },
    });
    expect(statut).toBe(400);
  });

  test("DoD — CRUD complet des catégories", async ({ page }) => {
    const libelle = "Catégorie CRUD " + Date.now();
    const { statut: s1, donnees: d1 } = await api(page, "admin/categories", {
      method: "POST",
      body: { libelle, description: "desc" },
    });
    expect(s1).toBe(201);
    const id = d1.categorie.id;
    const { statut: s2 } = await api(page, `admin/categories/${id}`, {
      method: "PUT",
      body: { libelle: libelle + " edit", description: "desc" },
    });
    expect(s2).toBe(200);
    const { statut: s3 } = await api(page, `admin/categories/${id}`, {
      method: "DELETE",
      body: {},
    });
    expect(s3).toBe(200);
  });

  test("DoD — Règle explicite pour les produits d'une catégorie supprimée", async ({ page }) => {
    // suppression d'une catégorie avec produits exige une cible
    const { donnees: cats } = await api(page, "admin/categories");
    const avecProduits = cats.categories.find((c) => c.nb_produits > 0);
    expect(avecProduits).toBeTruthy();
    const { statut } = await api(page, `admin/categories/${avecProduits.id}`, {
      method: "DELETE",
      body: {},
    });
    expect(statut).toBe(400);
  });
});
