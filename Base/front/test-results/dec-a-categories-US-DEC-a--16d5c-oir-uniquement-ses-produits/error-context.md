# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dec-a-categories.spec.js >> US DEC-a — Navigation par catégories >> CA — Je peux cliquer sur une catégorie pour voir uniquement ses produits
- Location: tests/dec-a-categories.spec.js:53:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 23
Received: 12
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - figure [ref=e5]:
      - generic [ref=e6]:
        - link "Logo de l'application Click & Collect" [ref=e7] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/
          - img "Logo de l'application" [ref=e8]
          - generic [ref=e9]: Click & Collect
        - generic [ref=e10]:
          - button "Changer de thème" [ref=e11] [cursor=pointer]
          - link "Mon compte" [ref=e14] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/compte
          - link "Panier 0" [ref=e18] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/panier
            - generic [ref=e21]: Panier
            - generic [ref=e22]: "0"
      - navigation [ref=e24]:
        - link "Tous les produits" [ref=e25] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/
        - link "Multimédia 23" [ref=e26] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/multimedia
          - generic [ref=e27]: Multimédia
          - generic [ref=e28]: "23"
        - link "Habitat 24" [ref=e29] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/habitat
          - generic [ref=e30]: Habitat
          - generic [ref=e31]: "24"
        - link "Hobby 25" [ref=e32] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/hobby
          - generic [ref=e33]: Hobby
          - generic [ref=e34]: "25"
        - link "Bricolage 25" [ref=e35] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/bricolage
          - generic [ref=e36]: Bricolage
          - generic [ref=e37]: "25"
  - main [ref=e38]:
    - generic [ref=e39]:
      - navigation "Fil d'Ariane" [ref=e40]:
        - list [ref=e41]:
          - listitem [ref=e42]:
            - link "Catalogue" [ref=e43] [cursor=pointer]:
              - /url: /~ribatet1/SAE-3.01/Base/
            - generic [aria-hidden] [ref=e44]: /
          - listitem [ref=e45]:
            - generic [ref=e46]: Multimédia
      - heading "Catalogue" [level=1] [ref=e47]
      - generic [ref=e48]:
        - generic [ref=e49]:
          - text: Trier par
          - combobox "Trier par" [ref=e50]:
            - option "Nom (A → Z)" [selected]
            - option "Prix (croissant)"
        - generic [ref=e51]:
          - text: Produits par page
          - combobox "Produits par page" [ref=e52]:
            - option "12 produits" [selected]
            - option "24 produits"
            - option "48 produits"
        - generic [ref=e53]: 23 produits
      - generic [ref=e54]:
        - article [ref=e55]:
          - link [ref=e56] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/repeteur-wifi-750
            - figure "Amplificateur Wi-Fi 19,95 € Épuisé" [ref=e57]:
              - img "Amplificateur Wi-Fi" [ref=e59]
              - generic [ref=e60]:
                - heading "Amplificateur Wi-Fi" [level=2] [ref=e61]
                - generic [ref=e62]:
                  - generic [ref=e63]: 19,95 €
                  - generic [ref=e64]: Épuisé
          - button "Épuisé" [disabled] [ref=e68]
        - article [ref=e69]:
          - link [ref=e70] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/tracker-bluetooth-cles
            - figure "Balise Smartfinder 6,95 € Épuisé" [ref=e71]:
              - img "Balise Smartfinder" [ref=e73]
              - generic [ref=e74]:
                - heading "Balise Smartfinder" [level=2] [ref=e75]
                - generic [ref=e76]:
                  - generic [ref=e77]: 6,95 €
                  - generic [ref=e78]: Épuisé
          - button "Épuisé" [disabled] [ref=e82]
        - article [ref=e83]:
          - link [ref=e84] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/barre-son-tv-40w
            - figure "Barre de son TV 24,95 € Épuisé" [ref=e85]:
              - img "Barre de son TV" [ref=e87]
              - generic [ref=e88]:
                - heading "Barre de son TV" [level=2] [ref=e89]
                - generic [ref=e90]:
                  - generic [ref=e91]: 24,95 €
                  - generic [ref=e92]: Épuisé
          - button "Épuisé" [disabled] [ref=e96]
        - article [ref=e97]:
          - link [ref=e98] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/batterie-haute-capacite-20000
            - figure "Batterie externe 20000 mAh 18,95 € Épuisé" [ref=e99]:
              - img "Batterie externe 20000 mAh" [ref=e101]
              - generic [ref=e102]:
                - heading "Batterie externe 20000 mAh" [level=2] [ref=e103]
                - generic [ref=e104]:
                  - generic [ref=e105]: 18,95 €
                  - generic [ref=e106]: Épuisé
          - button "Épuisé" [disabled] [ref=e110]
        - article [ref=e111]:
          - link [ref=e112] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/powerbank-5000mah
            - figure "Batterie externe 5000 mAh 6,27 € Épuisé" [ref=e113]:
              - img "Batterie externe 5000 mAh" [ref=e115]
              - generic [ref=e116]:
                - heading "Batterie externe 5000 mAh" [level=2] [ref=e117]
                - generic [ref=e118]:
                  - generic [ref=e119]: 6,27 €
                  - generic [ref=e120]: Épuisé
          - button "Épuisé" [disabled] [ref=e124]
        - article [ref=e125]:
          - link [ref=e126] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/boitier-synchro-led-tv
            - figure "Boîtier de synchronisation HDMI 34,95 € En stock" [ref=e127]:
              - img "Boîtier de synchronisation HDMI" [ref=e129]
              - generic [ref=e130]:
                - heading "Boîtier de synchronisation HDMI" [level=2] [ref=e131]
                - generic [ref=e132]:
                  - generic [ref=e133]: 34,95 €
                  - generic [ref=e134]: En stock
          - button "Ajouter au panier" [ref=e138] [cursor=pointer]
        - article [ref=e139]:
          - link [ref=e140] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/cable-charge-multi-3en1
            - figure "Câble de charge 3-en-1 6,97 € Épuisé" [ref=e141]:
              - img "Câble de charge 3-en-1" [ref=e143]
              - generic [ref=e144]:
                - heading "Câble de charge 3-en-1" [level=2] [ref=e145]
                - generic [ref=e146]:
                  - generic [ref=e147]: 6,97 €
                  - generic [ref=e148]: Épuisé
          - button "Épuisé" [disabled] [ref=e152]
        - article [ref=e153]:
          - link [ref=e154] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/cable-enrouleur-100w
            - figure "Câble de charge rétractable 4,99 € Épuisé" [ref=e155]:
              - img "Câble de charge rétractable" [ref=e157]
              - generic [ref=e158]:
                - heading "Câble de charge rétractable" [level=2] [ref=e159]
                - generic [ref=e160]:
                  - generic [ref=e161]: 4,99 €
                  - generic [ref=e162]: Épuisé
          - button "Épuisé" [disabled] [ref=e166]
        - article [ref=e167]:
          - link [ref=e168] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/cable-donnees-silicone-2m
            - figure "Câble de données en silicone 4,95 € Bientôt épuisé" [ref=e169]:
              - img "Câble de données en silicone" [ref=e171]
              - generic [ref=e172]:
                - heading "Câble de données en silicone" [level=2] [ref=e173]
                - generic [ref=e174]:
                  - generic [ref=e175]: 4,95 €
                  - generic [ref=e176]: Bientôt épuisé
          - button "Ajouter au panier" [ref=e180] [cursor=pointer]
        - article [ref=e181]:
          - link [ref=e182] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/cable-hdmi-4k-sitecom
            - figure "Câble HDMI 4K 2,99 € Épuisé" [ref=e183]:
              - img "Câble HDMI 4K" [ref=e185]
              - generic [ref=e186]:
                - heading "Câble HDMI 4K" [level=2] [ref=e187]
                - generic [ref=e188]:
                  - generic [ref=e189]: 2,99 €
                  - generic [ref=e190]: Épuisé
          - button "Épuisé" [disabled] [ref=e194]
        - article [ref=e195]:
          - link [ref=e196] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/chargeur-allume-cigare-75w
            - figure "Chargeur de voiture 5 ports 9,95 € Épuisé" [ref=e197]:
              - img "Chargeur de voiture 5 ports" [ref=e199]
              - generic [ref=e200]:
                - heading "Chargeur de voiture 5 ports" [level=2] [ref=e201]
                - generic [ref=e202]:
                  - generic [ref=e203]: 9,95 €
                  - generic [ref=e204]: Épuisé
          - button "Épuisé" [disabled] [ref=e208]
        - article [ref=e209]:
          - link [ref=e210] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/chargeur-magsafe-sans-fil
            - figure "Chargeur magnétique sans fil 8,95 € Épuisé" [ref=e211]:
              - img "Chargeur magnétique sans fil" [ref=e213]
              - generic [ref=e214]:
                - heading "Chargeur magnétique sans fil" [level=2] [ref=e215]
                - generic [ref=e216]:
                  - generic [ref=e217]: 8,95 €
                  - generic [ref=e218]: Épuisé
          - button "Épuisé" [disabled] [ref=e222]
      - navigation [ref=e223]:
        - button "Précédent" [disabled] [ref=e224]
        - generic [ref=e225]: Page 1 sur 2
        - button "Suivant" [ref=e226] [cursor=pointer]
