# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dec-c-produit.spec.js >> US DEC-c — Détail d'un produit >> DoD — La page produit a des métadonnées pour le SEO
- Location: tests/dec-c-produit.spec.js:160:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.getAttribute: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('meta[property="og:image"]')

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
            - link "Multimédia" [ref=f1e46] [cursor=pointer]:
              - /url: /~ribatet1/SAE-3.01/Base/categorie/multimedia
            - generic [aria-hidden] [ref=f1e47]: /
          - listitem [ref=f1e48]:
            - generic [ref=f1e49]: Amplificateur Wi-Fi
      - article [ref=f1e50]:
        - list [ref=f1e51]:
          - listitem [ref=f1e52]:
            - link "← Tous les produits" [ref=f1e53] [cursor=pointer]:
              - /url: /~ribatet1/SAE-3.01/Base/
          - listitem [ref=f1e54]:
            - link "← Multimédia" [ref=f1e55] [cursor=pointer]:
              - /url: /~ribatet1/SAE-3.01/Base/categorie/multimedia
        - figure [ref=f1e56]:
          - figure [ref=f1e57]:
            - paragraph [ref=f1e60]: "{{numero-img}} / 1"
          - generic [ref=f1e61]:
            - generic [ref=f1e62]:
              - heading "Amplificateur Wi-Fi" [level=1] [ref=f1e63]
              - generic [ref=f1e64]: En stock
            - paragraph [ref=f1e67]: 19,95 €
            - paragraph [ref=f1e68]: Étend la couverture réseau pour éliminer les zones mortes dans la maison.
            - generic [ref=f1e69]:
              - text: Quantité
              - generic [ref=f1e70]:
                - button "Diminuer la quantité" [disabled] [ref=f1e71]: −
                - spinbutton "Quantité" [ref=f1e72]: "1"
                - button "Augmenter la quantité" [ref=f1e73] [cursor=pointer]: +
            - button "Ajouter au panier" [ref=f1e74] [cursor=pointer]
```

# Test source

```ts
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
  99  |     await expect(bouton).toBeEnabled();
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
> 188 |     const imagePartage = await page.locator('meta[property="og:image"]').getAttribute("content");
      |                                                                          ^ Error: locator.getAttribute: Test timeout of 30000ms exceeded.
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
  215 |     await expect(page.locator("main article")).toHaveCount(categorie.nb_produits);
  216 |   });
  217 | });
  218 | 
```