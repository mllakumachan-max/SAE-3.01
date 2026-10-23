# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gof-a-produits.spec.js >> US GOF-a — Gestion des produits >> DoD — Téléversement et redimensionnement des images (API)
- Location: tests/gof-a-produits.spec.js:276:3

# Error details

```
TypeError: Cannot read properties of undefined (reading 'chemin')
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - banner [ref=f1e4]:
    - figure "Tableau de bord Produits Catégories Commandes" [ref=f1e5]:
      - generic [ref=f1e6]:
        - link "Logo de l'application Administration" [ref=f1e7] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/admin
          - img "Logo de l'application" [ref=f1e8]
          - generic [ref=f1e9]: Administration
        - generic [ref=f1e10]:
          - link "Voir le site ↗" [ref=f1e11] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/
          - button "Changer de thème" [ref=f1e12] [cursor=pointer]
  - main [ref=f1e15]:
    - generic [ref=f1e16]:
      - generic [ref=f1e17]:
        - heading "Gestion des produits" [level=1] [ref=f1e18]
        - button "Nouveau produit" [ref=f1e19] [cursor=pointer]
      - generic [ref=f1e20]:
        - generic [ref=f1e21]:
          - text: Trier par
          - combobox "Trier par" [ref=f1e22]:
            - option "Nom (A → Z)" [selected]
            - option "Prix (croissant)"
            - option "Catégorie (A → Z)"
            - option "Stock (croissant)"
            - option "État (épuisé en premier)"
        - generic [ref=f1e23]:
          - text: Produits par page
          - combobox "Produits par page" [ref=f1e24]:
            - option "12 produits" [selected]
            - option "24 produits"
            - option "48 produits"
        - generic [ref=f1e25]: 101 produits
      - table [ref=f1e27]:
        - rowgroup [ref=f1e28]:
          - row [ref=f1e29]:
            - columnheader "Produit" [ref=f1e30]
            - columnheader "Catégorie" [ref=f1e31]
            - columnheader "Prix" [ref=f1e32]
            - columnheader "Stock" [ref=f1e33]
            - columnheader "État" [ref=f1e34]
            - columnheader "Actions" [ref=f1e35]
        - rowgroup [ref=f1e37]:
          - row [ref=f1e38]:
            - cell "Amplificateur Wi-Fi" [ref=f1e39]
            - cell "Multimédia" [ref=f1e40]
            - cell "19.95 €" [ref=f1e41]
            - cell "0" [ref=f1e42]
            - cell "Épuisé" [ref=f1e43]
            - cell [ref=f1e47]:
              - button "Modifier" [ref=f1e48] [cursor=pointer]
              - button "Supprimer" [ref=f1e49] [cursor=pointer]
          - row [ref=f1e50]:
            - cell "Balise Smartfinder" [ref=f1e51]
            - cell "Multimédia" [ref=f1e52]
            - cell "6.95 €" [ref=f1e53]
            - cell "0" [ref=f1e54]
            - cell "Épuisé" [ref=f1e55]
            - cell [ref=f1e59]:
              - button "Modifier" [ref=f1e60] [cursor=pointer]
              - button "Supprimer" [ref=f1e61] [cursor=pointer]
          - row [ref=f1e62]:
            - cell "Barre de son TV" [ref=f1e63]
            - cell "Multimédia" [ref=f1e64]
            - cell "24.95 €" [ref=f1e65]
            - cell "0" [ref=f1e66]
            - cell "Épuisé" [ref=f1e67]
            - cell [ref=f1e71]:
              - button "Modifier" [ref=f1e72] [cursor=pointer]
              - button "Supprimer" [ref=f1e73] [cursor=pointer]
          - row [ref=f1e74]:
            - cell "Batterie externe 20000 mAh" [ref=f1e75]
            - cell "Multimédia" [ref=f1e76]
            - cell "18.95 €" [ref=f1e77]
            - cell "0" [ref=f1e78]
            - cell "Épuisé" [ref=f1e79]
            - cell [ref=f1e83]:
              - button "Modifier" [ref=f1e84] [cursor=pointer]
              - button "Supprimer" [ref=f1e85] [cursor=pointer]
          - row [ref=f1e86]:
            - cell "Batterie externe 5000 mAh" [ref=f1e87]
            - cell "Multimédia" [ref=f1e88]
            - cell "6.27 €" [ref=f1e89]
            - cell "0" [ref=f1e90]
            - cell "Épuisé" [ref=f1e91]
            - cell [ref=f1e95]:
              - button "Modifier" [ref=f1e96] [cursor=pointer]
              - button "Supprimer" [ref=f1e97] [cursor=pointer]
          - row [ref=f1e98]:
            - cell "Bloc d'aquarelle" [ref=f1e99]
            - cell "Hobby" [ref=f1e100]
            - cell "1.99 €" [ref=f1e101]
            - cell "0" [ref=f1e102]
            - cell "Épuisé" [ref=f1e103]
            - cell [ref=f1e107]:
              - button "Modifier" [ref=f1e108] [cursor=pointer]
              - button "Supprimer" [ref=f1e109] [cursor=pointer]
          - row [ref=f1e110]:
            - cell "Boîte à outils 95 pièces" [ref=f1e111]
            - cell "Bricolage" [ref=f1e112]
            - cell "39.95 €" [ref=f1e113]
            - cell "0" [ref=f1e114]
            - cell "Épuisé" [ref=f1e115]
            - cell [ref=f1e119]:
              - button "Modifier" [ref=f1e120] [cursor=pointer]
              - button "Supprimer" [ref=f1e121] [cursor=pointer]
          - row [ref=f1e122]:
            - cell "Boîte de forets et d'embouts Werckmann" [ref=f1e123]
            - cell "Bricolage" [ref=f1e124]
            - cell "5.99 €" [ref=f1e125]
            - cell "0" [ref=f1e126]
            - cell "Épuisé" [ref=f1e127]
            - cell [ref=f1e131]:
              - button "Modifier" [ref=f1e132] [cursor=pointer]
              - button "Supprimer" [ref=f1e133] [cursor=pointer]
          - row [ref=f1e134]:
            - cell "Boîte de rangement Werckmann" [ref=f1e135]
            - cell "Bricolage" [ref=f1e136]
            - cell "9.99 €" [ref=f1e137]
            - cell "0" [ref=f1e138]
            - cell "Épuisé" [ref=f1e139]
            - cell [ref=f1e143]:
              - button "Modifier" [ref=f1e144] [cursor=pointer]
              - button "Supprimer" [ref=f1e145] [cursor=pointer]
          - row [ref=f1e146]:
            - cell "Boîtes à outils Keter" [ref=f1e147]
            - cell "Bricolage" [ref=f1e148]
            - cell "8.99 €" [ref=f1e149]
            - cell "0" [ref=f1e150]
            - cell "Épuisé" [ref=f1e151]
            - cell [ref=f1e155]:
              - button "Modifier" [ref=f1e156] [cursor=pointer]
              - button "Supprimer" [ref=f1e157] [cursor=pointer]
          - row [ref=f1e158]:
            - cell "Boîtier de synchronisation HDMI" [ref=f1e159]
            - cell "Multimédia" [ref=f1e160]
            - cell "34.95 €" [ref=f1e161]
            - cell "42" [ref=f1e162]
            - cell "En stock" [ref=f1e163]
            - cell [ref=f1e167]:
              - button "Modifier" [ref=f1e168] [cursor=pointer]
              - button "Supprimer" [ref=f1e169] [cursor=pointer]
          - row [ref=f1e170]:
            - cell "Boule lumineuse" [ref=f1e171]
            - cell "Habitat" [ref=f1e172]
            - cell "3.99 €" [ref=f1e173]
            - cell "0" [ref=f1e174]
            - cell "Épuisé" [ref=f1e175]
            - cell [ref=f1e179]:
              - button "Modifier" [ref=f1e180] [cursor=pointer]
              - button "Supprimer" [ref=f1e181] [cursor=pointer]
      - navigation [ref=f1e182]:
        - button "Précédent" [disabled] [ref=f1e183]
        - generic [ref=f1e184]: Page 1 sur 9
        - button "Suivant" [ref=f1e185] [cursor=pointer]
```

