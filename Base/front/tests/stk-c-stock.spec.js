// @ts-check
import { test, expect } from "@playwright/test";
import { aller, api } from "./helpers.js";

/**
 * US STK-c — Contraintes de stock
 *
 * En tant que client, je veux être limité par les stocks disponibles afin
 * d'éviter les commandes impossibles.
 *
 * Critères d'acceptation
 *  - Je ne peux pas ajouter un produit épuisé au panier
 *  - La quantité maximum est limitée au stock disponible
 *  - Je reçois des messages d'erreur clairs en cas de dépassement
 *  - Les quantités de mon panier s'ajustent automatiquement si nécessaire
 *  - La vérification se fait avant chaque ajout au panier et à la validation
 *    de la commande
 *  - Si les produits ont des variantes, les contraintes s'appliquent par
 *    variante (ici : par produit, identifié par son id)
 *
 * Definition of Done spécifique
 *  - Vérification côté client et côté serveur
 *  - Gestion des cas limites (stock modifié pendant la session)
 *  - Tests avec différents scénarios de stock
 */

/**
 * Produits utilisés pour les tests, avec leur stock de test (sae301.sql).
 */
const PRODUITS_TESTS = [
  { slug: "kit-nettoyage-ecrans-lab31", stock: 0, libelle: "épuisé" },
  { slug: "cable-donnees-silicone-2m", stock: 1, libelle: "stock 1" },
  { slug: "enceinte-bluetooth-fresh-n-rebel", stock: 2, libelle: "stock 2" },
  { slug: "support-ordinateur-mdf", stock: 10, libelle: "stock 10" },
  { slug: "boitier-synchro-led-tv", stock: 50, libelle: "stock 50" },
];

/**
 * Identifiant d'un produit de test, lu depuis l'API.
 */
async function idProduit(page, slug) {
  const { donnees } = await api(page, "produits?page=1&parPage=100");
  const produit = donnees.produits.find((p) => p.slug === slug);
  if (!produit) {
    throw new Error(`Produit ${slug} introuvable dans le catalogue (page 1).`);
  }
  return produit.id;
}

