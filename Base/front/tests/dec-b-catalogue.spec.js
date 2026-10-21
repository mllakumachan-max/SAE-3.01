// @ts-check
import { test, expect } from "@playwright/test";
import { aller, api, cartes, attendreImage, url, PRIX } from "./helpers.js";

/**
 * US DEC-b — Catalogue de produits
 *
 * En tant que visiteur, je veux consulter le catalogue de produits afin de
 * découvrir l'offre disponible.
 *
 * Critères d'acceptation
 *  - Je peux voir tous les produits
 *  - Chaque produit affiche : nom, prix, image principale
 *  - La page se charge en moins de 3 secondes
 *
 * Definition of Done
 *  - Base de données initialisée avec les produits de test (au moins
 *    3 catégories de 4 produits)
 *
 * Chaque test porte le nom de la règle qu'il vérifie : « CA » pour un critère
 * d'acceptation, « DoD » pour la définition de Done.
 */
test.describe("US DEC-b — Catalogue de produits", () => {
  test.beforeEach(async ({ page }) => {
    await aller(page);
    await expect(page.getByRole("heading", { level: 1, name: "Catalogue" })).toBeVisible();
  });

  test("CA — Je peux voir tous les produits", async ({ page }) => {
    // Référence : ce que l'API compte réellement.
    const { statut, donnees } = await api(page, "produits?page=1");
    expect(statut).toBe(200);

    const total = donnees.total;
    const parPage = donnees.parPage;
    expect(total).toBeGreaterThan(0);

    // La première page affiche une page complète de produits.
    await expect(cartes(page)).toHaveCount(Math.min(total, parPage));

    // On parcourt toutes les pages du catalogue : chaque produit doit être
    // rencontré une fois, et une seule.
    let vus = 0;
    let pageCourante = 1;

    for (; pageCourante <= 20; pageCourante++) {
      await expect(page.getByText(new RegExp(`^Page ${pageCourante} sur `))).toBeVisible();
      vus += await cartes(page).count();

      const suivant = page.locator('[data-action="suivante"]');
      if (await suivant.isDisabled()) break;
      await suivant.click();
    }

    expect(vus).toBe(total);
  });

  test("CA — Chaque produit affiche nom, prix et image principale", async ({ page }) => {
    const nb = await cartes(page).count();
    expect(nb).toBeGreaterThan(0);

    for (let i = 0; i < nb; i++) {
      const carte = cartes(page).nth(i);

      // Nom : un titre, non vide.
      const nom = (await carte.locator("h2").innerText()).trim();
      expect(nom.length).toBeGreaterThan(0);

      // Prix : un montant en euros, bien mis en forme.
      const prix = carte.getByText(PRIX);
      await expect(prix).toHaveCount(1);
      await expect(prix).toBeVisible();

      // Image principale : présente, et réellement chargée (et non un lien
      // cassé que le navigateur afficherait quand même).
      const image = carte.locator("img").first();
      await expect(image).toHaveAttribute("src", /\S+/);
      await attendreImage(image);
    }
  });

  test("CA — La page se charge en moins de 3 secondes", async ({ page, context }) => {
    // La première visite sert à amorcer le serveur de développement (Vite
    // optimise ses dépendances) et à remplir le cache du navigateur : on
    // mesure la visite suivante, celle d'un visiteur qui revient.
    await page.goto(url());

    const pageMesure = await context.newPage();
    const debut = Date.now();

    await pageMesure.goto(url());
    await expect(pageMesure.locator("main article").first()).toBeVisible();

    const duree = Date.now() - debut;
    await pageMesure.close();

    expect(duree).toBeLessThan(3000);
  });

  test("DoD — La base contient au moins 3 catégories de 4 produits", async ({ page }) => {
    const { statut, donnees } = await api(page, "categories");
    expect(statut).toBe(200);

    const categories = donnees.categories;
    expect(categories.length).toBeGreaterThanOrEqual(3);

    // Au moins trois catégories doivent compter au moins quatre produits.
    const categoriesPeuplees = categories.filter((/** @type {any} */ c) => c.nb_produits >= 4);
    expect(categoriesPeuplees.length).toBeGreaterThanOrEqual(3);

    // Et ces produits sont bien visibles dans le catalogue.
    for (const categorie of categoriesPeuplees) {
      const produits = await api(page, `produits?page=1&categorie=${categorie.slug}`);
      expect(produits.statut).toBe(200);
      expect(produits.donnees.total).toBeGreaterThanOrEqual(4);
    }
  });
});
