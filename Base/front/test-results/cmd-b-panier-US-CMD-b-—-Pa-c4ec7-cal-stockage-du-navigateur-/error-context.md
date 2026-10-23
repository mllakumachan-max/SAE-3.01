# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cmd-b-panier.spec.js >> US CMD-b — Panier d'achat >> DoD — Panier persistant en local (stockage du navigateur)
- Location: tests/cmd-b-panier.spec.js:100:3

# Error details

```
Error: expect(received).not.toBeNull()

Received: null
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
        - link "Bricolage 27" [ref=e35] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/bricolage
          - generic [ref=e36]: Bricolage
          - generic [ref=e37]: "27"
  - main [ref=e38]:
    - generic [ref=e39]:
      - navigation "Fil d'Ariane" [ref=e40]:
        - list [ref=e41]:
          - listitem [ref=e42]:
            - generic [ref=e43]: Catalogue
      - heading "Catalogue" [level=1] [ref=e44]
      - generic [ref=e45]:
        - generic [ref=e46]:
          - text: Trier par
          - combobox "Trier par" [ref=e47]:
            - option "Nom (A → Z)" [selected]
            - option "Prix (croissant)"
        - generic [ref=e48]:
          - text: Produits par page
          - combobox "Produits par page" [ref=e49]:
            - option "12 produits" [selected]
            - option "24 produits"
            - option "48 produits"
        - generic [ref=e50]: 99 produits
      - generic [ref=e51]:
        - article [ref=e52]:
          - link [ref=e53] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/repeteur-wifi-750
            - figure "Amplificateur Wi-Fi 19,95 € Épuisé" [ref=e54]:
              - img "Amplificateur Wi-Fi" [ref=e56]
              - generic [ref=e57]:
                - heading "Amplificateur Wi-Fi" [level=2] [ref=e58]
                - generic [ref=e59]:
                  - generic [ref=e60]: 19,95 €
                  - generic [ref=e61]: Épuisé
          - button "Épuisé" [disabled] [ref=e65]
        - article [ref=e66]:
          - link [ref=e67] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/tracker-bluetooth-cles
            - figure "Balise Smartfinder 6,95 € Épuisé" [ref=e68]:
              - img "Balise Smartfinder" [ref=e70]
              - generic [ref=e71]:
                - heading "Balise Smartfinder" [level=2] [ref=e72]
                - generic [ref=e73]:
                  - generic [ref=e74]: 6,95 €
                  - generic [ref=e75]: Épuisé
          - button "Épuisé" [disabled] [ref=e79]
        - article [ref=e80]:
          - link [ref=e81] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/barre-son-tv-40w
            - figure "Barre de son TV 24,95 € Épuisé" [ref=e82]:
              - img "Barre de son TV" [ref=e84]
              - generic [ref=e85]:
                - heading "Barre de son TV" [level=2] [ref=e86]
                - generic [ref=e87]:
                  - generic [ref=e88]: 24,95 €
                  - generic [ref=e89]: Épuisé
          - button "Épuisé" [disabled] [ref=e93]
        - article [ref=e94]:
          - link [ref=e95] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/batterie-haute-capacite-20000
            - figure "Batterie externe 20000 mAh 18,95 € Épuisé" [ref=e96]:
              - img "Batterie externe 20000 mAh" [ref=e98]
              - generic [ref=e99]:
                - heading "Batterie externe 20000 mAh" [level=2] [ref=e100]
                - generic [ref=e101]:
                  - generic [ref=e102]: 18,95 €
                  - generic [ref=e103]: Épuisé
          - button "Épuisé" [disabled] [ref=e107]
        - article [ref=e108]:
          - link [ref=e109] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/powerbank-5000mah
            - figure "Batterie externe 5000 mAh 6,27 € Épuisé" [ref=e110]:
              - img "Batterie externe 5000 mAh" [ref=e112]
              - generic [ref=e113]:
                - heading "Batterie externe 5000 mAh" [level=2] [ref=e114]
                - generic [ref=e115]:
                  - generic [ref=e116]: 6,27 €
                  - generic [ref=e117]: Épuisé
          - button "Épuisé" [disabled] [ref=e121]
        - article [ref=e122]:
          - link [ref=e123] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/carnet-aquarelle-grain
            - figure "Bloc d'aquarelle 1,99 € Épuisé" [ref=e124]:
              - img "Bloc d'aquarelle" [ref=e126]
              - generic [ref=e127]:
                - heading "Bloc d'aquarelle" [level=2] [ref=e128]
                - generic [ref=e129]:
                  - generic [ref=e130]: 1,99 €
                  - generic [ref=e131]: Épuisé
          - button "Épuisé" [disabled] [ref=e135]
        - article [ref=e136]:
          - link [ref=e137] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/coffret-outillage-complet
            - figure "Boîte à outils 95 pièces 39,95 € Épuisé" [ref=e138]:
              - img "Boîte à outils 95 pièces" [ref=e140]
              - generic [ref=e141]:
                - heading "Boîte à outils 95 pièces" [level=2] [ref=e142]
                - generic [ref=e143]:
                  - generic [ref=e144]: 39,95 €
                  - generic [ref=e145]: Épuisé
          - button "Épuisé" [disabled] [ref=e149]
        - article [ref=e150]:
          - link [ref=e151] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/boite-de-forets-et-d-embouts-werckmann
            - figure "Boîte de forets et d'embouts Werckmann 5,99 € Épuisé" [ref=e152]:
              - img "Boîte de forets et d'embouts Werckmann" [ref=e154]
              - generic [ref=e155]:
                - heading "Boîte de forets et d'embouts Werckmann" [level=2] [ref=e156]
                - generic [ref=e157]:
                  - generic [ref=e158]: 5,99 €
                  - generic [ref=e159]: Épuisé
          - button "Épuisé" [disabled] [ref=e163]
        - article [ref=e164]:
          - link [ref=e165] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/boite-de-rangement-werckmann
            - figure "Boîte de rangement Werckmann 9,99 € Épuisé" [ref=e166]:
              - img "Boîte de rangement Werckmann" [ref=e168]
              - generic [ref=e169]:
                - heading "Boîte de rangement Werckmann" [level=2] [ref=e170]
                - generic [ref=e171]:
                  - generic [ref=e172]: 9,99 €
                  - generic [ref=e173]: Épuisé
          - button "Épuisé" [disabled] [ref=e177]
        - article [ref=e178]:
          - link [ref=e179] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/boites-a-outils-keter
            - figure "Boîtes à outils Keter 8,99 € Épuisé" [ref=e180]:
              - img "Boîtes à outils Keter" [ref=e182]
              - generic [ref=e183]:
                - heading "Boîtes à outils Keter" [level=2] [ref=e184]
                - generic [ref=e185]:
                  - generic [ref=e186]: 8,99 €
                  - generic [ref=e187]: Épuisé
          - button "Épuisé" [disabled] [ref=e191]
        - article [ref=e192]:
          - link [ref=e193] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/boitier-synchro-led-tv
            - figure "Boîtier de synchronisation HDMI 34,95 € En stock" [ref=e194]:
              - img "Boîtier de synchronisation HDMI" [ref=e196]
              - generic [ref=e197]:
                - heading "Boîtier de synchronisation HDMI" [level=2] [ref=e198]
                - generic [ref=e199]:
                  - generic [ref=e200]: 34,95 €
                  - generic [ref=e201]: En stock
          - button "Ajouter au panier" [ref=e205] [cursor=pointer]
        - article [ref=e206]:
          - link [ref=e207] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/boule-lumineuse
            - figure "Boule lumineuse 3,99 € Épuisé" [ref=e208]:
              - img "Boule lumineuse" [ref=e210]
              - generic [ref=e211]:
                - heading "Boule lumineuse" [level=2] [ref=e212]
                - generic [ref=e213]:
                  - generic [ref=e214]: 3,99 €
                  - generic [ref=e215]: Épuisé
          - button "Épuisé" [disabled] [ref=e219]
      - navigation [ref=e220]:
        - button "Précédent" [disabled] [ref=e221]
        - generic [ref=e222]: Page 1 sur 9
        - button "Suivant" [ref=e223] [cursor=pointer]
```

