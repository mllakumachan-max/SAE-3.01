# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dec-a-categories.spec.js >> US DEC-a — Navigation par catégories >> DoD — Les URLs de catégorie sont propres
- Location: tests/dec-a-categories.spec.js:129:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('main article')
Expected: 25
Received: 12
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('main article') with timeout 5000ms
  - waiting for locator('main article')
    14 × locator resolved to 12 elements
       - unexpected value "12"

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - banner [ref=f1e4]:
    - figure [ref=f1e5]:
      - generic [ref=f1e6]:
        - link "Logo de l'application Click & Collect" [ref=f1e7] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/
          - img "Logo de l'application" [ref=f1e8]
          - generic [ref=f1e9]: Click & Collect
        - generic [ref=f1e10]:
          - button "Changer de thème" [ref=f1e11] [cursor=pointer]
          - link "Mon compte" [ref=f1e14] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/compte
          - link "Panier 0" [ref=f1e18] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/panier
            - generic [ref=f1e21]: Panier
            - generic [ref=f1e22]: "0"
      - navigation [ref=f1e24]:
        - link "Tous les produits" [ref=f1e25] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/
        - link "Multimédia 25" [ref=f1e26] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/multimedia
          - generic [ref=f1e27]: Multimédia
          - generic [ref=f1e28]: "25"
        - link "Habitat 25" [ref=f1e29] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/habitat
          - generic [ref=f1e30]: Habitat
          - generic [ref=f1e31]: "25"
        - link "Hobby 25" [ref=f1e32] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/hobby
          - generic [ref=f1e33]: Hobby
          - generic [ref=f1e34]: "25"
        - link "Bricolage 25" [ref=f1e35] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/bricolage
          - generic [ref=f1e36]: Bricolage
          - generic [ref=f1e37]: "25"
  - main [ref=f1e38]:
    - generic [ref=f1e39]:
      - navigation "Fil d'Ariane" [ref=f1e40]:
        - list [ref=f1e41]:
          - listitem [ref=f1e42]:
            - link "Catalogue" [ref=f1e43] [cursor=pointer]:
              - /url: /~ribatet1/SAE-3.01/Base/
            - generic [aria-hidden] [ref=f1e44]: /
          - listitem [ref=f1e45]:
            - generic [ref=f1e46]: Multimédia
      - heading "Catalogue" [level=1] [ref=f1e47]
      - generic [ref=f1e48]:
        - generic [ref=f1e49]:
          - text: Trier par
          - combobox "Trier par" [ref=f1e50]:
            - option "Nom (A → Z)" [selected]
            - option "Prix (croissant)"
        - generic [ref=f1e51]:
          - text: Produits par page
          - combobox "Produits par page" [ref=f1e52]:
            - option "12 produits" [selected]
            - option "24 produits"
            - option "48 produits"
        - generic [ref=f1e53]: 25 produits
      - generic [ref=f1e54]:
        - article [ref=f1e55]:
          - link [ref=f1e56] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/repeteur-wifi-750
            - figure "Amplificateur Wi-Fi 19,95 € En stock" [ref=f1e57]:
              - img "Amplificateur Wi-Fi" [ref=f1e59]
              - generic [ref=f1e60]:
                - heading "Amplificateur Wi-Fi" [level=2] [ref=f1e61]
                - generic [ref=f1e62]:
                  - generic [ref=f1e63]: 19,95 €
                  - generic [ref=f1e64]: En stock
          - button "Ajouter au panier" [ref=f1e68] [cursor=pointer]
        - article [ref=f1e69]:
          - link [ref=f1e70] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/tracker-bluetooth-cles
            - figure "Balise Smartfinder 6,95 € En stock" [ref=f1e71]:
              - img "Balise Smartfinder" [ref=f1e73]
              - generic [ref=f1e74]:
                - heading "Balise Smartfinder" [level=2] [ref=f1e75]
                - generic [ref=f1e76]:
                  - generic [ref=f1e77]: 6,95 €
                  - generic [ref=f1e78]: En stock
          - button "Ajouter au panier" [ref=f1e82] [cursor=pointer]
        - article [ref=f1e83]:
          - link [ref=f1e84] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/barre-son-tv-40w
            - figure "Barre de son TV 24,95 € En stock" [ref=f1e85]:
              - img "Barre de son TV" [ref=f1e87]
              - generic [ref=f1e88]:
                - heading "Barre de son TV" [level=2] [ref=f1e89]
                - generic [ref=f1e90]:
                  - generic [ref=f1e91]: 24,95 €
                  - generic [ref=f1e92]: En stock
          - button "Ajouter au panier" [ref=f1e96] [cursor=pointer]
        - article [ref=f1e97]:
          - link [ref=f1e98] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/batterie-haute-capacite-20000
            - figure "Batterie externe 20000 mAh 18,95 € En stock" [ref=f1e99]:
              - img "Batterie externe 20000 mAh" [ref=f1e101]
              - generic [ref=f1e102]:
                - heading "Batterie externe 20000 mAh" [level=2] [ref=f1e103]
                - generic [ref=f1e104]:
                  - generic [ref=f1e105]: 18,95 €
                  - generic [ref=f1e106]: En stock
          - button "Ajouter au panier" [ref=f1e110] [cursor=pointer]
        - article [ref=f1e111]:
          - link [ref=f1e112] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/powerbank-5000mah
            - figure "Batterie externe 5000 mAh 6,27 € En stock" [ref=f1e113]:
              - img "Batterie externe 5000 mAh" [ref=f1e115]
              - generic [ref=f1e116]:
                - heading "Batterie externe 5000 mAh" [level=2] [ref=f1e117]
                - generic [ref=f1e118]:
                  - generic [ref=f1e119]: 6,27 €
                  - generic [ref=f1e120]: En stock
          - button "Ajouter au panier" [ref=f1e124] [cursor=pointer]
        - article [ref=f1e125]:
          - link [ref=f1e126] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/boitier-synchro-led-tv
            - figure "Boîtier de synchronisation HDMI 34,95 € En stock" [ref=f1e127]:
              - img "Boîtier de synchronisation HDMI" [ref=f1e129]
              - generic [ref=f1e130]:
                - heading "Boîtier de synchronisation HDMI" [level=2] [ref=f1e131]
                - generic [ref=f1e132]:
                  - generic [ref=f1e133]: 34,95 €
                  - generic [ref=f1e134]: En stock
          - button "Ajouter au panier" [ref=f1e138] [cursor=pointer]
        - article [ref=f1e139]:
          - link [ref=f1e140] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/cable-charge-multi-3en1
            - figure "Câble de charge 3-en-1 6,97 € En stock" [ref=f1e141]:
              - img "Câble de charge 3-en-1" [ref=f1e143]
              - generic [ref=f1e144]:
                - heading "Câble de charge 3-en-1" [level=2] [ref=f1e145]
                - generic [ref=f1e146]:
                  - generic [ref=f1e147]: 6,97 €
                  - generic [ref=f1e148]: En stock
          - button "Ajouter au panier" [ref=f1e152] [cursor=pointer]
        - article [ref=f1e153]:
          - link [ref=f1e154] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/cable-enrouleur-100w
            - figure "Câble de charge rétractable 4,99 € En stock" [ref=f1e155]:
              - img "Câble de charge rétractable" [ref=f1e157]
              - generic [ref=f1e158]:
                - heading "Câble de charge rétractable" [level=2] [ref=f1e159]
                - generic [ref=f1e160]:
                  - generic [ref=f1e161]: 4,99 €
                  - generic [ref=f1e162]: En stock
          - button "Ajouter au panier" [ref=f1e166] [cursor=pointer]
        - article [ref=f1e167]:
          - link [ref=f1e168] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/cable-donnees-silicone-2m
            - figure "Câble de données en silicone 4,95 € En stock" [ref=f1e169]:
              - img "Câble de données en silicone" [ref=f1e171]
              - generic [ref=f1e172]:
                - heading "Câble de données en silicone" [level=2] [ref=f1e173]
                - generic [ref=f1e174]:
                  - generic [ref=f1e175]: 4,95 €
                  - generic [ref=f1e176]: En stock
          - button "Ajouter au panier" [ref=f1e180] [cursor=pointer]
        - article [ref=f1e181]:
          - link [ref=f1e182] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/cable-hdmi-4k-sitecom
            - figure "Câble HDMI 4K 2,99 € En stock" [ref=f1e183]:
              - img "Câble HDMI 4K" [ref=f1e185]
              - generic [ref=f1e186]:
                - heading "Câble HDMI 4K" [level=2] [ref=f1e187]
                - generic [ref=f1e188]:
                  - generic [ref=f1e189]: 2,99 €
                  - generic [ref=f1e190]: En stock
          - button "Ajouter au panier" [ref=f1e194] [cursor=pointer]
        - article [ref=f1e195]:
          - link [ref=f1e196] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/casque-audio-solix
            - figure "Casque audio sans fil 9,99 € En stock" [ref=f1e197]:
              - img "Casque audio sans fil" [ref=f1e199]
              - generic [ref=f1e200]:
                - heading "Casque audio sans fil" [level=2] [ref=f1e201]
                - generic [ref=f1e202]:
                  - generic [ref=f1e203]: 9,99 €
                  - generic [ref=f1e204]: En stock
          - button "Ajouter au panier" [ref=f1e208] [cursor=pointer]
        - article [ref=f1e209]:
          - link [ref=f1e210] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/chargeur-allume-cigare-75w
            - figure "Chargeur de voiture 5 ports 9,95 € En stock" [ref=f1e211]:
              - img "Chargeur de voiture 5 ports" [ref=f1e213]
              - generic [ref=f1e214]:
                - heading "Chargeur de voiture 5 ports" [level=2] [ref=f1e215]
                - generic [ref=f1e216]:
                  - generic [ref=f1e217]: 9,95 €
                  - generic [ref=f1e218]: En stock
          - button "Ajouter au panier" [ref=f1e222] [cursor=pointer]
      - navigation [ref=f1e223]:
        - button "Précédent" [disabled] [ref=f1e224]
        - generic [ref=f1e225]: Page 1 sur 3
        - button "Suivant" [ref=f1e226] [cursor=pointer]
```

# Test source

```ts
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
  70  |     expect(affiches.length).toBe(categorie.nb_produits);
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
> 140 |     await expect(cartes(page)).toHaveCount(categorie.nb_produits);
      |                                ^ Error: expect(locator).toHaveCount(expected) failed
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