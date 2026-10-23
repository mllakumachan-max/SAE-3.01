# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stk-c-stock.spec.js >> US STK-c — Contraintes de stock >> CA — Les quantités du panier s'ajustent automatiquement si le stock baisse
- Location: tests/stk-c-stock.spec.js:139:3

# Error details

```
Error: Produit enceinte-bluetooth-fresh-n-rebel introuvable dans le catalogue (page 1).
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
        - link "Bricolage 29" [ref=e35] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/bricolage
          - generic [ref=e36]: Bricolage
          - generic [ref=e37]: "29"
        - link "Catégorie test 1792746213732 0" [ref=e38] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/categorie-test-1792746213732
          - generic [ref=e39]: Catégorie test 1792746213732
          - generic [ref=e40]: "0"
        - link "Catégorie modif 1792746214441 mod 0" [ref=e41] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/categorie-modif-1792746214441
          - generic [ref=e42]: Catégorie modif 1792746214441 mod
          - generic [ref=e43]: "0"
  - main [ref=e44]:
    - generic [ref=e45]:
      - navigation "Fil d'Ariane" [ref=e46]:
        - list [ref=e47]:
          - listitem [ref=e48]:
            - generic [ref=e49]: Catalogue
      - heading "Catalogue" [level=1] [ref=e50]
      - generic [ref=e51]:
        - generic [ref=e52]:
          - text: Trier par
          - combobox "Trier par" [ref=e53]:
            - option "Nom (A → Z)" [selected]
            - option "Prix (croissant)"
        - generic [ref=e54]:
          - text: Produits par page
          - combobox "Produits par page" [ref=e55]:
            - option "12 produits" [selected]
            - option "24 produits"
            - option "48 produits"
        - generic [ref=e56]: 101 produits
      - generic [ref=e57]:
        - article [ref=e58]:
          - link [ref=e59] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/repeteur-wifi-750
            - figure "Amplificateur Wi-Fi 19,95 € Épuisé" [ref=e60]:
              - img "Amplificateur Wi-Fi" [ref=e62]
              - generic [ref=e63]:
                - heading "Amplificateur Wi-Fi" [level=2] [ref=e64]
                - generic [ref=e65]:
                  - generic [ref=e66]: 19,95 €
                  - generic [ref=e67]: Épuisé
          - button "Épuisé" [disabled] [ref=e71]
        - article [ref=e72]:
          - link [ref=e73] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/tracker-bluetooth-cles
            - figure "Balise Smartfinder 6,95 € Épuisé" [ref=e74]:
              - img "Balise Smartfinder" [ref=e76]
              - generic [ref=e77]:
                - heading "Balise Smartfinder" [level=2] [ref=e78]
                - generic [ref=e79]:
                  - generic [ref=e80]: 6,95 €
                  - generic [ref=e81]: Épuisé
          - button "Épuisé" [disabled] [ref=e85]
        - article [ref=e86]:
          - link [ref=e87] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/barre-son-tv-40w
            - figure "Barre de son TV 24,95 € Épuisé" [ref=e88]:
              - img "Barre de son TV" [ref=e90]
              - generic [ref=e91]:
                - heading "Barre de son TV" [level=2] [ref=e92]
                - generic [ref=e93]:
                  - generic [ref=e94]: 24,95 €
                  - generic [ref=e95]: Épuisé
          - button "Épuisé" [disabled] [ref=e99]
        - article [ref=e100]:
          - link [ref=e101] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/batterie-haute-capacite-20000
            - figure "Batterie externe 20000 mAh 18,95 € Épuisé" [ref=e102]:
              - img "Batterie externe 20000 mAh" [ref=e104]
              - generic [ref=e105]:
                - heading "Batterie externe 20000 mAh" [level=2] [ref=e106]
                - generic [ref=e107]:
                  - generic [ref=e108]: 18,95 €
                  - generic [ref=e109]: Épuisé
          - button "Épuisé" [disabled] [ref=e113]
        - article [ref=e114]:
          - link [ref=e115] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/powerbank-5000mah
            - figure "Batterie externe 5000 mAh 6,27 € Épuisé" [ref=e116]:
              - img "Batterie externe 5000 mAh" [ref=e118]
              - generic [ref=e119]:
                - heading "Batterie externe 5000 mAh" [level=2] [ref=e120]
                - generic [ref=e121]:
                  - generic [ref=e122]: 6,27 €
                  - generic [ref=e123]: Épuisé
          - button "Épuisé" [disabled] [ref=e127]
        - article [ref=e128]:
          - link [ref=e129] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/carnet-aquarelle-grain
            - figure "Bloc d'aquarelle 1,99 € Épuisé" [ref=e130]:
              - img "Bloc d'aquarelle" [ref=e132]
              - generic [ref=e133]:
                - heading "Bloc d'aquarelle" [level=2] [ref=e134]
                - generic [ref=e135]:
                  - generic [ref=e136]: 1,99 €
                  - generic [ref=e137]: Épuisé
          - button "Épuisé" [disabled] [ref=e141]
        - article [ref=e142]:
          - link [ref=e143] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/coffret-outillage-complet
            - figure "Boîte à outils 95 pièces 39,95 € Épuisé" [ref=e144]:
              - img "Boîte à outils 95 pièces" [ref=e146]
              - generic [ref=e147]:
                - heading "Boîte à outils 95 pièces" [level=2] [ref=e148]
                - generic [ref=e149]:
                  - generic [ref=e150]: 39,95 €
                  - generic [ref=e151]: Épuisé
          - button "Épuisé" [disabled] [ref=e155]
        - article [ref=e156]:
          - link [ref=e157] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/boite-de-forets-et-d-embouts-werckmann
            - figure "Boîte de forets et d'embouts Werckmann 5,99 € Épuisé" [ref=e158]:
              - img "Boîte de forets et d'embouts Werckmann" [ref=e160]
              - generic [ref=e161]:
                - heading "Boîte de forets et d'embouts Werckmann" [level=2] [ref=e162]
                - generic [ref=e163]:
                  - generic [ref=e164]: 5,99 €
                  - generic [ref=e165]: Épuisé
          - button "Épuisé" [disabled] [ref=e169]
        - article [ref=e170]:
          - link [ref=e171] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/boite-de-rangement-werckmann
            - figure "Boîte de rangement Werckmann 9,99 € Épuisé" [ref=e172]:
              - img "Boîte de rangement Werckmann" [ref=e174]
              - generic [ref=e175]:
                - heading "Boîte de rangement Werckmann" [level=2] [ref=e176]
                - generic [ref=e177]:
                  - generic [ref=e178]: 9,99 €
                  - generic [ref=e179]: Épuisé
          - button "Épuisé" [disabled] [ref=e183]
        - article [ref=e184]:
          - link [ref=e185] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/boites-a-outils-keter
            - figure "Boîtes à outils Keter 8,99 € Épuisé" [ref=e186]:
              - img "Boîtes à outils Keter" [ref=e188]
              - generic [ref=e189]:
                - heading "Boîtes à outils Keter" [level=2] [ref=e190]
                - generic [ref=e191]:
                  - generic [ref=e192]: 8,99 €
                  - generic [ref=e193]: Épuisé
          - button "Épuisé" [disabled] [ref=e197]
        - article [ref=e198]:
          - link [ref=e199] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/boitier-synchro-led-tv
            - figure "Boîtier de synchronisation HDMI 34,95 € En stock" [ref=e200]:
              - img "Boîtier de synchronisation HDMI" [ref=e202]
              - generic [ref=e203]:
                - heading "Boîtier de synchronisation HDMI" [level=2] [ref=e204]
                - generic [ref=e205]:
                  - generic [ref=e206]: 34,95 €
                  - generic [ref=e207]: En stock
          - button "Ajouter au panier" [ref=e211] [cursor=pointer]
        - article [ref=e212]:
          - link [ref=e213] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/boule-lumineuse
            - figure "Boule lumineuse 3,99 € Épuisé" [ref=e214]:
              - img "Boule lumineuse" [ref=e216]
              - generic [ref=e217]:
                - heading "Boule lumineuse" [level=2] [ref=e218]
                - generic [ref=e219]:
                  - generic [ref=e220]: 3,99 €
                  - generic [ref=e221]: Épuisé
          - button "Épuisé" [disabled] [ref=e225]
      - navigation [ref=e226]:
        - button "Précédent" [disabled] [ref=e227]
        - generic [ref=e228]: Page 1 sur 9
        - button "Suivant" [ref=e229] [cursor=pointer]
```

