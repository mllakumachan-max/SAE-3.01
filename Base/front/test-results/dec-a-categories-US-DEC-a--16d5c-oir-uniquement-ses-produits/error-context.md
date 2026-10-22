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

Expected: 25
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
        - link "Multimédia 25" [ref=e26] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/multimedia
          - generic [ref=e27]: Multimédia
          - generic [ref=e28]: "25"
        - link "Habitat 25" [ref=e29] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/habitat
          - generic [ref=e30]: Habitat
          - generic [ref=e31]: "25"
        - link "Hobby 25" [ref=e32] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/hobby
          - generic [ref=e33]: Hobby
          - generic [ref=e34]: "25"
        - link "Bricolage 33" [ref=e35] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/bricolage
          - generic [ref=e36]: Bricolage
          - generic [ref=e37]: "33"
        - link "Catégorie test 1792662988374 0" [ref=e38] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/categorie-test-1792662988374
          - generic [ref=e39]: Catégorie test 1792662988374
          - generic [ref=e40]: "0"
        - link "Catégorie test 1792663178981 0" [ref=e41] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/categorie-test-1792663178981
          - generic [ref=e42]: Catégorie test 1792663178981
          - generic [ref=e43]: "0"
        - link "Catégorie modif 1792663179493 mod 0" [ref=e44] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/categorie-modif-1792663179493
          - generic [ref=e45]: Catégorie modif 1792663179493 mod
          - generic [ref=e46]: "0"
        - link "Catégorie test 1792663184935 0" [ref=e47] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/categorie-test-1792663184935
          - generic [ref=e48]: Catégorie test 1792663184935
          - generic [ref=e49]: "0"
        - link "Catégorie modif 1792663185494 mod 0" [ref=e50] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/categorie-modif-1792663185494
          - generic [ref=e51]: Catégorie modif 1792663185494 mod
          - generic [ref=e52]: "0"
        - link "Catégorie test 1792672739623 0" [ref=e53] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/categorie-test-1792672739623
          - generic [ref=e54]: Catégorie test 1792672739623
          - generic [ref=e55]: "0"
        - link "Catégorie modif 1792672740525 mod 0" [ref=e56] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/categorie-modif-1792672740525
          - generic [ref=e57]: Catégorie modif 1792672740525 mod
          - generic [ref=e58]: "0"
  - main [ref=e59]:
    - generic [ref=e60]:
      - navigation "Fil d'Ariane" [ref=e61]:
        - list [ref=e62]:
          - listitem [ref=e63]:
            - link "Catalogue" [ref=e64] [cursor=pointer]:
              - /url: /~ribatet1/SAE-3.01/Base/
            - generic [aria-hidden] [ref=e65]: /
          - listitem [ref=e66]:
            - generic [ref=e67]: Multimédia
      - heading "Catalogue" [level=1] [ref=e68]
      - generic [ref=e69]:
        - generic [ref=e70]:
          - text: Trier par
          - combobox "Trier par" [ref=e71]:
            - option "Nom (A → Z)" [selected]
            - option "Prix (croissant)"
        - generic [ref=e72]:
          - text: Produits par page
          - combobox "Produits par page" [ref=e73]:
            - option "12 produits" [selected]
            - option "24 produits"
            - option "48 produits"
        - generic [ref=e74]: 25 produits
      - generic [ref=e75]:
        - article [ref=e76]:
          - link [ref=e77] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/repeteur-wifi-750
            - figure "Amplificateur Wi-Fi 19,95 € En stock" [ref=e78]:
              - img "Amplificateur Wi-Fi" [ref=e80]
              - generic [ref=e81]:
                - heading "Amplificateur Wi-Fi" [level=2] [ref=e82]
                - generic [ref=e83]:
                  - generic [ref=e84]: 19,95 €
                  - generic [ref=e85]: En stock
          - button "Ajouter au panier" [ref=e89] [cursor=pointer]
        - article [ref=e90]:
          - link [ref=e91] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/tracker-bluetooth-cles
            - figure "Balise Smartfinder 6,95 € En stock" [ref=e92]:
              - img "Balise Smartfinder" [ref=e94]
              - generic [ref=e95]:
                - heading "Balise Smartfinder" [level=2] [ref=e96]
                - generic [ref=e97]:
                  - generic [ref=e98]: 6,95 €
                  - generic [ref=e99]: En stock
          - button "Ajouter au panier" [ref=e103] [cursor=pointer]
        - article [ref=e104]:
          - link [ref=e105] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/barre-son-tv-40w
            - figure "Barre de son TV 24,95 € En stock" [ref=e106]:
              - img "Barre de son TV" [ref=e108]
              - generic [ref=e109]:
                - heading "Barre de son TV" [level=2] [ref=e110]
                - generic [ref=e111]:
                  - generic [ref=e112]: 24,95 €
                  - generic [ref=e113]: En stock
          - button "Ajouter au panier" [ref=e117] [cursor=pointer]
        - article [ref=e118]:
          - link [ref=e119] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/batterie-haute-capacite-20000
            - figure "Batterie externe 20000 mAh 18,95 € En stock" [ref=e120]:
              - img "Batterie externe 20000 mAh" [ref=e122]
              - generic [ref=e123]:
                - heading "Batterie externe 20000 mAh" [level=2] [ref=e124]
                - generic [ref=e125]:
                  - generic [ref=e126]: 18,95 €
                  - generic [ref=e127]: En stock
          - button "Ajouter au panier" [ref=e131] [cursor=pointer]
        - article [ref=e132]:
          - link [ref=e133] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/powerbank-5000mah
            - figure "Batterie externe 5000 mAh 6,27 € En stock" [ref=e134]:
              - img "Batterie externe 5000 mAh" [ref=e136]
              - generic [ref=e137]:
                - heading "Batterie externe 5000 mAh" [level=2] [ref=e138]
                - generic [ref=e139]:
                  - generic [ref=e140]: 6,27 €
                  - generic [ref=e141]: En stock
          - button "Ajouter au panier" [ref=e145] [cursor=pointer]
        - article [ref=e146]:
          - link [ref=e147] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/boitier-synchro-led-tv
            - figure "Boîtier de synchronisation HDMI 34,95 € En stock" [ref=e148]:
              - img "Boîtier de synchronisation HDMI" [ref=e150]
              - generic [ref=e151]:
                - heading "Boîtier de synchronisation HDMI" [level=2] [ref=e152]
                - generic [ref=e153]:
                  - generic [ref=e154]: 34,95 €
                  - generic [ref=e155]: En stock
          - button "Ajouter au panier" [ref=e159] [cursor=pointer]
        - article [ref=e160]:
          - link [ref=e161] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/cable-charge-multi-3en1
            - figure "Câble de charge 3-en-1 6,97 € En stock" [ref=e162]:
              - img "Câble de charge 3-en-1" [ref=e164]
              - generic [ref=e165]:
                - heading "Câble de charge 3-en-1" [level=2] [ref=e166]
                - generic [ref=e167]:
                  - generic [ref=e168]: 6,97 €
                  - generic [ref=e169]: En stock
          - button "Ajouter au panier" [ref=e173] [cursor=pointer]
        - article [ref=e174]:
          - link [ref=e175] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/cable-enrouleur-100w
            - figure "Câble de charge rétractable 4,99 € En stock" [ref=e176]:
              - img "Câble de charge rétractable" [ref=e178]
              - generic [ref=e179]:
                - heading "Câble de charge rétractable" [level=2] [ref=e180]
                - generic [ref=e181]:
                  - generic [ref=e182]: 4,99 €
                  - generic [ref=e183]: En stock
          - button "Ajouter au panier" [ref=e187] [cursor=pointer]
        - article [ref=e188]:
          - link [ref=e189] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/cable-donnees-silicone-2m
            - figure "Câble de données en silicone 4,95 € En stock" [ref=e190]:
              - img "Câble de données en silicone" [ref=e192]
              - generic [ref=e193]:
                - heading "Câble de données en silicone" [level=2] [ref=e194]
                - generic [ref=e195]:
                  - generic [ref=e196]: 4,95 €
                  - generic [ref=e197]: En stock
          - button "Ajouter au panier" [ref=e201] [cursor=pointer]
        - article [ref=e202]:
          - link [ref=e203] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/cable-hdmi-4k-sitecom
            - figure "Câble HDMI 4K 2,99 € En stock" [ref=e204]:
              - img "Câble HDMI 4K" [ref=e206]
              - generic [ref=e207]:
                - heading "Câble HDMI 4K" [level=2] [ref=e208]
                - generic [ref=e209]:
                  - generic [ref=e210]: 2,99 €
                  - generic [ref=e211]: En stock
          - button "Ajouter au panier" [ref=e215] [cursor=pointer]
        - article [ref=e216]:
          - link [ref=e217] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/casque-audio-solix
            - figure "Casque audio sans fil 9,99 € En stock" [ref=e218]:
              - img "Casque audio sans fil" [ref=e220]
              - generic [ref=e221]:
                - heading "Casque audio sans fil" [level=2] [ref=e222]
                - generic [ref=e223]:
                  - generic [ref=e224]: 9,99 €
                  - generic [ref=e225]: En stock
          - button "Ajouter au panier" [ref=e229] [cursor=pointer]
        - article [ref=e230]:
          - link [ref=e231] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/chargeur-allume-cigare-75w
            - figure "Chargeur de voiture 5 ports 9,95 € En stock" [ref=e232]:
              - img "Chargeur de voiture 5 ports" [ref=e234]
              - generic [ref=e235]:
                - heading "Chargeur de voiture 5 ports" [level=2] [ref=e236]
                - generic [ref=e237]:
                  - generic [ref=e238]: 9,95 €
                  - generic [ref=e239]: En stock
          - button "Ajouter au panier" [ref=e243] [cursor=pointer]
      - navigation [ref=e244]:
        - button "Précédent" [disabled] [ref=e245]
        - generic [ref=e246]: Page 1 sur 3
        - button "Suivant" [ref=e247] [cursor=pointer]
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