# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gof-a-produits.spec.js >> US GOF-a — Gestion des produits >> CA — Je peux téléverser une image, puis la supprimer
- Location: tests/gof-a-produits.spec.js:185:3

# Error details

```
TypeError: Cannot read properties of undefined (reading 'id')
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
      - status [ref=f1e20]: Produit « Produit image 1792746201941-888 » enregistré.
      - generic [ref=f1e21]:
        - generic [ref=f1e22]:
          - text: Trier par
          - combobox "Trier par" [ref=f1e23]:
            - option "Nom (A → Z)" [selected]
            - option "Prix (croissant)"
            - option "Catégorie (A → Z)"
            - option "Stock (croissant)"
            - option "État (épuisé en premier)"
        - generic [ref=f1e24]:
          - text: Produits par page
          - combobox "Produits par page" [ref=f1e25]:
            - option "12 produits" [selected]
            - option "24 produits"
            - option "48 produits"
        - generic [ref=f1e26]: 100 produits
      - table [ref=f1e28]:
        - rowgroup [ref=f1e29]:
          - row [ref=f1e30]:
            - columnheader "Produit" [ref=f1e31]
            - columnheader "Catégorie" [ref=f1e32]
            - columnheader "Prix" [ref=f1e33]
            - columnheader "Stock" [ref=f1e34]
            - columnheader "État" [ref=f1e35]
            - columnheader "Actions" [ref=f1e36]
        - rowgroup [ref=f1e38]:
          - row [ref=f1e39]:
            - cell "Amplificateur Wi-Fi" [ref=f1e40]
            - cell "Multimédia" [ref=f1e41]
            - cell "19.95 €" [ref=f1e42]
            - cell "0" [ref=f1e43]
            - cell "Épuisé" [ref=f1e44]
            - cell [ref=f1e48]:
              - button "Modifier" [ref=f1e49] [cursor=pointer]
              - button "Supprimer" [ref=f1e50] [cursor=pointer]
          - row [ref=f1e51]:
            - cell "Balise Smartfinder" [ref=f1e52]
            - cell "Multimédia" [ref=f1e53]
            - cell "6.95 €" [ref=f1e54]
            - cell "0" [ref=f1e55]
            - cell "Épuisé" [ref=f1e56]
            - cell [ref=f1e60]:
              - button "Modifier" [ref=f1e61] [cursor=pointer]
              - button "Supprimer" [ref=f1e62] [cursor=pointer]
          - row [ref=f1e63]:
            - cell "Barre de son TV" [ref=f1e64]
            - cell "Multimédia" [ref=f1e65]
            - cell "24.95 €" [ref=f1e66]
            - cell "0" [ref=f1e67]
            - cell "Épuisé" [ref=f1e68]
            - cell [ref=f1e72]:
              - button "Modifier" [ref=f1e73] [cursor=pointer]
              - button "Supprimer" [ref=f1e74] [cursor=pointer]
          - row [ref=f1e75]:
            - cell "Batterie externe 20000 mAh" [ref=f1e76]
            - cell "Multimédia" [ref=f1e77]
            - cell "18.95 €" [ref=f1e78]
            - cell "0" [ref=f1e79]
            - cell "Épuisé" [ref=f1e80]
            - cell [ref=f1e84]:
              - button "Modifier" [ref=f1e85] [cursor=pointer]
              - button "Supprimer" [ref=f1e86] [cursor=pointer]
          - row [ref=f1e87]:
            - cell "Batterie externe 5000 mAh" [ref=f1e88]
            - cell "Multimédia" [ref=f1e89]
            - cell "6.27 €" [ref=f1e90]
            - cell "0" [ref=f1e91]
            - cell "Épuisé" [ref=f1e92]
            - cell [ref=f1e96]:
              - button "Modifier" [ref=f1e97] [cursor=pointer]
              - button "Supprimer" [ref=f1e98] [cursor=pointer]
          - row [ref=f1e99]:
            - cell "Bloc d'aquarelle" [ref=f1e100]
            - cell "Hobby" [ref=f1e101]
            - cell "1.99 €" [ref=f1e102]
            - cell "0" [ref=f1e103]
            - cell "Épuisé" [ref=f1e104]
            - cell [ref=f1e108]:
              - button "Modifier" [ref=f1e109] [cursor=pointer]
              - button "Supprimer" [ref=f1e110] [cursor=pointer]
          - row [ref=f1e111]:
            - cell "Boîte à outils 95 pièces" [ref=f1e112]
            - cell "Bricolage" [ref=f1e113]
            - cell "39.95 €" [ref=f1e114]
            - cell "0" [ref=f1e115]
            - cell "Épuisé" [ref=f1e116]
            - cell [ref=f1e120]:
              - button "Modifier" [ref=f1e121] [cursor=pointer]
              - button "Supprimer" [ref=f1e122] [cursor=pointer]
          - row [ref=f1e123]:
            - cell "Boîte de forets et d'embouts Werckmann" [ref=f1e124]
            - cell "Bricolage" [ref=f1e125]
            - cell "5.99 €" [ref=f1e126]
            - cell "0" [ref=f1e127]
            - cell "Épuisé" [ref=f1e128]
            - cell [ref=f1e132]:
              - button "Modifier" [ref=f1e133] [cursor=pointer]
              - button "Supprimer" [ref=f1e134] [cursor=pointer]
          - row [ref=f1e135]:
            - cell "Boîte de rangement Werckmann" [ref=f1e136]
            - cell "Bricolage" [ref=f1e137]
            - cell "9.99 €" [ref=f1e138]
            - cell "0" [ref=f1e139]
            - cell "Épuisé" [ref=f1e140]
            - cell [ref=f1e144]:
              - button "Modifier" [ref=f1e145] [cursor=pointer]
              - button "Supprimer" [ref=f1e146] [cursor=pointer]
          - row [ref=f1e147]:
            - cell "Boîtes à outils Keter" [ref=f1e148]
            - cell "Bricolage" [ref=f1e149]
            - cell "8.99 €" [ref=f1e150]
            - cell "0" [ref=f1e151]
            - cell "Épuisé" [ref=f1e152]
            - cell [ref=f1e156]:
              - button "Modifier" [ref=f1e157] [cursor=pointer]
              - button "Supprimer" [ref=f1e158] [cursor=pointer]
          - row [ref=f1e159]:
            - cell "Boîtier de synchronisation HDMI" [ref=f1e160]
            - cell "Multimédia" [ref=f1e161]
            - cell "34.95 €" [ref=f1e162]
            - cell "42" [ref=f1e163]
            - cell "En stock" [ref=f1e164]
            - cell [ref=f1e168]:
              - button "Modifier" [ref=f1e169] [cursor=pointer]
              - button "Supprimer" [ref=f1e170] [cursor=pointer]
          - row [ref=f1e171]:
            - cell "Boule lumineuse" [ref=f1e172]
            - cell "Habitat" [ref=f1e173]
            - cell "3.99 €" [ref=f1e174]
            - cell "0" [ref=f1e175]
            - cell "Épuisé" [ref=f1e176]
            - cell [ref=f1e180]:
              - button "Modifier" [ref=f1e181] [cursor=pointer]
              - button "Supprimer" [ref=f1e182] [cursor=pointer]
      - navigation [ref=f1e183]:
        - button "Précédent" [disabled] [ref=f1e184]
        - generic [ref=f1e185]: Page 1 sur 9
        - button "Suivant" [ref=f1e186] [cursor=pointer]
```

