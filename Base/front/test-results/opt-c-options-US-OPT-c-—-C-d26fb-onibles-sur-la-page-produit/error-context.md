# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: opt-c-options.spec.js >> US OPT-c — Choix des options >> CA — Je vois les options disponibles sur la page produit
- Location: tests/opt-c-options.spec.js:40:3

# Error details

```
TypeError: Cannot read properties of undefined (reading 'options')
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
  3   | import { aller, api, PRIX } from "./helpers.js";
  4   | 
  5   | /**
  6   |  * US OPT-c — Choix des options
  7   |  *
  8   |  * En tant que client, je veux choisir les options d'un produit sur sa fiche afin de
  9   |  * le personnaliser.
  10  |  *
  11  |  * Critères d'acceptation
  12  |  *  - Je vois les options disponibles sur la page produit (taille, couleur, etc.)
  13  |  *  - Je peux sélectionner une combinaison d'options
  14  |  *  - Le prix se met à jour selon mes choix
  15  |  *  - Le bouton « Ajouter au panier » ajoute le produit avec les options choisies
  16  |  *
  17  |  * Definition of Done
  18  |  *  - Modélisation des options en base de données (options définies par produit)
  19  |  *  - Interface dynamique (JavaScript)
  20  |  */
  21  | test.describe("US OPT-c — Choix des options", () => {
  22  |   test.beforeEach(async ({ page }) => {
  23  |     await aller(page);
  24  |   });
  25  | 
  26  |   /**
  27  |    * Produit de référence qui propose des options de personnalisation.
  28  |    * Les données viennent de l'API : c'est la référence de vérité.
  29  |    * @param {import("@playwright/test").Page} page
  30  |    */
  31  |   async function produitAvecOptions(page) {
  32  |     const { statut, donnees } = await api(page, "produits/couette-sans-housse-easy");
  33  |     expect(statut).toBe(200);
  34  |     expect(donnees.produit).toBeTruthy();
  35  |     expect(Array.isArray(donnees.options)).toBe(true);
  36  |     expect(donnees.options.length).toBeGreaterThan(0);
  37  |     return donnees;
  38  |   }
  39  | 
  40  |   test("CA — Je vois les options disponibles sur la page produit", async ({ page }) => {
  41  |     const { donnees } = await produitAvecOptions(page);
> 42  |     const option = donnees.options[0];
      |                            ^ TypeError: Cannot read properties of undefined (reading 'options')
  43  | 
  44  |     await aller(page, `produit/${donnees.produit.slug}`);
  45  | 
  46  |     // Le nom de l'option est affiché sur la fiche produit.
  47  |     await expect(page.locator('[data-zone="options"]').getByText(option.nom)).toBeVisible();
  48  | 
  49  |     // Chaque valeur de l'option est proposée comme choix.
  50  |     for (const valeur of option.valeurs) {
  51  |       await expect(page.getByRole("radio", { name: valeur.valeur })).toBeVisible();
  52  |     }
  53  |   });
  54  | 
  55  |   test("CA — Je peux sélectionner une combinaison d'options", async ({ page }) => {
  56  |     const { donnees } = await produitAvecOptions(page);
  57  |     const option = donnees.options[0];
  58  |     const valeur = option.valeurs[0];
  59  | 
  60  |     await aller(page, `produit/${donnees.produit.slug}`);
  61  | 
  62  |     // L'utilisateur choisit une valeur pour l'option.
  63  |     await page.getByRole("radio", { name: valeur.valeur }).click();
  64  | 
  65  |     // Le titre de l'option indique la valeur choisie.
  66  |     await expect(
  67  |       page.locator('[data-zone="options"]').getByText(new RegExp(`${option.nom} : ${valeur.valeur}`))
  68  |     ).toBeVisible();
  69  |   });
  70  | 
  71  |   test("CA — Le prix se met à jour selon mes choix", async ({ page }) => {
  72  |     const { donnees } = await produitAvecOptions(page);
  73  |     const option = donnees.options[0];
  74  | 
  75  |     // On choisit une valeur qui comporte un supplément, pour que le prix change.
  76  |     const valeurAvecSupplement = option.valeurs.find((v) => Number(v.prix_supplement || 0) > 0);
  77  |     if (!valeurAvecSupplement) {
  78  |       // Aucune valeur avec supplément : le test n'a pas de sens sur ce produit.
  79  |       test.skip();
  80  |       return;
  81  |     }
  82  | 
  83  |     const supplement = Number(valeurAvecSupplement.prix_supplement);
  84  |     const prixBase = Number(donnees.produit.prix);
  85  |     const prixAttendu = (prixBase + supplement).toFixed(2).replace(".", ",");
  86  | 
  87  |     await aller(page, `produit/${donnees.produit.slug}`);
  88  | 
  89  |     // Prix de base affiché au chargement de la page.
  90  |     const attenduBase = `${prixBase.toFixed(2).replace(".", ",")} €`;
  91  |     await expect(page.locator("main article").getByText(PRIX).first()).toHaveText(attenduBase);
  92  | 
  93  |     // Pose un marqueur avant l'interaction : la page ne doit pas se recharger.
  94  |     await page.evaluate(() => { /** @type {any} */ (window).__marqueur = "vivant"; });
  95  |     await page.getByRole("radio", { name: valeurAvecSupplement.valeur }).click();
  96  |     expect(await page.evaluate(() => /** @type {any} */ (window).__marqueur)).toBe("vivant");
  97  | 
  98  |     // Le prix affiché intègre le supplément de l'option choisie.
  99  |     await expect(page.locator("main article").getByText(PRIX).first()).toHaveText(`${prixAttendu} €`);
  100 |   });
  101 | 
  102 |   test("CA — Le bouton « Ajouter au panier » ajoute le produit avec les options choisies", async ({
  103 |     page,
  104 |   }) => {
  105 |     const { donnees } = await produitAvecOptions(page);
  106 |     const option = donnees.options[0];
  107 |     const valeur = option.valeurs[0];
  108 | 
  109 |     await aller(page, `produit/${donnees.produit.slug}`);
  110 | 
  111 |     // L'utilisateur choisit une option, puis ajoute au panier.
  112 |     await page.getByRole("radio", { name: valeur.valeur }).click();
  113 | 
  114 |     const bouton = page.locator('button[data-action="ajouter-panier"]');
  115 |     await expect(bouton).toBeEnabled();
  116 |     await bouton.click();
  117 | 
  118 |     // Le visiteur est prévenu de l'ajout au panier.
  119 |     await expect(page.locator('[data-zone="message"]')).toContainText(/ajouté au panier/i);
  120 | 
  121 |     // La ligne du panier (conservée dans le localStorage) porte les options choisies.
  122 |     const panier = await page.evaluate(() => {
  123 |       const brut = localStorage.getItem("sae301:panier");
  124 |       return brut ? JSON.parse(brut) : [];
  125 |     });
  126 | 
  127 |     const ligne = panier.find((l) => String(l.id) === String(donnees.produit.id));
  128 |     expect(ligne).toBeTruthy();
  129 |     expect(ligne.options).toEqual({ [option.nom]: valeur.valeur });
  130 |   });
  131 | 
  132 |   test("DoD — Les options sont modélisées en base de données", async ({ page }) => {
  133 |     const { donnees } = await produitAvecOptions(page);
  134 | 
  135 |     // Chaque option est rattachée au produit et possède au moins une valeur.
  136 |     for (const option of donnees.options) {
  137 |       expect(option.nom).toBeTruthy();
  138 |       expect(Array.isArray(option.valeurs)).toBe(true);
  139 |       expect(option.valeurs.length).toBeGreaterThan(0);
  140 |       for (const valeur of option.valeurs) {
  141 |         expect(valeur.valeur).toBeTruthy();
  142 |         expect(Number(valeur.prix_supplement) >= 0).toBe(true);
```