# Test source

```ts
  190 |       name: "test.png",
  191 |       mimeType: "image/png",
  192 |       buffer: PNG_1X1,
  193 |     });
  194 |     await page.getByRole("button", { name: "Enregistrer" }).click();
  195 |     await expect(page.getByText(`Produit « ${nom} » enregistré.`)).toBeVisible();
  196 | 
  197 |     const { donnees } = await api(page, "admin/produits");
  198 |     const cree = donnees.produits.find((/** @type {ProduitApi} */ produit) => produit.nom === nom);
  199 |     crees.push(cree.id);
  200 |     expect(cree.images).toHaveLength(1);
  201 |     expect(cree.images[0].chemin).toMatch(/^uploads\/produits\/produit-\d+-[0-9a-f]+\.jpg$/);
  202 | 
  203 |     await ligneProduit(page, nom).getByRole("button", { name: "Modifier" }).click();
  204 |     const vignette = page.locator('[data-zone="images"] img');
  205 |     await expect(vignette).toHaveCount(1);
  206 |     await expect(vignette).toHaveAttribute("src", /uploads\/produits\//);
  207 | 
  208 |     await page.locator('[data-zone="images"]').getByRole("button", { name: "Supprimer l\'image" }).click();
  209 |     await expect(page.getByText("Image supprimée.")).toBeVisible();
  210 |     await expect(page.locator('[data-zone="images"] img')).toHaveCount(0);
  211 |   });
  212 | 
  213 |   test("CA — Je peux fixer le prix, le stock et le seuil d'alerte", async ({ page }) => {
  214 |     const nom = nomUnique("Produit stock");
  215 |     await page.getByRole("button", { name: "Nouveau produit" }).click();
  216 |     await remplirFormulaire(page, { nom, prix: 7.25, stock: 2, seuil: 6 });
  217 |     await page.getByRole("button", { name: "Enregistrer" }).click();
  218 |     await expect(page.getByText(`Produit « ${nom} » enregistré.`)).toBeVisible();
  219 | 
  220 |     const { donnees } = await api(page, "admin/produits");
  221 |     const cree = donnees.produits.find((/** @type {ProduitApi} */ produit) => produit.nom === nom);
  222 |     crees.push(cree.id);
  223 |     expect(cree.prix).toBe("7.25");
  224 |     expect(cree.stock).toBe(2);
  225 |     expect(cree.seuil_alerte).toBe(6);
  226 |     await expect(ligneProduit(page, nom)).toContainText("Bientôt épuisé");
  227 |   });
  228 | 
  229 |   test("Validation — un nom vide ou un prix négatif est refusé", async ({ page }) => {
  230 |     await page.getByRole("button", { name: "Nouveau produit" }).click();
  231 |     const formulaire = page.locator("form").first();
  232 | 
  233 |     await formulaire.locator('select[name="categorieId"]').selectOption({ label: "Bricolage" });
  234 |     await formulaire.locator('input[name="prix"]').fill("12");
  235 |     await page.getByRole("button", { name: "Enregistrer" }).click();
  236 |     await expect(page.locator('[data-zone="message"]')).toHaveText("Le nom du produit est obligatoire.");
  237 | 
  238 |     await formulaire.locator('input[name="nom"]').fill("Produit invalide");
  239 |     await formulaire.locator('input[name="prix"]').fill("-3");
  240 |     await page.getByRole("button", { name: "Enregistrer" }).click();
  241 |     await expect(page.locator('[data-zone="message"]')).toHaveText(/Le prix doit être un nombre positif/);
  242 | 
  243 |     const { donnees } = await api(page, "admin/produits");
  244 |     expect(
  245 |       donnees.produits.find((/** @type {ProduitApi} */ produit) => produit.nom === "Produit invalide")
  246 |     ).toBeUndefined();
  247 |   });
  248 | 
  249 |   test("DoD — CRUD complet des produits (API)", async ({ page }) => {
  250 |     const nom = nomUnique("Produit CRUD");
  251 |     const creation = await api(page, "admin/produits", {
  252 |       method: "POST",
  253 |       body: produitValide(nom),
  254 |     });
  255 |     expect(creation.statut).toBe(201);
  256 |     const id = creation.donnees.produit.id;
  257 |     crees.push(id);
  258 | 
  259 |     const liste = await api(page, "admin/produits");
  260 |     expect(liste.statut).toBe(200);
  261 |     expect(liste.donnees.produits.some((/** @type {ProduitApi} */ produit) => produit.id === id)).toBe(true);
  262 | 
  263 |     const modification = await api(page, `admin/produits/${id}`, {
  264 |       method: "PUT",
  265 |       body: produitValide(`${nom} édité`, { stock: 9, seuil_alerte: 1 }),
  266 |     });
  267 |     expect(modification.statut).toBe(200);
  268 |     expect(modification.donnees.produit.nom).toBe(`${nom} édité`);
  269 |     expect(modification.donnees.produit.stock).toBe(9);
  270 | 
  271 |     const suppression = await api(page, `admin/produits/${id}`, { method: "DELETE" });
  272 |     expect(suppression.statut).toBe(200);
  273 |     crees = crees.filter((produitId) => produitId !== id);
  274 |   });
  275 | 
  276 |   test("DoD — Téléversement et redimensionnement des images (API)", async ({ page }) => {
  277 |     const creation = await api(page, "admin/produits", {
  278 |       method: "POST",
  279 |       body: produitValide(nomUnique("Produit redim")),
  280 |     });
  281 |     const id = creation.donnees.produit.id;
  282 |     crees.push(id);
  283 | 
  284 |     const image = `data:image/png;base64,${PNG_1X1.toString("base64")}`;
  285 |     const ajout = await api(page, `admin/produits/${id}/images`, {
  286 |       method: "POST",
  287 |       body: { image, texte_alternatif: creation.donnees.produit.nom },
  288 |     });
  289 |     expect(ajout.statut).toBe(201);
> 290 |     expect(ajout.donnees.image.chemin).toMatch(/\.jpg$/);
      |                                ^ TypeError: Cannot read properties of undefined (reading 'chemin')
  291 | 
  292 |     const texte = `data:text/plain;base64,${Buffer.from("pas une image").toString("base64")}`;
  293 |     const refus = await api(page, `admin/produits/${id}/images`, {
  294 |       method: "POST",
  295 |       body: { image: texte },
  296 |     });
  297 |     expect(refus.statut).toBe(400);
  298 |   });
  299 | 
  300 |   test("Droits — un visiteur sans session est refusé (401)", async ({ page }) => {
  301 |     await api(page, "logout", { method: "POST" });
  302 |     const { statut } = await api(page, "admin/produits");
  303 |     expect(statut).toBe(401);
  304 |   });
  305 | 
  306 |   test("Droits — un client connecté est refusé (403)", async ({ page }) => {
  307 |     await api(page, "logout", { method: "POST" });
  308 |     await api(page, "login", { method: "POST", body: COMPTES.client });
  309 |     const { statut } = await api(page, "admin/produits");
  310 |     expect(statut).toBe(403);
  311 |     const ecriture = await api(page, "admin/produits", {
  312 |       method: "POST",
  313 |       body: produitValide("Interdit"),
  314 |     });
  315 |     expect(ecriture.statut).toBe(403);
  316 |   });
  317 | 
  318 |   test("Serveur — une référence déjà utilisée est refusée (409)", async ({ page }) => {
  319 |     const reference = String(Math.floor(1000000 + Math.random() * 8999999));
  320 |     const premiere = await api(page, "admin/produits", {
  321 |       method: "POST",
  322 |       body: produitValide(nomUnique("Produit ref"), { reference }),
  323 |     });
  324 |     expect(premiere.statut).toBe(201);
  325 |     crees.push(premiere.donnees.produit.id);
  326 | 
  327 |     const doublon = await api(page, "admin/produits", {
  328 |       method: "POST",
  329 |       body: produitValide(nomUnique("Doublon"), { reference }),
  330 |     });
  331 |     expect(doublon.statut).toBe(409);
  332 |   });
  333 | 
  334 |   test("Serveur — un stock négatif ou une catégorie inconnue est refusé (400)", async ({ page }) => {
  335 |     const negatif = await api(page, "admin/produits", {
  336 |       method: "POST",
  337 |       body: produitValide(nomUnique("Stock neg"), { stock: -2 }),
  338 |     });
  339 |     expect(negatif.statut).toBe(400);
  340 | 
  341 |     const inconnue = await api(page, "admin/produits", {
  342 |       method: "POST",
  343 |       body: produitValide(nomUnique("Cat inconnue"), { categorie_id: 999 }),
  344 |     });
  345 |     expect(inconnue.statut).toBe(400);
  346 |   });
  347 | 
  348 |   test("Serveur — modifier ou supprimer un produit absent renvoie 404", async ({ page }) => {
  349 |     const modification = await api(page, "admin/produits/999999", {
  350 |       method: "PUT",
  351 |       body: produitValide("Produit absent"),
  352 |     });
  353 |     expect(modification.statut).toBe(404);
  354 |     const suppression = await api(page, "admin/produits/999999", { method: "DELETE" });
  355 |     expect(suppression.statut).toBe(404);
  356 |   });
  357 | 
  358 |   test("Serveur — le slug reste stable après modification", async ({ page }) => {
  359 |     const nom = nomUnique("Slug stable");
  360 |     const creation = await api(page, "admin/produits", {
  361 |       method: "POST",
  362 |       body: produitValide(nom),
  363 |     });
  364 |     const id = creation.donnees.produit.id;
  365 |     crees.push(id);
  366 |     const slug = creation.donnees.produit.slug;
  367 | 
  368 |     const modification = await api(page, `admin/produits/${id}`, {
  369 |       method: "PUT",
  370 |       body: produitValide(`${nom} autre nom`),
  371 |     });
  372 |     expect(modification.donnees.produit.slug).toBe(slug);
  373 |   });
  374 | 
  375 |   test("Page — un visiteur non connecté voit le message d'accès réservé", async ({ page }) => {
  376 |     await api(page, "logout", { method: "POST" });
  377 |     await aller(page, "admin/produits");
  378 |     await attendreApp(page);
  379 |     await expect(page.getByText("Cette page est réservée à l'administrateur.")).toBeVisible();
  380 |     await expect(page.getByRole("button", { name: "Nouveau produit" })).toBeHidden();
  381 |   });
  382 | 
  383 |   test("CA — Je peux trier et choisir le nombre de produits par page", async ({ page }) => {
  384 |     const { statut, donnees: initial } = await api(page, "admin/produits?page=1");
  385 |     expect(statut).toBe(200);
  386 |     expect(initial.total).toBeGreaterThan(0);
  387 |     await expect(page.locator('select[name="tri"]')).toHaveValue(initial.tri);
  388 |     await expect(page.locator('select[name="parPage"]')).toHaveValue(String(initial.parPage));
  389 |     await expect(page.locator("tbody tr")).toHaveCount(Math.min(initial.total, initial.parPage));
  390 | 
```