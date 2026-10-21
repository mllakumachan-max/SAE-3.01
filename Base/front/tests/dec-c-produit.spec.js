// @ts-check
import { test, expect } from "@playwright/test";
import { aller, api, attendreImage, url, PRIX } from "./helpers.js";

/**
 * US DEC-c — Détail d'un produit
 *
 * En tant que visiteur, je veux consulter le détail d'un produit afin de
 * prendre une décision d'achat éclairée.
 *
 * Critères d'acceptation
 *  - Je peux accéder à une page dédiée pour chaque produit
 *  - Je vois une galerie d'images du produit
 *  - Je peux lire une description détaillée
 *  - Le prix est affiché clairement
 *  - Un bouton « Ajouter au panier » est présent
 *  - Je peux revenir facilement au catalogue
 *
 * Definition of Done
 *  - URL propre pour chaque produit (/produit/nom-produit)
 *  - Galerie d'images fonctionnelle (navigation entre les images)
 *  - Métadonnées pour le SEO
 *  - Retour vers la catégorie d'origine
 */
test.describe("US DEC-c — Détail d'un produit", () => {
  test.beforeEach(async ({ page }) => {
    // Les appels à l'API sont faits depuis la page : ils ont besoin d'une
    // origine, celle du site.
    await aller(page);
  });

  /**
   * Le premier produit du catalogue sert de référence à tous les tests :
   * c'est le même produit que celui affiché par la grille.
   *
   * @param {import("@playwright/test").Page} page
   */
  async function premierProduit(page) {
    const { statut, donnees } = await api(page, "produits?page=1");
    expect(statut).toBe(200);
    expect(donnees.produits.length).toBeGreaterThan(0);
    return donnees.produits[0];
  }

  test("CA — J'accède à une page dédiée pour chaque produit", async ({ page }) => {
    const { donnees } = await api(page, "produits?page=1");

    // Les trois premiers produits ont chacun leur propre page.
    for (const produit of donnees.produits.slice(0, 3)) {
      await aller(page, `produit/${produit.slug}`);
      await expect(page.getByRole("heading", { level: 1, name: produit.nom })).toBeVisible();
    }
  });

  test("CA — Je vois une galerie d'images du produit", async ({ page }) => {
    const produit = await premierProduit(page);
    const { donnees } = await api(page, `produits/${produit.slug}`);

    await aller(page, `produit/${produit.slug}`);

    // L'image principale est affichée et chargée.
    const principale = page.locator('[data-zone="principale"]');
    await expect(principale).toBeVisible();
    await attendreImage(principale);

    // Une miniature par image de la galerie.
    const miniatures = page.locator('[data-zone="miniatures"] button');
    await expect(miniatures).toHaveCount(donnees.galerie.length);
  });

  test("CA — Je peux lire une description détaillée", async ({ page }) => {
    const produit = await premierProduit(page);
    const { donnees } = await api(page, `produits/${produit.slug}`);

    await aller(page, `produit/${produit.slug}`);

    // La description de l'API est affichée dans la fiche.
    const paragraphes = await page.locator("main article p").allInnerTexts();
    expect(paragraphes.join(" ")).toContain(donnees.produit.description);
  });

  test("CA — Le prix est affiché clairement", async ({ page }) => {
    const produit = await premierProduit(page);

    await aller(page, `produit/${produit.slug}`);

    // Le prix est celui de la base, formaté en euros.
    const attendu = `${Number(produit.prix).toFixed(2).replace(".", ",")} €`;
    await expect(page.locator("main article").getByText(PRIX).first()).toHaveText(attendu);
  });

  test("CA — Un bouton « Ajouter au panier » est présent", async ({ page }) => {
    const produit = await premierProduit(page);

    await aller(page, `produit/${produit.slug}`);

    const bouton = page.locator('button[data-action="ajouter-panier"]');
    await expect(bouton).toBeVisible();
    await expect(bouton).toBeEnabled();
    await expect(bouton).toHaveText(/Ajouter au panier/i);

    // Le bouton fonctionne : le visiteur est prévenu de l'ajout.
    await bouton.click();
    await expect(page.locator('[data-zone="message"]')).toContainText(/ajouté au panier/i);
  });

  test("CA — Je peux revenir facilement au catalogue", async ({ page }) => {
    const produit = await premierProduit(page);

    await aller(page, `produit/${produit.slug}`);

    // Un lien de retour est proposé, et il ramène bien au catalogue.
    const retour = page.locator("main").getByRole("link", { name: /←\s*Tous les produits/ });
    await expect(retour).toBeVisible();

    await retour.click();
    await expect(page).toHaveURL(url());
    await expect(page.getByRole("heading", { level: 1, name: "Catalogue" })).toBeVisible();
  });

  test("DoD — L'URL du produit est propre", async ({ page }) => {
    const produit = await premierProduit(page);

    await aller(page, `produit/${produit.slug}`);

    // /produit/nom-produit : ni identifiant numérique, ni paramètre.
    await expect(page).toHaveURL(/\/produit\/[a-z0-9-]+$/);
    await expect(page).toHaveURL(url(`produit/${produit.slug}`));
  });

  test("DoD — La galerie d'images est fonctionnelle", async ({ page }) => {
    const produit = await premierProduit(page);
    const { donnees } = await api(page, `produits/${produit.slug}`);

    await aller(page, `produit/${produit.slug}`);

    const principale = page.locator('[data-zone="principale"]');
    const premiere = await principale.getAttribute("src");

    // La flèche « image suivante » change l'image affichée…
    await page.locator('[data-action="suivant"]').click();
    await expect(principale).not.toHaveAttribute("src", premiere ?? "");
    await expect(page.locator('[data-zone="index-image"]')).toHaveText("2");

    // …et la miniature affiche la même image que la grande.
    const miniatures = page.locator('[data-zone="miniatures"] button');
    await miniatures.nth(2).click();
    await expect(principale).toHaveAttribute("src", await miniatures.nth(2).locator("img").getAttribute("src") ?? "");

    // La flèche « image précédente » revient en arrière.
    await page.locator('[data-action="precedent"]').click();
    await expect(page.locator('[data-zone="index-image"]')).toHaveText("2");

    // Le nombre total d'images est annoncé.
    await expect(page.locator('[data-zone="total-images"]')).toHaveText(
      String(donnees.galerie.length)
    );
  });

  test("DoD — La page produit a des métadonnées pour le SEO", async ({ page }) => {
    const produit = await premierProduit(page);
    const { donnees } = await api(page, `produits/${produit.slug}`);

    await aller(page, `produit/${produit.slug}`);

    // Le titre de l'onglet porte le nom du produit.
    await expect(page).toHaveTitle(new RegExp(produit.nom.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

    // La description de la page.
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /\S{10,}/);

    // Les balisesOpen Graph, pour les partages sur les réseaux sociaux.
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /\S+/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "product");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      url(`produit/${produit.slug}`)
    );

    // L'adresse canonique : une seule adresse pour ce produit.
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      url(`produit/${produit.slug}`)
    );

    // L'image de partage est bien une image du produit.
    const imagePartage = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(imagePartage).toBeTruthy();
    expect(donnees.galerie.length).toBeGreaterThan(0);
  });

  test("DoD — Je peux revenir vers la catégorie d'origine", async ({ page }) => {
    const produit = await premierProduit(page);
    const { donnees } = await api(page, `produits/${produit.slug}`);
    const { donnees: categories } = await api(page, "categories");

    const categorie = categories.categories.find(
      (/** @type {any} */ c) => c.slug === donnees.produit.categorie.slug
    );
    expect(categorie).toBeTruthy();

    await aller(page, `produit/${produit.slug}`);

    // Le lien vers la catégorie du produit est proposé…
    const libelle = donnees.produit.categorie.libelle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const lienCategorie = page
      .locator("main")
      .getByRole("link", { name: new RegExp(`←\\s*${libelle}`) });
    await expect(lienCategorie).toBeVisible();

    // …et il ramène bien à la liste des produits de cette catégorie.
    await lienCategorie.click();
    await expect(page).toHaveURL(url(`categorie/${categorie.slug}`));
    await expect(page.locator("main article")).toHaveCount(categorie.nb_produits);
  });
});