```

# Test source

```ts
  1   | // @ts-check
  2   | import { test, expect } from "@playwright/test";
  3   | import { aller, api, cartes, menuCategories, url } from "./helpers.js";
  4   | 
  5   | /**
  6   |  * US DEC-a — Navigation par catégories
  7   |  *
  8   |  * En tant que visiteur, je veux filtrer les produits par catégorie afin de
  9   |  * trouver plus facilement ce qui m'intéresse.
  10  |  *
  11  |  * Critères d'acceptation
  12  |  *  - Je vois un menu de navigation avec les catégories
  13  |  *  - Je peux cliquer sur une catégorie pour voir uniquement ses produits
  14  |  *  - Le nombre de produits par catégorie est affiché
  15  |  *  - Un bouton « Tous les produits » me permet de réinitialiser le filtre
  16  |  *  - L'URL change selon la catégorie sélectionnée
  17  |  *
  18  |  * Definition of Done
  19  |  *  - Filtrage fonctionnel (en JavaScript ou par rechargement de la page)
  20  |  *  - URLs propres (/categorie/nom-categorie)
  21  |  *  - Fil d'Ariane ou indication visuelle de la catégorie active
  22  |  */
  23  | test.describe("US DEC-a — Navigation par catégories", () => {
  24  |   test.beforeEach(async ({ page }) => {
  25  |     await aller(page);
  26  |   });
  27  | 
  28  |   test("CA — Je vois un menu de navigation avec les catégories", async ({ page }) => {
  29  |     const { statut, donnees } = await api(page, "categories");
  30  |     expect(statut).toBe(200);
  31  | 
  32  |     const menu = menuCategories(page);
  33  | 
  34  |     // Le menu propose toutes les catégories du catalogue…
  35  |     for (const categorie of donnees.categories) {
  36  |       await expect(menu.locator(`a[href$="/categorie/${categorie.slug}"]`)).toBeVisible();
  37  |       await expect(menu.getByRole("link", { name: new RegExp(categorie.libelle) })).toBeVisible();
  38  |     }
  39  | 
  40  |     // …et le lien qui remet le filtre à zéro.
  41  |     await expect(menu.getByRole("link", { name: "Tous les produits" })).toBeVisible();
  42  |   });
  43  | 
  44  |   test("CA — Le nombre de produits par catégorie est affiché", async ({ page }) => {
  45  |     const { donnees } = await api(page, "categories");
  46  | 
  47  |     for (const categorie of donnees.categories) {
  48  |       const lien = menuCategories(page).locator(`a[href$="/categorie/${categorie.slug}"]`);
  49  |       await expect(lien).toContainText(String(categorie.nb_produits));
  50  |     }
  51  |   });
  52  | 
  53  |   test("CA — Je peux cliquer sur une catégorie pour voir uniquement ses produits", async ({ page }) => {
  54  |     const { donnees: categories } = await api(page, "categories");
  55  |     const categorie = categories.categories.find((/** @type {any} */ c) => c.nb_produits > 0);
  56  |     expect(categorie).toBeTruthy();
  57  | 
  58  |     await menuCategories(page).locator(`a[href$="/categorie/${categorie.slug}"]`).click();
  59  | 
  60  |     // Référence : la liste que l'API renvoie pour cette catégorie.
  61  |     const { statut, donnees } = await api(page, `produits?page=1&categorie=${categorie.slug}`);
  62  |     expect(statut).toBe(200);
  63  | 
  64  |     // La grille affiche exactement les produits de la catégorie, et rien
  65  |     // d'autre.
  66  |     const affiches = await cartes(page).locator("h2").allInnerTexts();
  67  |     const attendus = donnees.produits.map((/** @type {any} */ p) => p.nom);
  68  | 
  69  |     expect(affiches.sort()).toEqual(attendus.sort());
> 70  |     expect(affiches.length).toBe(categorie.nb_produits);
      |                             ^ Error: expect(received).toBe(expected) // Object.is equality
  71  |   });
  72  | 
  73  |   test("CA — L'URL change selon la catégorie sélectionnée", async ({ page }) => {
  74  |     const { donnees } = await api(page, "categories");
  75  |     const avecProduits = donnees.categories.filter((/** @type {any} */ c) => c.nb_produits > 0);
  76  |     expect(avecProduits.length).toBeGreaterThan(1);
  77  | 
  78  |     const premiere = avecProduits[0];
  79  |     const seconde = avecProduits[1];
  80  | 
  81  |     // On clique la première catégorie : l'adresse la désigne.
  82  |     await menuCategories(page).locator(`a[href$="/categorie/${premiere.slug}"]`).click();
  83  |     await expect(page).toHaveURL(url(`categorie/${premiere.slug}`));
  84  | 
  85  |     // Puis la seconde : l'adresse change encore.
  86  |     await menuCategories(page).locator(`a[href$="/categorie/${seconde.slug}"]`).click();
  87  |     await expect(page).toHaveURL(url(`categorie/${seconde.slug}`));
  88  |     await expect(page).not.toHaveURL(url(`categorie/${premiere.slug}`));
  89  |   });
  90  | 
  91  |   test("CA — « Tous les produits » réinitialise le filtre", async ({ page }) => {
  92  |     const { donnees: categories } = await api(page, "categories");
  93  |     const categorie = categories.categories.find((/** @type {any} */ c) => c.nb_produits > 0);
  94  | 
  95  |     await menuCategories(page).locator(`a[href$="/categorie/${categorie.slug}"]`).click();
  96  |     await expect(page).toHaveURL(url(`categorie/${categorie.slug}`));
  97  | 
  98  |     // Le bouton « Tous les produits » remet le filtre à zéro…
  99  |     await menuCategories(page).getByRole("link", { name: "Tous les produits" }).click();
  100 | 
  101 |     // …l'adresse revient à la racine du site…
  102 |     await expect(page).toHaveURL(url());
  103 | 
  104 |     // …et le catalogue complet réapparaît.
  105 |     const { donnees } = await api(page, "produits?page=1");
  106 |     const affiches = await cartes(page).locator("h2").allInnerTexts();
  107 |     expect(affiches.length).toBe(Math.min(donnees.total, donnees.parPage));
  108 |   });
  109 | 
  110 |   test("DoD — Le filtrage fonctionne sans recharger toute la page", async ({ page }) => {
  111 |     const { donnees } = await api(page, "categories");
  112 |     const categorie = donnees.categories.find((/** @type {any} */ c) => c.nb_produits > 0);
  113 | 
  114 |     // On marque la page : si le navigateur rechargeait le document, ce
  115 |     // marqueur disparaîtrait.
  116 |     await page.evaluate(() => {
  117 |       // @ts-ignore
  118 |       window.__marqueur = "vivant";
  119 |     });
  120 | 
  121 |     await menuCategories(page).locator(`a[href$="/categorie/${categorie.slug}"]`).click();
  122 |     await expect(page).toHaveURL(url(`categorie/${categorie.slug}`));
  123 | 
  124 |     // Le marqueur a survécu : la page n'a pas été rechargée, le filtrage a
  125 |     // été fait en JavaScript.
  126 |     expect(await page.evaluate(() => window.__marqueur)).toBe("vivant");
  127 |   });
  128 | 
  129 |   test("DoD — Les URLs de catégorie sont propres", async ({ page }) => {
  130 |     const { donnees } = await api(page, "categories");
  131 |     const categorie = donnees.categories.find((/** @type {any} */ c) => c.nb_produits > 0);
  132 | 
  133 |     await menuCategories(page).locator(`a[href$="/categorie/${categorie.slug}"]`).click();
  134 | 
  135 |     // L'adresse est bien /categorie/nom-categorie, sans paramètre parasite.
  136 |     await expect(page).toHaveURL(/\/categorie\/[a-z0-9-]+$/);
  137 | 
  138 |     // Et l'adresse fonctionne ouverte directement (un lien partagé).
  139 |     await aller(page, `categorie/${categorie.slug}`);
  140 |     await expect(cartes(page)).toHaveCount(categorie.nb_produits);
  141 |   });
  142 | 
  143 |   test("DoD — La catégorie active est signalée (fil d'Ariane et menu)", async ({ page }) => {
  144 |     const { donnees } = await api(page, "categories");
  145 |     const categorie = donnees.categories.find((/** @type {any} */ c) => c.nb_produits > 0);
  146 | 
  147 |     await menuCategories(page).locator(`a[href$="/categorie/${categorie.slug}"]`).click();
  148 | 
  149 |     // Fil d'Ariane : la catégorie est le dernier élément, donc la page
  150 |     // courante.
  151 |     const fil = page.locator('nav[aria-label="Fil d\'Ariane"]');
  152 |     await expect(fil).toBeVisible();
  153 |     await expect(fil.locator('[aria-current="page"]')).toHaveText(categorie.libelle);
  154 | 
  155 |     // Et le menu indique la catégorie active.
  156 |     const lienActif = menuCategories(page).locator(`a[href$="/categorie/${categorie.slug}"]`);
  157 |     await expect(lienActif).toHaveAttribute("aria-current", "page");
  158 |   });
  159 | });
  160 | 
```