# Test source

```ts
  99  | 
  100 |   test("UI — Le formulaire de produit s'affiche seul pendant la modification", async ({ page }) => {
  101 |     const ligne = page.locator("tbody tr").first();
  102 |     await expect(ligne).toBeVisible();
  103 |     await ligne.getByRole("button", { name: "Modifier" }).click();
  104 | 
  105 |     await expect(page.getByRole("heading", { name: "Modifier le produit" })).toBeVisible();
  106 |     await expect(page.locator("tbody")).toHaveCount(0);
  107 |     await expect(page.locator('select[name="tri"]')).toHaveCount(0);
  108 |     await expect(page.locator('select[name="parPage"]')).toHaveCount(0);
  109 |     await expect(page.getByRole("button", { name: "Nouveau produit" })).toBeHidden();
  110 | 
  111 |     await page.getByRole("button", { name: "Annuler" }).click();
  112 |     await expect(page.locator("tbody tr").first()).toBeVisible();
  113 |     await expect(page.locator('select[name="tri"]')).toBeVisible();
  114 |   });
  115 | 
  116 |   test("UI — La confirmation de suppression produit apparaît en fenêtre superposée", async ({ page }) => {
  117 |     const ligne = page.locator("tbody tr").first();
  118 |     await expect(ligne).toBeVisible();
  119 |     await ligne.getByRole("button", { name: "Supprimer" }).click();
  120 | 
  121 |     const overlay = page.locator('[data-zone="overlay"]');
  122 |     const dialogue = page.getByRole("dialog");
  123 |     await expect(dialogue).toBeVisible();
  124 |     await expect(overlay).toHaveCSS("position", "fixed");
  125 |     await expect(overlay).toHaveCSS("z-index", "50");
  126 |     await expect(overlay).toHaveCSS("background-color", "oklab(0 0 0 / 0.4)");
  127 | 
  128 |     await dialogue.getByRole("button", { name: "Annuler" }).click();
  129 |     await expect(page.getByRole("dialog")).toHaveCount(0);
  130 |   });
  131 | 
  132 |   test("CA — Je peux modifier un produit existant", async ({ page }) => {
  133 |     const nom = nomUnique("Produit modif");
  134 |     const { donnees } = await api(page, "admin/produits", {
  135 |       method: "POST",
  136 |       body: produitValide(nom),
  137 |     });
  138 |     crees.push(donnees.produit.id);
  139 |     await aller(page, "admin/produits");
  140 | 
  141 |     await ligneProduit(page, nom).getByRole("button", { name: "Modifier" }).click();
  142 |     await expect(page.locator("tbody")).toHaveCount(0);
  143 |     await expect(page.locator('select[name="tri"]')).toHaveCount(0);
  144 |     await expect(page.locator('select[name="parPage"]')).toHaveCount(0);
  145 |     await expect(page.getByRole("button", { name: "Nouveau produit" })).toBeHidden();
  146 |     const nouveauNom = `${nom} modifié`;
  147 |     await remplirFormulaire(page, { nom: nouveauNom, prix: 9.9, stock: 0, seuil: 2 });
  148 |     await expect(page.getByRole("heading", { name: "Modifier le produit" })).toBeVisible();
  149 |     await page.getByRole("button", { name: "Enregistrer" }).click();
  150 | 
  151 |     await expect(page.getByText(`Produit « ${nouveauNom} » enregistré.`)).toBeVisible();
  152 |     await expect(ligneProduit(page, nouveauNom)).toBeVisible();
  153 |     await expect(page.locator('select[name="tri"]')).toBeVisible();
  154 |     await expect(ligneProduit(page, nouveauNom)).toContainText("9.9");
  155 |   });
  156 | 
  157 |   test("CA — Je peux supprimer un produit, après confirmation", async ({ page }) => {
  158 |     const nom = nomUnique("Produit suppr");
  159 |     const { donnees } = await api(page, "admin/produits", {
  160 |       method: "POST",
  161 |       body: produitValide(nom),
  162 |     });
  163 |     const id = donnees.produit.id;
  164 |     await aller(page, "admin/produits");
  165 | 
  166 |     await ligneProduit(page, nom).getByRole("button", { name: "Supprimer" }).click();
  167 |     const dialogue = page.getByRole("dialog");
  168 |     await expect(dialogue).toContainText(nom);
  169 |     const overlay = page.locator('[data-zone="overlay"]');
  170 |     await expect(overlay).toHaveCSS("position", "fixed");
  171 |     await expect(overlay).toHaveCSS("z-index", "50");
  172 |     await expect(overlay).toHaveCSS("background-color", "oklab(0 0 0 / 0.4)");
  173 |     await dialogue.getByRole("button", { name: "Annuler" }).click();
  174 |     await expect(ligneProduit(page, nom)).toBeVisible();
  175 | 
  176 |     await ligneProduit(page, nom).getByRole("button", { name: "Supprimer" }).click();
  177 |     await page.getByRole("dialog").getByRole("button", { name: "Supprimer" }).click();
  178 |     await expect(page.getByText(`Produit « ${nom} » supprimé.`)).toBeVisible();
  179 |     await expect(ligneProduit(page, nom)).toHaveCount(0);
  180 | 
  181 |     const { statut } = await api(page, `admin/produits/${id}`, { method: "DELETE" });
  182 |     expect(statut).toBe(404);
  183 |   });
  184 | 
  185 |   test("CA — Je peux téléverser une image, puis la supprimer", async ({ page }) => {
  186 |     const nom = nomUnique("Produit image");
  187 |     await page.getByRole("button", { name: "Nouveau produit" }).click();
  188 |     await remplirFormulaire(page, { nom, prix: 5, stock: 1, seuil: 1 });
  189 |     await page.locator('input[name="image"]').setInputFiles({
  190 |       name: "test.png",
  191 |       mimeType: "image/png",
  192 |       buffer: PNG_1X1,
  193 |     });
  194 |     await page.getByRole("button", { name: "Enregistrer" }).click();
  195 |     await expect(page.getByText(`Produit « ${nom} » enregistré.`)).toBeVisible();
  196 | 
  197 |     const { donnees } = await api(page, "admin/produits");
  198 |     const cree = donnees.produits.find((/** @type {ProduitApi} */ produit) => produit.nom === nom);
> 199 |     crees.push(cree.id);
      |                     ^ TypeError: Cannot read properties of undefined (reading 'id')
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
  290 |     expect(ajout.donnees.image.chemin).toMatch(/\.jpg$/);
  291 | 
  292 |     const texte = `data:text/plain;base64,${Buffer.from("pas une image").toString("base64")}`;
  293 |     const refus = await api(page, `admin/produits/${id}/images`, {
  294 |       method: "POST",
  295 |       body: { image: texte },
  296 |     });
  297 |     expect(refus.statut).toBe(400);
  298 |   });
  299 | 
```