# Test source

```ts
  2   | import { test, expect } from "@playwright/test";
  3   | import { aller, api, cartes, url } from "./helpers.js";
  4   | 
  5   | /**
  6   |  * US CMD-b — Panier d'achat
  7   |  *
  8   |  * En tant que client, je veux ajouter des produits à un panier afin de
  9   |  * préparer ma commande.
  10  |  *
  11  |  * Critères d'acceptation
  12  |  *  - Je peux ajouter des produits depuis le catalogue et depuis les pages détail
  13  |  *  - Une icône panier avec compteur d'articles est visible
  14  |  *  - Je peux consulter mon panier (liste des produits)
  15  |  *  - Je peux modifier les quantités dans le panier
  16  |  *  - Je peux supprimer des articles du panier
  17  |  *  - Les totaux se calculent automatiquement
  18  |  *  - Mon panier est sauvegardé localement et restauré d'une visite à l'autre
  19  |  *
  20  |  * Definition of Done
  21  |  *  - Panier persistant en local (stockage du navigateur)
  22  |  *  - Totaux recalculés à chaque modification du panier
  23  |  */
  24  | test.describe("US CMD-b — Panier d'achat", () => {
  25  |   test.beforeEach(async ({ page }) => {
  26  |     await aller(page);
  27  |     await page.evaluate(() => window.localStorage.clear());
  28  |   });
  29  | 
  30  |   test("CA — J'ajoute des produits depuis le catalogue et depuis les pages détail", async ({ page }) => {
  31  |     const { donnees } = await api(page, "produits?page=1");
  32  |     const produit = donnees.produits[0];
  33  |     expect(produit).toBeTruthy();
  34  | 
  35  |     // Depuis le catalogue
  36  |     const boutonCatalogue = page.locator('button[data-action="ajouter-panier"]').first();
  37  |     await boutonCatalogue.click();
  38  |     await expect(page.locator('[data-role="compteur-panier"]')).toHaveText("1");
  39  | 
  40  |     // Depuis la page détail
  41  |     await aller(page, `produit/${produit.slug}`);
  42  |     await page.locator('button[data-action="ajouter-panier"]').click();
  43  |     await expect(page.locator('[data-role="compteur-panier"]')).toHaveText("2");
  44  |   });
  45  | 
  46  |   test("CA — Une icône panier avec compteur d'articles est visible", async ({ page }) => {
  47  |     await expect(page.locator('a[href$="/panier"] [data-role="compteur-panier"]')).toBeVisible();
  48  |   });
  49  | 
  50  |   test("CA — Je peux consulter mon panier (liste des produits)", async ({ page }) => {
  51  |     const { donnees } = await api(page, "produits?page=1");
  52  |     const produit = donnees.produits[0];
  53  |     await aller(page, `produit/${produit.slug}`);
  54  |     await page.locator('button[data-action="ajouter-panier"]').click();
  55  |     await aller(page, "panier");
  56  |     await expect(page.locator('[data-zone="lignes"] li').first()).toBeVisible();
  57  |   });
  58  | 
  59  |   test("CA — Je peux modifier les quantités dans le panier", async ({ page }) => {
  60  |     const { donnees } = await api(page, "produits?page=1");
  61  |     const produit = donnees.produits[0];
  62  |     await aller(page, `produit/${produit.slug}`);
  63  |     await page.locator('button[data-action="ajouter-panier"]').click();
  64  |     await aller(page, "panier");
  65  |     const input = page.locator('[data-zone="lignes"] input[type="number"]').first();
  66  |     await input.fill("3");
  67  |     await input.blur();
  68  |     await expect(input).toHaveValue("3");
  69  |   });
  70  | 
  71  |   test("CA — Je peux supprimer des articles du panier", async ({ page }) => {
  72  |     const { donnees } = await api(page, "produits?page=1");
  73  |     const produit = donnees.produits[0];
  74  |     await aller(page, `produit/${produit.slug}`);
  75  |     await page.locator('button[data-action="ajouter-panier"]').click();
  76  |     await aller(page, "panier");
  77  |     await page.locator('[data-action="retirer"]').first().click();
  78  |     await expect(page.locator('[data-zone="vide"]')).toBeVisible();
  79  |   });
  80  | 
  81  |   test("CA — Les totaux se calculent automatiquement", async ({ page }) => {
  82  |     const { donnees } = await api(page, "produits?page=1");
  83  |     const produit = donnees.produits[0];
  84  |     await aller(page, `produit/${produit.slug}`);
  85  |     await page.locator('button[data-action="ajouter-panier"]').click();
  86  |     await aller(page, "panier");
  87  |     await expect(page.locator('[data-zone="total"]')).toContainText(/\d/);
  88  |   });
  89  | 
  90  |   test("CA — Mon panier est sauvegardé localement et restauré d'une visite à l'autre", async ({ page }) => {
  91  |     const { donnees } = await api(page, "produits?page=1");
  92  |     const produit = donnees.produits[0];
  93  |     await aller(page, `produit/${produit.slug}`);
  94  |     await page.locator('button[data-action="ajouter-panier"]').click();
  95  |     await page.reload();
  96  |     await aller(page, "panier");
  97  |     await expect(page.locator('[data-zone="lignes"] li').first()).toBeVisible();
  98  |   });
  99  | 
  100 |   test("DoD — Panier persistant en local (stockage du navigateur)", async ({ page }) => {
  101 |     const brut = await page.evaluate(() => window.localStorage.getItem("sae301:panier"));
> 102 |     expect(brut).not.toBeNull();
      |                      ^ Error: expect(received).not.toBeNull()
  103 |   });
  104 | 
  105 |   test("DoD — Totaux recalculés à chaque modification du panier", async ({ page }) => {
  106 |     await page.evaluate(() => { /** @type {any} */ (window).__marqueur = "vivant"; });
  107 |     expect(await page.evaluate(() => /** @type {any} */ (window).__marqueur)).toBe("vivant");
  108 |   });
  109 | });
  110 | "C:\Users\mllak\Downloads\sae\SAE-3.01\Base\front\tests\cmd-b-panier.spec.js"
```