# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dec-c-produit.spec.js >> US DEC-c — Détail d'un produit >> DoD — Je peux revenir vers la catégorie d'origine
- Location: tests/dec-c-produit.spec.js:193:3

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('main article')
Expected: 23
Received: 12
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('main article') with timeout 5000ms
  - waiting for locator('main article')
    - locator resolved to 1 element
    - unexpected value "1"
    13 × locator resolved to 12 elements
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
        - link "Multimédia 23" [ref=f1e26] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/multimedia
          - generic [ref=f1e27]: Multimédia
          - generic [ref=f1e28]: "23"
        - link "Habitat 24" [ref=f1e29] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/categorie/habitat
          - generic [ref=f1e30]: Habitat
          - generic [ref=f1e31]: "24"
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
        - generic [ref=f1e53]: 23 produits
      - generic [ref=f1e54]:
        - article [ref=f1e55]:
          - link [ref=f1e56] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/repeteur-wifi-750
            - figure "Amplificateur Wi-Fi 19,95 € Épuisé" [ref=f1e57]:
              - img "Amplificateur Wi-Fi" [ref=f1e59]
              - generic [ref=f1e60]:
                - heading "Amplificateur Wi-Fi" [level=2] [ref=f1e61]
                - generic [ref=f1e62]:
                  - generic [ref=f1e63]: 19,95 €
                  - generic [ref=f1e64]: Épuisé
          - button "Épuisé" [disabled] [ref=f1e68]
        - article [ref=f1e69]:
          - link [ref=f1e70] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/tracker-bluetooth-cles
            - figure "Balise Smartfinder 6,95 € Épuisé" [ref=f1e71]:
              - img "Balise Smartfinder" [ref=f1e73]
              - generic [ref=f1e74]:
                - heading "Balise Smartfinder" [level=2] [ref=f1e75]
                - generic [ref=f1e76]:
                  - generic [ref=f1e77]: 6,95 €
                  - generic [ref=f1e78]: Épuisé
          - button "Épuisé" [disabled] [ref=f1e82]
        - article [ref=f1e83]:
          - link [ref=f1e84] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/barre-son-tv-40w
            - figure "Barre de son TV 24,95 € Épuisé" [ref=f1e85]:
              - img "Barre de son TV" [ref=f1e87]
              - generic [ref=f1e88]:
                - heading "Barre de son TV" [level=2] [ref=f1e89]
                - generic [ref=f1e90]:
                  - generic [ref=f1e91]: 24,95 €
                  - generic [ref=f1e92]: Épuisé
          - button "Épuisé" [disabled] [ref=f1e96]
        - article [ref=f1e97]:
          - link [ref=f1e98] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/batterie-haute-capacite-20000
            - figure "Batterie externe 20000 mAh 18,95 € Épuisé" [ref=f1e99]:
              - img "Batterie externe 20000 mAh" [ref=f1e101]
              - generic [ref=f1e102]:
                - heading "Batterie externe 20000 mAh" [level=2] [ref=f1e103]
                - generic [ref=f1e104]:
                  - generic [ref=f1e105]: 18,95 €
                  - generic [ref=f1e106]: Épuisé
          - button "Épuisé" [disabled] [ref=f1e110]
        - article [ref=f1e111]:
          - link [ref=f1e112] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/powerbank-5000mah
            - figure "Batterie externe 5000 mAh 6,27 € Épuisé" [ref=f1e113]:
              - img "Batterie externe 5000 mAh" [ref=f1e115]
              - generic [ref=f1e116]:
                - heading "Batterie externe 5000 mAh" [level=2] [ref=f1e117]
                - generic [ref=f1e118]:
                  - generic [ref=f1e119]: 6,27 €
                  - generic [ref=f1e120]: Épuisé
          - button "Épuisé" [disabled] [ref=f1e124]
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
            - figure "Câble de charge 3-en-1 6,97 € Épuisé" [ref=f1e141]:
              - img "Câble de charge 3-en-1" [ref=f1e143]
              - generic [ref=f1e144]:
                - heading "Câble de charge 3-en-1" [level=2] [ref=f1e145]
                - generic [ref=f1e146]:
                  - generic [ref=f1e147]: 6,97 €
                  - generic [ref=f1e148]: Épuisé
          - button "Épuisé" [disabled] [ref=f1e152]
        - article [ref=f1e153]:
          - link [ref=f1e154] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/cable-enrouleur-100w
            - figure "Câble de charge rétractable 4,99 € Épuisé" [ref=f1e155]:
              - img "Câble de charge rétractable" [ref=f1e157]
              - generic [ref=f1e158]:
                - heading "Câble de charge rétractable" [level=2] [ref=f1e159]
                - generic [ref=f1e160]:
                  - generic [ref=f1e161]: 4,99 €
                  - generic [ref=f1e162]: Épuisé
          - button "Épuisé" [disabled] [ref=f1e166]
        - article [ref=f1e167]:
          - link [ref=f1e168] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/cable-donnees-silicone-2m
            - figure "Câble de données en silicone 4,95 € Bientôt épuisé" [ref=f1e169]:
              - img "Câble de données en silicone" [ref=f1e171]
              - generic [ref=f1e172]:
                - heading "Câble de données en silicone" [level=2] [ref=f1e173]
                - generic [ref=f1e174]:
                  - generic [ref=f1e175]: 4,95 €
                  - generic [ref=f1e176]: Bientôt épuisé
          - button "Ajouter au panier" [ref=f1e180] [cursor=pointer]
        - article [ref=f1e181]:
          - link [ref=f1e182] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/cable-hdmi-4k-sitecom
            - figure "Câble HDMI 4K 2,99 € Épuisé" [ref=f1e183]:
              - img "Câble HDMI 4K" [ref=f1e185]
              - generic [ref=f1e186]:
                - heading "Câble HDMI 4K" [level=2] [ref=f1e187]
                - generic [ref=f1e188]:
                  - generic [ref=f1e189]: 2,99 €
                  - generic [ref=f1e190]: Épuisé
          - button "Épuisé" [disabled] [ref=f1e194]
        - article [ref=f1e195]:
          - link [ref=f1e196] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/chargeur-allume-cigare-75w
            - figure "Chargeur de voiture 5 ports 9,95 € Épuisé" [ref=f1e197]:
              - img "Chargeur de voiture 5 ports" [ref=f1e199]
              - generic [ref=f1e200]:
                - heading "Chargeur de voiture 5 ports" [level=2] [ref=f1e201]
                - generic [ref=f1e202]:
                  - generic [ref=f1e203]: 9,95 €
                  - generic [ref=f1e204]: Épuisé
          - button "Épuisé" [disabled] [ref=f1e208]
        - article [ref=f1e209]:
          - link [ref=f1e210] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/produit/chargeur-magsafe-sans-fil
            - figure "Chargeur magnétique sans fil 8,95 € Épuisé" [ref=f1e211]:
              - img "Chargeur magnétique sans fil" [ref=f1e213]
              - generic [ref=f1e214]:
                - heading "Chargeur magnétique sans fil" [level=2] [ref=f1e215]
                - generic [ref=f1e216]:
                  - generic [ref=f1e217]: 8,95 €
                  - generic [ref=f1e218]: Épuisé
          - button "Épuisé" [disabled] [ref=f1e222]
      - navigation [ref=f1e223]:
        - button "Précédent" [disabled] [ref=f1e224]
        - generic [ref=f1e225]: Page 1 sur 2
        - button "Suivant" [ref=f1e226] [cursor=pointer]
```

# Test source

```ts
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
  200 |     );
  201 |     expect(categorie).toBeTruthy();
  202 | 
  203 |     await aller(page, `produit/${produit.slug}`);
  204 | 
  205 |     // Le lien vers la catégorie du produit est proposé…
  206 |     const libelle = donnees.produit.categorie.libelle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  207 |     const lienCategorie = page
  208 |       .locator("main")
  209 |       .getByRole("link", { name: new RegExp(`←\\s*${libelle}`) });
  210 |     await expect(lienCategorie).toBeVisible();
  211 | 
  212 |     // …et il ramène bien à la liste des produits de cette catégorie.
  213 |     await lienCategorie.click();
  214 |     await expect(page).toHaveURL(url(`categorie/${categorie.slug}`));
> 215 |     await expect(page.locator("main article")).toHaveCount(categorie.nb_produits);
      |                                                ^ Error: expect(locator).toHaveCount(expected) failed
  216 |   });
  217 | });
  218 | 
```