// @ts-check
import { test, expect } from "@playwright/test";
import { aller, api, cartes, menuCategories, url } from "./helpers.js";

/**
 * US DEC-a — Navigation par catégories
 *
 * En tant que visiteur, je veux filtrer les produits par catégorie afin de
 * trouver plus facilement ce qui m'intéresse.
 *
 * Critères d'acceptation
 *  - Je vois un menu de navigation avec les catégories
 *  - Je peux cliquer sur une catégorie pour voir uniquement ses produits
 *  - Le nombre de produits par catégorie est affiché
 *  - Un bouton « Tous les produits » me permet de réinitialiser le filtre
 *  - L'URL change selon la catégorie sélectionnée
 *
 * Definition of Done
 *  - Filtrage fonctionnel (en JavaScript ou par rechargement de la page)
 *  - URLs propres (/categorie/nom-categorie)
 *  - Fil d'Ariane ou indication visuelle de la catégorie active
 */
test.describe("US DEC-a — Navigation par catégories", () => {
  test.beforeEach(async ({ page }) => {
    await aller(page);
  });

  test("CA — Je vois un menu de navigation avec les catégories", async ({ page }) => {
    const { statut, donnees } = await api(page, "categories");
    expect(statut).toBe(200);

    const menu = menuCategories(page);

    // Le menu propose toutes les catégories du catalogue…
    for (const categorie of donnees.categories) {
      await expect(menu.locator(`a[href$="/categorie/${categorie.slug}"]`)).toBeVisible();
      await expect(menu.getByRole("link", { name: new RegExp(categorie.libelle) })).toBeVisible();
    }

    // …et le lien qui remet le filtre à zéro.
    await expect(menu.getByRole("link", { name: "Tous les produits" })).toBeVisible();
  });

  test("CA — Le nombre de produits par catégorie est affiché", async ({ page }) => {
    const { donnees } = await api(page, "categories");

    for (const categorie of donnees.categories) {
      const lien = menuCategories(page).locator(`a[href$="/categorie/${categorie.slug}"]`);
      await expect(lien).toContainText(String(categorie.nb_produits));
    }
  });

  test("CA — Je peux cliquer sur une catégorie pour voir uniquement ses produits", async ({ page }) => {
    const { donnees: categories } = await api(page, "categories");
    const categorie = categories.categories.find((/** @type {any} */ c) => c.nb_produits > 0);
    expect(categorie).toBeTruthy();

    await menuCategories(page).locator(`a[href$="/categorie/${categorie.slug}"]`).click();

    // Référence : la liste que l'API renvoie pour cette catégorie.
    const { statut, donnees } = await api(page, `produits?page=1&categorie=${categorie.slug}`);
    expect(statut).toBe(200);

    // La grille affiche exactement les produits de la catégorie, et rien
    // d'autre.
    const affiches = await cartes(page).locator("h2").allInnerTexts();
    const attendus = donnees.produits.map((/** @type {any} */ p) => p.nom);

    expect(affiches.sort()).toEqual(attendus.sort());
    expect(affiches.length).toBe(categorie.nb_produits);
  });

  test("CA — L'URL change selon la catégorie sélectionnée", async ({ page }) => {
    const { donnees } = await api(page, "categories");
    const avecProduits = donnees.categories.filter((/** @type {any} */ c) => c.nb_produits > 0);
    expect(avecProduits.length).toBeGreaterThan(1);

    const premiere = avecProduits[0];
    const seconde = avecProduits[1];

    // On clique la première catégorie : l'adresse la désigne.
    await menuCategories(page).locator(`a[href$="/categorie/${premiere.slug}"]`).click();
    await expect(page).toHaveURL(url(`categorie/${premiere.slug}`));

    // Puis la seconde : l'adresse change encore.
    await menuCategories(page).locator(`a[href$="/categorie/${seconde.slug}"]`).click();
    await expect(page).toHaveURL(url(`categorie/${seconde.slug}`));
    await expect(page).not.toHaveURL(url(`categorie/${premiere.slug}`));
  });

  test("CA — « Tous les produits » réinitialise le filtre", async ({ page }) => {
    const { donnees: categories } = await api(page, "categories");
    const categorie = categories.categories.find((/** @type {any} */ c) => c.nb_produits > 0);

    await menuCategories(page).locator(`a[href$="/categorie/${categorie.slug}"]`).click();
    await expect(page).toHaveURL(url(`categorie/${categorie.slug}`));

    // Le bouton « Tous les produits » remet le filtre à zéro…
    await menuCategories(page).getByRole("link", { name: "Tous les produits" }).click();

    // …l'adresse revient à la racine du site…
    await expect(page).toHaveURL(url());

    // …et le catalogue complet réapparaît.
    const { donnees } = await api(page, "produits?page=1");
    const affiches = await cartes(page).locator("h2").allInnerTexts();
    expect(affiches.length).toBe(Math.min(donnees.total, donnees.parPage));
  });

  test("DoD — Le filtrage fonctionne sans recharger toute la page", async ({ page }) => {
    const { donnees } = await api(page, "categories");
    const categorie = donnees.categories.find((/** @type {any} */ c) => c.nb_produits > 0);

    // On marque la page : si le navigateur rechargeait le document, ce
    // marqueur disparaîtrait.
    await page.evaluate(() => {
      // @ts-ignore
      window.__marqueur = "vivant";
    });

    await menuCategories(page).locator(`a[href$="/categorie/${categorie.slug}"]`).click();
    await expect(page).toHaveURL(url(`categorie/${categorie.slug}`));

    // Le marqueur a survécu : la page n'a pas été rechargée, le filtrage a
    // été fait en JavaScript.
    expect(await page.evaluate(() => window.__marqueur)).toBe("vivant");
  });

  test("DoD — Les URLs de catégorie sont propres", async ({ page }) => {
    const { donnees } = await api(page, "categories");
    const categorie = donnees.categories.find((/** @type {any} */ c) => c.nb_produits > 0);

    await menuCategories(page).locator(`a[href$="/categorie/${categorie.slug}"]`).click();

    // L'adresse est bien /categorie/nom-categorie, sans paramètre parasite.
    await expect(page).toHaveURL(/\/categorie\/[a-z0-9-]+$/);

    // Et l'adresse fonctionne ouverte directement (un lien partagé).
    await aller(page, `categorie/${categorie.slug}`);
    await expect(cartes(page)).toHaveCount(categorie.nb_produits);
  });

  test("DoD — La catégorie active est signalée (fil d'Ariane et menu)", async ({ page }) => {
    const { donnees } = await api(page, "categories");
    const categorie = donnees.categories.find((/** @type {any} */ c) => c.nb_produits > 0);

    await menuCategories(page).locator(`a[href$="/categorie/${categorie.slug}"]`).click();

    // Fil d'Ariane : la catégorie est le dernier élément, donc la page
    // courante.
    const fil = page.locator('nav[aria-label="Fil d\'Ariane"]');
    await expect(fil).toBeVisible();
    await expect(fil.locator('[aria-current="page"]')).toHaveText(categorie.libelle);

    // Et le menu indique la catégorie active.
    const lienActif = menuCategories(page).locator(`a[href$="/categorie/${categorie.slug}"]`);
    await expect(lienActif).toHaveAttribute("aria-current", "page");
  });
});
