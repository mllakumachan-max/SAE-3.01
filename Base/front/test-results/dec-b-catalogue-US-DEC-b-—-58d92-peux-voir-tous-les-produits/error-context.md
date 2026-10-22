# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dec-b-catalogue.spec.js >> US DEC-b — Catalogue de produits >> CA — Je peux voir tous les produits
- Location: tests/dec-b-catalogue.spec.js:29:3

# Error details

```
Error: locator.click: Test ended.
Call log:
  - waiting for locator('[data-action="suivante"]')
    - locator resolved to <button type="button" data-action="suivante" class="h-9 rounded-md border px-4 text-14 font-medium transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent border-border-default">↵    Suivant↵  </button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 100ms
    - waiting for element to be visible, enabled and stable

```

# Test source

```ts
  1   | // @ts-check
  2   | import { test, expect } from "@playwright/test";
  3   | import { aller, api, cartes, attendreImage, url, PRIX } from "./helpers.js";
  4   | 
  5   | /**
  6   |  * US DEC-b — Catalogue de produits
  7   |  *
  8   |  * En tant que visiteur, je veux consulter le catalogue de produits afin de
  9   |  * découvrir l'offre disponible.
  10  |  *
  11  |  * Critères d'acceptation
  12  |  *  - Je peux voir tous les produits
  13  |  *  - Chaque produit affiche : nom, prix, image principale
  14  |  *  - La page se charge en moins de 3 secondes
  15  |  *
  16  |  * Definition of Done
  17  |  *  - Base de données initialisée avec les produits de test (au moins
  18  |  *    3 catégories de 4 produits)
  19  |  *
  20  |  * Chaque test porte le nom de la règle qu'il vérifie : « CA » pour un critère
  21  |  * d'acceptation, « DoD » pour la définition de Done.
  22  |  */
  23  | test.describe("US DEC-b — Catalogue de produits", () => {
  24  |   test.beforeEach(async ({ page }) => {
  25  |     await aller(page);
  26  |     await expect(page.getByRole("heading", { level: 1, name: "Catalogue" })).toBeVisible();
  27  |   });
  28  | 
  29  |   test("CA — Je peux voir tous les produits", async ({ page }) => {
  30  |     // Référence : ce que l'API compte réellement.
  31  |     const { statut, donnees } = await api(page, "produits?page=1");
  32  |     expect(statut).toBe(200);
  33  | 
  34  |     const total = donnees.total;
  35  |     const parPage = donnees.parPage;
  36  |     expect(total).toBeGreaterThan(0);
  37  | 
  38  |     // La première page affiche une page complète de produits.
  39  |     await expect(cartes(page)).toHaveCount(Math.min(total, parPage));
  40  | 
  41  |     // On parcourt toutes les pages du catalogue : chaque produit doit être
  42  |     // rencontré une fois, et une seule.
  43  |     let vus = 0;
  44  |     let pageCourante = 1;
  45  | 
  46  |     for (; pageCourante <= 20; pageCourante++) {
  47  |       await expect(page.getByText(new RegExp(`^Page ${pageCourante} sur `))).toBeVisible();
  48  |       vus += await cartes(page).count();
  49  | 
  50  |       const suivant = page.locator('[data-action="suivante"]');
  51  |       if (await suivant.isDisabled()) break;
> 52  |       await suivant.click();
      |                     ^ Error: locator.click: Test ended.
  53  |     }
  54  | 
  55  |     expect(vus).toBe(total);
  56  |   });
  57  | 
  58  |   test("CA — Chaque produit affiche nom, prix et image principale", async ({ page }) => {
  59  |     const nb = await cartes(page).count();
  60  |     expect(nb).toBeGreaterThan(0);
  61  | 
  62  |     for (let i = 0; i < nb; i++) {
  63  |       const carte = cartes(page).nth(i);
  64  | 
  65  |       // Nom : un titre, non vide.
  66  |       const nom = (await carte.locator("h2").innerText()).trim();
  67  |       expect(nom.length).toBeGreaterThan(0);
  68  | 
  69  |       // Prix : un montant en euros, bien mis en forme.
  70  |       const prix = carte.getByText(PRIX);
  71  |       await expect(prix).toHaveCount(1);
  72  |       await expect(prix).toBeVisible();
  73  | 
  74  |       // Image principale : présente, et réellement chargée (et non un lien
  75  |       // cassé que le navigateur afficherait quand même).
  76  |       const image = carte.locator("img").first();
  77  |       await expect(image).toHaveAttribute("src", /\S+/);
  78  |       await attendreImage(image);
  79  |     }
  80  |   });
  81  | 
  82  |   test("CA — La page se charge en moins de 3 secondes", async ({ page, context }) => {
  83  |     // La première visite sert à amorcer le serveur de développement (Vite
  84  |     // optimise ses dépendances) et à remplir le cache du navigateur : on
  85  |     // mesure la visite suivante, celle d'un visiteur qui revient.
  86  |     await page.goto(url());
  87  | 
  88  |     const pageMesure = await context.newPage();
  89  |     const debut = Date.now();
  90  | 
  91  |     await pageMesure.goto(url());
  92  |     await expect(pageMesure.locator("main article").first()).toBeVisible();
  93  | 
  94  |     const duree = Date.now() - debut;
  95  |     await pageMesure.close();
  96  | 
  97  |     expect(duree).toBeLessThan(3000);
  98  |   });
  99  | 
  100 |   test("DoD — La base contient au moins 3 catégories de 4 produits", async ({ page }) => {
  101 |     const { statut, donnees } = await api(page, "categories");
  102 |     expect(statut).toBe(200);
  103 | 
  104 |     const categories = donnees.categories;
  105 |     expect(categories.length).toBeGreaterThanOrEqual(3);
  106 | 
  107 |     // Au moins trois catégories doivent compter au moins quatre produits.
  108 |     const categoriesPeuplees = categories.filter((/** @type {any} */ c) => c.nb_produits >= 4);
  109 |     expect(categoriesPeuplees.length).toBeGreaterThanOrEqual(3);
  110 | 
  111 |     // Et ces produits sont bien visibles dans le catalogue.
  112 |     for (const categorie of categoriesPeuplees) {
  113 |       const produits = await api(page, `produits?page=1&categorie=${categorie.slug}`);
  114 |       expect(produits.statut).toBe(200);
  115 |       expect(produits.donnees.total).toBeGreaterThanOrEqual(4);
  116 |     }
  117 |   });
  118 | });
  119 | 
```