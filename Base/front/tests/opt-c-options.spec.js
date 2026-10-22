// @ts-check
import { test, expect } from "@playwright/test";
import { aller, api, PRIX } from "./helpers.js";

/**
 * US OPT-c — Choix des options
 *
 * En tant que client, je veux choisir les options d'un produit sur sa fiche afin de
 * le personnaliser.
 *
 * Critères d'acceptation
 *  - Je vois les options disponibles sur la page produit (taille, couleur, etc.)
 *  - Je peux sélectionner une combinaison d'options
 *  - Le prix se met à jour selon mes choix
 *  - Le bouton « Ajouter au panier » ajoute le produit avec les options choisies
 *
 * Definition of Done
 *  - Modélisation des options en base de données (options définies par produit)
 *  - Interface dynamique (JavaScript)
 */
test.describe("US OPT-c — Choix des options", () => {
  test.beforeEach(async ({ page }) => {
    await aller(page);
  });

  /**
   * Produit de référence qui propose des options de personnalisation.
   * Les données viennent de l'API : c'est la référence de vérité.
   * @param {import("@playwright/test").Page} page
   */
  async function produitAvecOptions(page) {
    const { statut, donnees } = await api(page, "produits/couette-sans-housse-easy");
    expect(statut).toBe(200);
    expect(donnees.produit).toBeTruthy();
    expect(Array.isArray(donnees.options)).toBe(true);
    expect(donnees.options.length).toBeGreaterThan(0);
    return donnees;
  }

  test("CA — Je vois les options disponibles sur la page produit", async ({ page }) => {
    const { donnees } = await produitAvecOptions(page);
    const option = donnees.options[0];

    await aller(page, `produit/${donnees.produit.slug}`);

    // Le nom de l'option est affiché sur la fiche produit.
    await expect(page.locator('[data-zone="options"]').getByText(option.nom)).toBeVisible();

    // Chaque valeur de l'option est proposée comme choix.
    for (const valeur of option.valeurs) {
      await expect(page.getByRole("radio", { name: valeur.valeur })).toBeVisible();
    }
  });

  test("CA — Je peux sélectionner une combinaison d'options", async ({ page }) => {
    const { donnees } = await produitAvecOptions(page);
    const option = donnees.options[0];
    const valeur = option.valeurs[0];

    await aller(page, `produit/${donnees.produit.slug}`);

    // L'utilisateur choisit une valeur pour l'option.
    await page.getByRole("radio", { name: valeur.valeur }).click();

    // Le titre de l'option indique la valeur choisie.
    await expect(
      page.locator('[data-zone="options"]').getByText(new RegExp(`${option.nom} : ${valeur.valeur}`))
    ).toBeVisible();
  });

  test("CA — Le prix se met à jour selon mes choix", async ({ page }) => {
    const { donnees } = await produitAvecOptions(page);
    const option = donnees.options[0];

    // On choisit une valeur qui comporte un supplément, pour que le prix change.
    const valeurAvecSupplement = option.valeurs.find((v) => Number(v.prix_supplement || 0) > 0);
    if (!valeurAvecSupplement) {
      // Aucune valeur avec supplément : le test n'a pas de sens sur ce produit.
      test.skip();
      return;
    }

    const supplement = Number(valeurAvecSupplement.prix_supplement);
    const prixBase = Number(donnees.produit.prix);
    const prixAttendu = (prixBase + supplement).toFixed(2).replace(".", ",");

    await aller(page, `produit/${donnees.produit.slug}`);

    // Prix de base affiché au chargement de la page.
    const attenduBase = `${prixBase.toFixed(2).replace(".", ",")} €`;
    await expect(page.locator("main article").getByText(PRIX).first()).toHaveText(attenduBase);

    // Pose un marqueur avant l'interaction : la page ne doit pas se recharger.
    await page.evaluate(() => { /** @type {any} */ (window).__marqueur = "vivant"; });
    await page.getByRole("radio", { name: valeurAvecSupplement.valeur }).click();
    expect(await page.evaluate(() => /** @type {any} */ (window).__marqueur)).toBe("vivant");

    // Le prix affiché intègre le supplément de l'option choisie.
    await expect(page.locator("main article").getByText(PRIX).first()).toHaveText(`${prixAttendu} €`);
  });

  test("CA — Le bouton « Ajouter au panier » ajoute le produit avec les options choisies", async ({
    page,
  }) => {
    const { donnees } = await produitAvecOptions(page);
    const option = donnees.options[0];
    const valeur = option.valeurs[0];

    await aller(page, `produit/${donnees.produit.slug}`);

    // L'utilisateur choisit une option, puis ajoute au panier.
    await page.getByRole("radio", { name: valeur.valeur }).click();

    const bouton = page.locator('button[data-action="ajouter-panier"]');
    await expect(bouton).toBeEnabled();
    await bouton.click();

    // Le visiteur est prévenu de l'ajout au panier.
    await expect(page.locator('[data-zone="message"]')).toContainText(/ajouté au panier/i);

    // La ligne du panier (conservée dans le localStorage) porte les options choisies.
    const panier = await page.evaluate(() => {
      const brut = localStorage.getItem("sae301:panier");
      return brut ? JSON.parse(brut) : [];
    });

    const ligne = panier.find((l) => String(l.id) === String(donnees.produit.id));
    expect(ligne).toBeTruthy();
    expect(ligne.options).toEqual({ [option.nom]: valeur.valeur });
  });

  test("DoD — Les options sont modélisées en base de données", async ({ page }) => {
    const { donnees } = await produitAvecOptions(page);

    // Chaque option est rattachée au produit et possède au moins une valeur.
    for (const option of donnees.options) {
      expect(option.nom).toBeTruthy();
      expect(Array.isArray(option.valeurs)).toBe(true);
      expect(option.valeurs.length).toBeGreaterThan(0);
      for (const valeur of option.valeurs) {
        expect(valeur.valeur).toBeTruthy();
        expect(Number(valeur.prix_supplement) >= 0).toBe(true);
      }
    }
  });

  test("DoD — L'interface est dynamique (sans rechargement de page)", async ({ page }) => {
    const { donnees } = await produitAvecOptions(page);

    await aller(page, `produit/${donnees.produit.slug}`);

    // Pose un marqueur avant l'interaction.
    await page.evaluate(() => { /** @type {any} */ (window).__marqueur = "vivant"; });

    // Sélectionner une option met à jour l'affichage sans recharger la page.
    await page.getByRole("radio", { name: donnees.options[0].valeurs[0].valeur }).click();

    expect(await page.evaluate(() => /** @type {any} */ (window).__marqueur)).toBe("vivant");
  });
});
