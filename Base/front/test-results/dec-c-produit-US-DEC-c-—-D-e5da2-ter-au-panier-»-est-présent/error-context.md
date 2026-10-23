# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dec-c-produit.spec.js >> US DEC-c — Détail d'un produit >> CA — Un bouton « Ajouter au panier » est présent
- Location: tests/dec-c-produit.spec.js:92:3

# Error details

```
Error: expect(locator).toBeEnabled() failed

Locator:  locator('button[data-action="ajouter-panier"]')
Expected: enabled
Received: disabled
Timeout:  5000ms

Call log:
  - Expect "toBeEnabled" locator('button[data-action="ajouter-panier"]') with timeout 5000ms
  - waiting for locator('button[data-action="ajouter-panier"]')
    14 × locator resolved to <button disabled type="button" data-action="ajouter-panier" class="flex h-11 w-full items-center justify-center rounded-md bg-action-primary-background px-4 text-14 font-medium text-action-primary-text transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">Épuisé</button>
       - unexpected value "disabled"

```

```yaml
- button "Épuisé" [disabled]
```

# Test source

```ts
  1   | // @ts-check
  2   | import { test, expect } from "@playwright/test";
  3   | import { aller, api, attendreImage, url, PRIX } from "./helpers.js";
  4   | 
  5   | /**
  6   |  * US DEC-c — Détail d'un produit
  7   |  *
  8   |  * En tant que visiteur, je veux consulter le détail d'un produit afin de
  9   |  * prendre une décision d'achat éclairée.
  10  |  *
  11  |  * Critères d'acceptation
  12  |  *  - Je peux accéder à une page dédiée pour chaque produit
  13  |  *  - Je vois une galerie d'images du produit
  14  |  *  - Je peux lire une description détaillée
  15  |  *  - Le prix est affiché clairement
  16  |  *  - Un bouton « Ajouter au panier » est présent
  17  |  *  - Je peux revenir facilement au catalogue
  18  |  *
  19  |  * Definition of Done
  20  |  *  - URL propre pour chaque produit (/produit/nom-produit)
  21  |  *  - Galerie d'images fonctionnelle (navigation entre les images)
  22  |  *  - Métadonnées pour le SEO
  23  |  *  - Retour vers la catégorie d'origine
  24  |  */
  25  | test.describe("US DEC-c — Détail d'un produit", () => {
  26  |   test.beforeEach(async ({ page }) => {
  27  |     // Les appels à l'API sont faits depuis la page : ils ont besoin d'une
  28  |     // origine, celle du site.
  29  |     await aller(page);
  30  |   });
  31  | 
  32  |   /**
  33  |    * Le premier produit du catalogue sert de référence à tous les tests :
  34  |    * c'est le même produit que celui affiché par la grille.
  35  |    *
  36  |    * @param {import("@playwright/test").Page} page
  37  |    */
  38  |   async function premierProduit(page) {
  39  |     const { statut, donnees } = await api(page, "produits?page=1");
  40  |     expect(statut).toBe(200);
  41  |     expect(donnees.produits.length).toBeGreaterThan(0);
  42  |     return donnees.produits[0];
  43  |   }
  44  | 
  45  |   test("CA — J'accède à une page dédiée pour chaque produit", async ({ page }) => {
  46  |     const { donnees } = await api(page, "produits?page=1");
  47  | 
  48  |     // Les trois premiers produits ont chacun leur propre page.
  49  |     for (const produit of donnees.produits.slice(0, 3)) {
  50  |       await aller(page, `produit/${produit.slug}`);
  51  |       await expect(page.getByRole("heading", { level: 1, name: produit.nom })).toBeVisible();
  52  |     }
  53  |   });
  54  | 
  55  |   test("CA — Je vois une galerie d'images du produit", async ({ page }) => {
  56  |     const produit = await premierProduit(page);
  57  |     const { donnees } = await api(page, `produits/${produit.slug}`);
  58  | 
  59  |     await aller(page, `produit/${produit.slug}`);
  60  | 
  61  |     // L'image principale est affichée et chargée.
  62  |     const principale = page.locator('[data-zone="principale"]');
  63  |     await expect(principale).toBeVisible();
  64  |     await attendreImage(principale);
  65  | 
  66  |     // Une miniature par image de la galerie.
  67  |     const miniatures = page.locator('[data-zone="miniatures"] button');
  68  |     await expect(miniatures).toHaveCount(donnees.galerie.length);
  69  |   });
  70  | 
  71  |   test("CA — Je peux lire une description détaillée", async ({ page }) => {
  72  |     const produit = await premierProduit(page);
  73  |     const { donnees } = await api(page, `produits/${produit.slug}`);
  74  | 
  75  |     await aller(page, `produit/${produit.slug}`);
  76  | 
  77  |     // La description de l'API est affichée dans la fiche.
  78  |     const paragraphes = await page.locator("main article p").allInnerTexts();
  79  |     expect(paragraphes.join(" ")).toContain(donnees.produit.description);
  80  |   });
  81  | 
  82  |   test("CA — Le prix est affiché clairement", async ({ page }) => {
  83  |     const produit = await premierProduit(page);
  84  | 
  85  |     await aller(page, `produit/${produit.slug}`);
  86  | 
  87  |     // Le prix est celui de la base, formaté en euros.
  88  |     const attendu = `${Number(produit.prix).toFixed(2).replace(".", ",")} €`;
  89  |     await expect(page.locator("main article").getByText(PRIX).first()).toHaveText(attendu);
  90  |   });
  91  | 
  92  |   test("CA — Un bouton « Ajouter au panier » est présent", async ({ page }) => {
  93  |     const produit = await premierProduit(page);
  94  | 
  95  |     await aller(page, `produit/${produit.slug}`);
  96  | 
  97  |     const bouton = page.locator('button[data-action="ajouter-panier"]');
  98  |     await expect(bouton).toBeVisible();
> 99  |     await expect(bouton).toBeEnabled();
      |                          ^ Error: expect(locator).toBeEnabled() failed
  100 |     await expect(bouton).toHaveText(/Ajouter au panier/i);
  101 | 
  102 |     // Le bouton fonctionne : le visiteur est prévenu de l'ajout.
  103 |     await bouton.click();
  104 |     await expect(page.locator('[data-zone="message"]')).toContainText(/ajouté au panier/i);
  105 |   });
  106 | 
  107 |   test("CA — Je peux revenir facilement au catalogue", async ({ page }) => {
  108 |     const produit = await premierProduit(page);
  109 | 
  110 |     await aller(page, `produit/${produit.slug}`);
  111 | 
  112 |     // Un lien de retour est proposé, et il ramène bien au catalogue.
  113 |     const retour = page.locator("main").getByRole("link", { name: /←\s*Tous les produits/ });
  114 |     await expect(retour).toBeVisible();
  115 | 
  116 |     await retour.click();
  117 |     await expect(page).toHaveURL(url());
  118 |     await expect(page.getByRole("heading", { level: 1, name: "Catalogue" })).toBeVisible();
  119 |   });
  120 | 
  121 |   test("DoD — L'URL du produit est propre", async ({ page }) => {
  122 |     const produit = await premierProduit(page);
  123 | 
  124 |     await aller(page, `produit/${produit.slug}`);
  125 | 
  126 |     // /produit/nom-produit : ni identifiant numérique, ni paramètre.
  127 |     await expect(page).toHaveURL(/\/produit\/[a-z0-9-]+$/);
  128 |     await expect(page).toHaveURL(url(`produit/${produit.slug}`));
  129 |   });
  130 | 
  131 |   test("DoD — La galerie d'images est fonctionnelle", async ({ page }) => {
  132 |     const produit = await premierProduit(page);
  133 |     const { donnees } = await api(page, `produits/${produit.slug}`);
  134 | 
  135 |     await aller(page, `produit/${produit.slug}`);
  136 | 
  137 |     const principale = page.locator('[data-zone="principale"]');
  138 |     const premiere = await principale.getAttribute("src");
  139 | 
  140 |     // La flèche « image suivante » change l'image affichée…
  141 |     await page.locator('[data-action="suivant"]').click();
  142 |     await expect(principale).not.toHaveAttribute("src", premiere ?? "");
  143 |     await expect(page.locator('[data-zone="index-image"]')).toHaveText("2");
  144 | 
  145 |     // …et la miniature affiche la même image que la grande.
  146 |     const miniatures = page.locator('[data-zone="miniatures"] button');
  147 |     await miniatures.nth(2).click();
  148 |     await expect(principale).toHaveAttribute("src", await miniatures.nth(2).locator("img").getAttribute("src") ?? "");
  149 | 
  150 |     // La flèche « image précédente » revient en arrière.
  151 |     await page.locator('[data-action="precedent"]').click();
  152 |     await expect(page.locator('[data-zone="index-image"]')).toHaveText("2");
  153 | 
  154 |     // Le nombre total d'images est annoncé.
  155 |     await expect(page.locator('[data-zone="total-images"]')).toHaveText(
  156 |       String(donnees.galerie.length)
  157 |     );
  158 |   });
  159 | 
  160 |   test("DoD — La page produit a des métadonnées pour le SEO", async ({ page }) => {
  161 |     const produit = await premierProduit(page);
  162 |     const { donnees } = await api(page, `produits/${produit.slug}`);
  163 | 
  164 |     await aller(page, `produit/${produit.slug}`);
  165 | 
  166 |     // Le titre de l'onglet porte le nom du produit.
  167 |     await expect(page).toHaveTitle(new RegExp(produit.nom.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  168 | 
  169 |     // La description de la page.
  170 |     const description = page.locator('meta[name="description"]');
  171 |     await expect(description).toHaveAttribute("content", /\S{10,}/);
  172 | 
  173 |     // Les balisesOpen Graph, pour les partages sur les réseaux sociaux.
  174 |     await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /\S+/);
  175 |     await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "product");
  176 |     await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
  177 |       "content",
  178 |       url(`produit/${produit.slug}`)
  179 |     );
  180 | 
  181 |     // L'adresse canonique : une seule adresse pour ce produit.
  182 |     await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
  183 |       "href",
  184 |       url(`produit/${produit.slug}`)
  185 |     );
  186 | 
  187 |     // L'image de partage est bien une image du produit.
  188 |     const imagePartage = await page.locator('meta[property="og:image"]').getAttribute("content");
  189 |     expect(imagePartage).toBeTruthy();
  190 |     expect(donnees.galerie.length).toBeGreaterThan(0);
  191 |   });
  192 | 
  193 |   test("DoD — Je peux revenir vers la catégorie d'origine", async ({ page }) => {
  194 |     const produit = await premierProduit(page);
  195 |     const { donnees } = await api(page, `produits/${produit.slug}`);
  196 |     const { donnees: categories } = await api(page, "categories");
  197 | 
  198 |     const categorie = categories.categories.find(
  199 |       (/** @type {any} */ c) => c.slug === donnees.produit.categorie.slug
```