# Test source

```ts
  1   | // @ts-check
  2   | import { test, expect } from "@playwright/test";
  3   | import { aller, api } from "./helpers.js";
  4   | 
  5   | /**
  6   |  * US STK-c — Contraintes de stock
  7   |  *
  8   |  * En tant que client, je veux être limité par les stocks disponibles afin
  9   |  * d'éviter les commandes impossibles.
  10  |  *
  11  |  * Critères d'acceptation
  12  |  *  - Je ne peux pas ajouter un produit épuisé au panier
  13  |  *  - La quantité maximum est limitée au stock disponible
  14  |  *  - Je reçois des messages d'erreur clairs en cas de dépassement
  15  |  *  - Les quantités de mon panier s'ajustent automatiquement si nécessaire
  16  |  *  - La vérification se fait avant chaque ajout au panier et à la validation
  17  |  *    de la commande
  18  |  *  - Si les produits ont des variantes, les contraintes s'appliquent par
  19  |  *    variante (ici : par produit, identifié par son id)
  20  |  *
  21  |  * Definition of Done spécifique
  22  |  *  - Vérification côté client et côté serveur
  23  |  *  - Gestion des cas limites (stock modifié pendant la session)
  24  |  *  - Tests avec différents scénarios de stock
  25  |  */
  26  | 
  27  | /**
  28  |  * Produits utilisés pour les tests, avec leur stock de test (sae301.sql).
  29  |  */
  30  | const PRODUITS_TESTS = [
  31  |   { slug: "kit-nettoyage-ecrans-lab31", stock: 0, libelle: "épuisé" },
  32  |   { slug: "cable-donnees-silicone-2m", stock: 1, libelle: "stock 1" },
  33  |   { slug: "enceinte-bluetooth-fresh-n-rebel", stock: 2, libelle: "stock 2" },
  34  |   { slug: "support-ordinateur-mdf", stock: 10, libelle: "stock 10" },
  35  |   { slug: "boitier-synchro-led-tv", stock: 50, libelle: "stock 50" },
  36  | ];
  37  | 
  38  | /**
  39  |  * Identifiant d'un produit de test, lu depuis l'API.
  40  |  */
  41  | async function idProduit(page, slug) {
  42  |   const { donnees } = await api(page, "produits?page=1&parPage=100");
  43  |   const produit = donnees.produits.find((p) => p.slug === slug);
  44  |   if (!produit) {
> 45  |     throw new Error(`Produit ${slug} introuvable dans le catalogue (page 1).`);
      |           ^ Error: Produit enceinte-bluetooth-fresh-n-rebel introuvable dans le catalogue (page 1).
  46  |   }
  47  |   return produit.id;
  48  | }
  49  | 
  50  | test.describe("US STK-c — Contraintes de stock", () => {
  51  |   test.beforeEach(async ({ page }) => {
  52  |     await aller(page);
  53  |   });
  54  | 
  55  |   test("CA — Je ne peux pas ajouter un produit épuisé au panier", async ({ page }) => {
  56  |     const { slug } = PRODUITS_TESTS[0]; // stock = 0
  57  | 
  58  |     await aller(page, `produit/${slug}`);
  59  |     const bouton = page.locator('[data-action="ajouter-panier"]');
  60  |     await expect(bouton).toBeDisabled();
  61  |     await expect(bouton).toHaveText("Épuisé");
  62  | 
  63  |     const compteur = page.locator('[data-role="compteur-panier"]');
  64  |     await expect(compteur).toHaveText("0");
  65  |   });
  66  | 
  67  |   test("CA — La quantité maximum est limitée au stock disponible", async ({ page }) => {
  68  |     for (const { slug, stock } of PRODUITS_TESTS) {
  69  |       await aller(page, `produit/${slug}`);
  70  | 
  71  |       const input = page.locator('input[name="quantite"]');
  72  |       await expect(input).toHaveAttribute("max", String(stock));
  73  | 
  74  |       const boutonPlus = page.locator('[data-action="plus"]');
  75  |       for (let i = 0; i < 10; i++) {
  76  |         await boutonPlus.click();
  77  |       }
  78  | 
  79  |       await expect(input).toHaveValue(String(Math.max(1, stock)));
  80  |     }
  81  |   });
  82  | 
  83  |   test("CA — Je reçois un message d'erreur clair en cas de dépassement", async ({ page }) => {
  84  |     const { slug, stock } = PRODUITS_TESTS[2]; // stock = 2
  85  |     const id = await idProduit(page, slug);
  86  | 
  87  |     await aller(page, `produit/${slug}`);
  88  | 
  89  |     // 1er ajout : 1 article, accepté.
  90  |     await page.locator('[data-action="ajouter-panier"]').click();
  91  |     expect(page.locator('[data-role="compteur-panier"]')).toHaveText("1");
  92  | 
  93  |     // 2e ajout : 2 articles supplémentaires → total 3 > stock 2, refusé/ajusté.
  94  |     await page.locator('input[name="quantite"]').fill("2");
  95  |     await page.locator('[data-action="ajouter-panier"]').click();
  96  | 
  97  |     const message = page.locator('[data-zone="message"]');
  98  |     await expect(message).toContainText("2 maximum");
  99  |     await expect(message).toContainText("ajustée");
  100 | 
  101 |     // Le panier ne dépasse pas le stock disponible.
  102 |     expect(page.locator('[data-role="compteur-panier"]')).toHaveText("2");
  103 |   });
  104 | 
  105 |   test("CA — La vérification côté serveur est appelée avant chaque ajout au panier", async ({ page }) => {
  106 |     const slug = PRODUITS_TESTS[3].slug; // stock = 10
  107 |     const id = await idProduit(page, slug);
  108 | 
  109 |     let requeteInterceptee = null;
  110 |     await page.route("**/api/panier/verifier-stock", async (route) => {
  111 |       const body = route.request().postDataJSON();
  112 |       requeteInterceptee = body;
  113 |       await route.fulfill({
  114 |         json: {
  115 |           valide: true,
  116 |           lignes: [
  117 |             {
  118 |               id,
  119 |               nom: "Produit test",
  120 |               stock: 10,
  121 |               quantiteDemandee: body?.lignes?.[0]?.quantite ?? 1,
  122 |               quantiteMax: 10,
  123 |               estValide: true,
  124 |               message: null,
  125 |             },
  126 |           ],
  127 |         },
  128 |       });
  129 |     });
  130 | 
  131 |     await aller(page, `produit/${slug}`);
  132 |     await page.locator('[data-action="ajouter-panier"]').click();
  133 | 
  134 |     expect(requeteInterceptee).not.toBeNull();
  135 |     expect(requeteInterceptee.lignes[0].id).toBe(id);
  136 |     expect(typeof requeteInterceptee.lignes[0].quantite).toBe("number");
  137 |   });
  138 | 
  139 |   test("CA — Les quantités du panier s'ajustent automatiquement si le stock baisse", async ({ page }) => {
  140 |     const slug = PRODUITS_TESTS[2].slug; // stock = 2
  141 |     const id = await idProduit(page, slug);
  142 | 
  143 |     // On met un article au panier.
  144 |     await aller(page, `produit/${slug}`);
  145 |     await page.locator('[data-action="ajouter-panier"]').click();
```