test.describe("US STK-c — Contraintes de stock", () => {
  test.beforeEach(async ({ page }) => {
    await aller(page);
  });

  test("CA — Je ne peux pas ajouter un produit épuisé au panier", async ({ page }) => {
    const { slug } = PRODUITS_TESTS[0]; // stock = 0

    await aller(page, `produit/${slug}`);
    const bouton = page.locator('[data-action="ajouter-panier"]');
    await expect(bouton).toBeDisabled();
    await expect(bouton).toHaveText("Épuisé");

    const compteur = page.locator('[data-role="compteur-panier"]');
    await expect(compteur).toHaveText("0");
  });

  test("CA — La quantité maximum est limitée au stock disponible", async ({ page }) => {
    for (const { slug, stock } of PRODUITS_TESTS) {
      await aller(page, `produit/${slug}`);

      const input = page.locator('input[name="quantite"]');
      await expect(input).toHaveAttribute("max", String(stock));

      const boutonPlus = page.locator('[data-action="plus"]');
      for (let i = 0; i < 10; i++) {
        await boutonPlus.click();
      }

      await expect(input).toHaveValue(String(Math.max(1, stock)));
    }
  });

  test("CA — Je reçois un message d'erreur clair en cas de dépassement", async ({ page }) => {
    const { slug, stock } = PRODUITS_TESTS[2]; // stock = 2
    const id = await idProduit(page, slug);

    await aller(page, `produit/${slug}`);

    // 1er ajout : 1 article, accepté.
    await page.locator('[data-action="ajouter-panier"]').click();
    expect(page.locator('[data-role="compteur-panier"]')).toHaveText("1");

    // 2e ajout : 2 articles supplémentaires → total 3 > stock 2, refusé/ajusté.
    await page.locator('input[name="quantite"]').fill("2");
    await page.locator('[data-action="ajouter-panier"]').click();

    const message = page.locator('[data-zone="message"]');
    await expect(message).toContainText("2 maximum");
    await expect(message).toContainText("ajustée");

    // Le panier ne dépasse pas le stock disponible.
    expect(page.locator('[data-role="compteur-panier"]')).toHaveText("2");
  });

  test("CA — La vérification côté serveur est appelée avant chaque ajout au panier", async ({ page }) => {
    const slug = PRODUITS_TESTS[3].slug; // stock = 10
    const id = await idProduit(page, slug);

    let requeteInterceptee = null;
    await page.route("**/api/panier/verifier-stock", async (route) => {
      const body = route.request().postDataJSON();
      requeteInterceptee = body;
      await route.fulfill({
        json: {
          valide: true,
          lignes: [
            {
              id,
              nom: "Produit test",
              stock: 10,
              quantiteDemandee: body?.lignes?.[0]?.quantite ?? 1,
              quantiteMax: 10,
              estValide: true,
              message: null,
            },
          ],
        },
      });
    });

    await aller(page, `produit/${slug}`);
    await page.locator('[data-action="ajouter-panier"]').click();

    expect(requeteInterceptee).not.toBeNull();
    expect(requeteInterceptee.lignes[0].id).toBe(id);
    expect(typeof requeteInterceptee.lignes[0].quantite).toBe("number");
  });

  test("CA — Les quantités du panier s'ajustent automatiquement si le stock baisse", async ({ page }) => {
    const slug = PRODUITS_TESTS[2].slug; // stock = 2
    const id = await idProduit(page, slug);

    // On met un article au panier.
    await aller(page, `produit/${slug}`);
    await page.locator('[data-action="ajouter-panier"]').click();

    // On simule une baisse de stock pendant la session : le serveur dit que le
    // produit est désormais épuisé.
    await page.route("**/api/panier/verifier-stock", async (route) => {
      await routeFulfillEpuise(route, id);
    });

    await aller(page, "panier");

    const ligne = page.locator('[data-zone="lignes"] li');
    await expect(ligne).toHaveCount(0);
    expect(page.locator('[data-role="compteur-panier"]')).toHaveText("0");

    const message = page.locator('[data-zone="message"]');
    await expect(message).toContainText("épuisé");
  });

  test("CA — La vérification se fait aussi à la validation de la commande", async ({ page }) => {
    const slug = PRODUITS_TESTS[3].slug; // stock = 10
    const id = await idProduit(page, slug);

    // Remplissage direct du panier (contourne l'ajout, pour isoler la validation).
    await page.evaluate(
      ([id]) => {
        window.localStorage.setItem(
          "sae301:panier",
          JSON.stringify([
            {
              id,
              slug,
              nom: "Produit de test",
              prix: 19.95,
              quantite: 2,
              stock: 10,
              src: "",
            },
          ])
        );
      },
      [id]
    );

    let appels = 0;
    await page.route("**/api/panier/verifier-stock", async (route) => {
      appels++;
      if (appels === 1) {
        // Chargement du panier : stock OK, la ligne s'affiche.
        await route.fulfill({
          json: {
            valide: true,
            lignes: [
              {
                id,
                nom: "Produit de test",
                stock: 10,
                quantiteDemandee: 2,
                quantiteMax: 10,
                estValide: true,
                message: null,
              },
            ],
          },
        });
        return;
      }

      // Validation de la commande : le stock a chuté à 0, la commande est bloquée.
      await route.fulfill({
        json: {
          valide: false,
          lignes: [
            {
              id,
              nom: "Produit de test",
              stock: 0,
              quantiteDemandee: 2,
              quantiteMax: 0,
              estValide: false,
              message: "Ce produit est épuisé.",
            },
          ],
        },
      });
    });

    await aller(page, "panier");
    await expect(page.locator('[data-zone="lignes"] li')).toHaveCount(1);

    await page.locator('[data-action="valider"]').click();

    // La commande n'a pas été validée : le panier est toujours là.
    await expect(page.locator('[data-zone="lignes"] li')).toHaveCount(0);
    expect(page.locator('[data-role="compteur-panier"]')).toHaveText("0");

    const message = page.locator('[data-zone="message"]');
    await expect(message).toContainText("épuisé");
  });

  test("DoD — Vérification côté client et côté serveur", async ({ page }) => {
    const { slug, stock } = PRODUITS_TESTS[1]; // stock = 1
    const id = await idProduit(page, slug);

    // Côté client : borne le contrôle de quantité (max = stock).
    await aller(page, `produit/${slug}`);
    await expect(page.locator('input[name="quantite"]')).toHaveAttribute("max", String(stock));

    // Côté serveur : l'API de vérification est appelée à l'ajout.
    let verifieParServeur = false;
    await page.route("**/api/panier/verifier-stock", async (route) => {
      verifieParServeur = true;
      await route.fulfill({
        json: {
          valide: true,
          lignes: [{ id, stock, quantiteDemandee: 1, quantiteMax: stock, estValide: true, message: null }],
        },
      });
    });

    await page.locator('[data-action="ajouter-panier"]').click();
    expect(verifieParServeur).toBe(true);
  });

  test("DoD — Tests avec différents scénarios de stock", async ({ page }) => {
    for (const { slug, stock, libelle } of PRODUITS_TESTS) {
      await aller(page, `produit/${slug}`);
      const bouton = page.locator('[data-action="ajouter-panier"]');
      const input = page.locator('input[name="quantite"]');

      if (stock <= 0) {
        await expect(bouton).toBeDisabled();
        await expect(bouton).toHaveText("Épuisé");
      } else {
        await expect(bouton).not.toBeDisabled();
        await expect(input).toHaveAttribute("max", String(stock));
      }
    }
  });
});

/**
 * Répond que le produit donné est épuisé (stock 0).
 *
 * @param {import("@playwright/test").Route} route
 * @param {number|string} id
 */
async function routeFulfillEpuise(route, id) {
  await route.fulfill({
    json: {
      valide: false,
      lignes: [
        {
          id,
          stock: 0,
          quantiteDemandee: 1,
          quantiteMax: 0,
          estValide: false,
          message: "Ce produit est épuisé.",
        },
      ],
    },
  });
}
