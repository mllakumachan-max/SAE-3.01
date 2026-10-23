# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gof-a-produits.spec.js >> US GOF-a — Gestion des produits >> CA — Je peux ajouter un produit avec ses informations
- Location: tests/gof-a-produits.spec.js:82:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('tr').filter({ hasText: 'Produit ajout 1792746130437-230' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('tr').filter({ hasText: 'Produit ajout 1792746130437-230' }) with timeout 5000ms
  - waiting for locator('tr').filter({ hasText: 'Produit ajout 1792746130437-230' })

```

```yaml
- banner:
  - figure "Tableau de bord Produits Catégories Commandes":
    - link "Logo de l'application Administration":
      - /url: /~ribatet1/SAE-3.01/Base/admin
      - img "Logo de l'application"
      - text: Administration
    - link "Voir le site ↗":
      - /url: /~ribatet1/SAE-3.01/Base/
    - button "Changer de thème"
- main:
  - heading "Gestion des produits" [level=1]
  - button "Nouveau produit"
  - status: Produit « Produit ajout 1792746130437-230 » enregistré.
  - text: Trier par
  - combobox "Trier par":
    - option "Nom (A → Z)" [selected]
    - option "Prix (croissant)"
    - option "Catégorie (A → Z)"
    - option "Stock (croissant)"
    - option "État (épuisé en premier)"
  - text: Produits par page
  - combobox "Produits par page":
    - option "12 produits" [selected]
    - option "24 produits"
    - option "48 produits"
  - text: 98 produits
  - table:
    - rowgroup:
      - row "Produit Catégorie Prix Stock État Actions":
        - columnheader "Produit"
        - columnheader "Catégorie"
        - columnheader "Prix"
        - columnheader "Stock"
        - columnheader "État"
        - columnheader "Actions"
    - rowgroup:
      - row "Amplificateur Wi-Fi Multimédia 19.95 € 0 Épuisé Modifier Supprimer":
        - cell "Amplificateur Wi-Fi"
        - cell "Multimédia"
        - cell "19.95 €"
        - cell "0"
        - cell "Épuisé"
        - cell "Modifier Supprimer":
          - button "Modifier"
          - button "Supprimer"
      - row "Balise Smartfinder Multimédia 6.95 € 0 Épuisé Modifier Supprimer":
        - cell "Balise Smartfinder"
        - cell "Multimédia"
        - cell "6.95 €"
        - cell "0"
        - cell "Épuisé"
        - cell "Modifier Supprimer":
          - button "Modifier"
          - button "Supprimer"
      - row "Barre de son TV Multimédia 24.95 € 0 Épuisé Modifier Supprimer":
        - cell "Barre de son TV"
        - cell "Multimédia"
        - cell "24.95 €"
        - cell "0"
        - cell "Épuisé"
        - cell "Modifier Supprimer":
          - button "Modifier"
          - button "Supprimer"
      - row "Batterie externe 20000 mAh Multimédia 18.95 € 0 Épuisé Modifier Supprimer":
        - cell "Batterie externe 20000 mAh"
        - cell "Multimédia"
        - cell "18.95 €"
        - cell "0"
        - cell "Épuisé"
        - cell "Modifier Supprimer":
          - button "Modifier"
          - button "Supprimer"
      - row "Batterie externe 5000 mAh Multimédia 6.27 € 0 Épuisé Modifier Supprimer":
        - cell "Batterie externe 5000 mAh"
        - cell "Multimédia"
        - cell "6.27 €"
        - cell "0"
        - cell "Épuisé"
        - cell "Modifier Supprimer":
          - button "Modifier"
          - button "Supprimer"
      - row "Bloc d'aquarelle Hobby 1.99 € 0 Épuisé Modifier Supprimer":
        - cell "Bloc d'aquarelle"
        - cell "Hobby"
        - cell "1.99 €"
        - cell "0"
        - cell "Épuisé"
        - cell "Modifier Supprimer":
          - button "Modifier"
          - button "Supprimer"
      - row "Boîte à outils 95 pièces Bricolage 39.95 € 0 Épuisé Modifier Supprimer":
        - cell "Boîte à outils 95 pièces"
        - cell "Bricolage"
        - cell "39.95 €"
        - cell "0"
        - cell "Épuisé"
        - cell "Modifier Supprimer":
          - button "Modifier"
          - button "Supprimer"
      - row "Boîte de forets et d'embouts Werckmann Bricolage 5.99 € 0 Épuisé Modifier Supprimer":
        - cell "Boîte de forets et d'embouts Werckmann"
        - cell "Bricolage"
        - cell "5.99 €"
        - cell "0"
        - cell "Épuisé"
        - cell "Modifier Supprimer":
          - button "Modifier"
          - button "Supprimer"
      - row "Boîte de rangement Werckmann Bricolage 9.99 € 0 Épuisé Modifier Supprimer":
        - cell "Boîte de rangement Werckmann"
        - cell "Bricolage"
        - cell "9.99 €"
        - cell "0"
        - cell "Épuisé"
        - cell "Modifier Supprimer":
          - button "Modifier"
          - button "Supprimer"
      - row "Boîtes à outils Keter Bricolage 8.99 € 0 Épuisé Modifier Supprimer":
        - cell "Boîtes à outils Keter"
        - cell "Bricolage"
        - cell "8.99 €"
        - cell "0"
        - cell "Épuisé"
        - cell "Modifier Supprimer":
          - button "Modifier"
          - button "Supprimer"
      - row "Boîtier de synchronisation HDMI Multimédia 34.95 € 42 En stock Modifier Supprimer":
        - cell "Boîtier de synchronisation HDMI"
        - cell "Multimédia"
        - cell "34.95 €"
        - cell "42"
        - cell "En stock"
        - cell "Modifier Supprimer":
          - button "Modifier"
          - button "Supprimer"
      - row "Boule lumineuse Habitat 3.99 € 0 Épuisé Modifier Supprimer":
        - cell "Boule lumineuse"
        - cell "Habitat"
        - cell "3.99 €"
        - cell "0"
        - cell "Épuisé"
        - cell "Modifier Supprimer":
          - button "Modifier"
          - button "Supprimer"
  - navigation:
    - button "Précédent" [disabled]
    - text: Page 1 sur 9
    - button "Suivant"
```

# Test source

```ts
  1   | // @ts-check
  2   | import { test, expect } from "@playwright/test";
  3   | import { aller, api, attendreApp } from "./helpers.js";
  4   | import { COMPTES } from "./constantes.js";
  5   | 
  6   | const PNG_1X1 = Buffer.from(
  7   |   "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  8   |   "base64"
  9   | );
  10  | 
  11  | /** @typedef {Record<string, any>} ProduitApi */
  12  | 
  13  | /** @param {string} prefixe */
  14  | function nomUnique(prefixe) {
  15  |   return `${prefixe} ${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  16  | }
  17  | 
  18  | /** @param {string} nom @param {Record<string, any>} [extra] @returns {ProduitApi} */
  19  | function produitValide(nom, extra = {}) {
  20  |   return {
  21  |     nom,
  22  |     reference: "",
  23  |     categorie_id: 4,
  24  |     marque: "Test",
  25  |     format: "",
  26  |     description: "Produit créé par le test GOF-a.",
  27  |     prix: "12.50",
  28  |     prix_unitaire: "",
  29  |     unite_prix: "",
  30  |     badge: "",
  31  |     stock: 4,
  32  |     seuil_alerte: 3,
  33  |     ...extra,
  34  |   };
  35  | }
  36  | 
  37  | /** @param {import("@playwright/test").Page} page */
  38  | async function seConnecterAdmin(page) {
  39  |   await aller(page, "admin");
  40  |   await page.locator('input[name="login"]').fill(COMPTES.admin.login);
  41  |   await page.locator('input[name="mdp"]').fill(COMPTES.admin.mdp);
  42  |   await page.getByRole("button", { name: "Se connecter" }).click();
  43  |   await expect(page.getByText(`Connecté en tant que ${COMPTES.admin.login}`)).toBeVisible();
  44  |   await aller(page, "admin/produits");
  45  | }
  46  | 
  47  | /** @param {import("@playwright/test").Page} page @param {string} nom */
  48  | function ligneProduit(page, nom) {
  49  |   return page.locator("tr", { hasText: nom });
  50  | }
  51  | 
  52  | /**
  53  |  * @param {import("@playwright/test").Page} page
  54  |  * @param {{nom: string, categorie?: string, prix?: number|string, stock?: number|string, seuil?: number|string}} donnees
  55  |  */
  56  | async function remplirFormulaire(page, { nom, categorie = "Bricolage", prix, stock, seuil }) {
  57  |   const formulaire = page.locator("form").first();
  58  |   await formulaire.locator('input[name="nom"]').fill(nom);
  59  |   await formulaire.locator('select[name="categorieId"]').selectOption({ label: categorie });
  60  |   if (prix !== undefined) await formulaire.locator('input[name="prix"]').fill(String(prix));
  61  |   if (stock !== undefined) await formulaire.locator('input[name="stock"]').fill(String(stock));
  62  |   if (seuil !== undefined) await formulaire.locator('input[name="seuilAlerte"]').fill(String(seuil));
  63  |   return formulaire;
  64  | }
  65  | 
  66  | test.describe("US GOF-a — Gestion des produits", () => {
  67  |   /** @type {number[]} */
  68  |   let crees = [];
  69  | 
  70  |   test.beforeEach(async ({ page }) => {
  71  |     crees = [];
  72  |     await seConnecterAdmin(page);
  73  |     await expect(page.getByRole("heading", { name: "Gestion des produits" })).toBeVisible();
  74  |   });
  75  | 
  76  |   test.afterEach(async ({ page }) => {
  77  |     for (const id of crees) {
  78  |       await api(page, `admin/produits/${id}`, { method: "DELETE" });
  79  |     }
  80  |   });
  81  | 
  82  |   test("CA — Je peux ajouter un produit avec ses informations", async ({ page }) => {
  83  |     const nom = nomUnique("Produit ajout");
  84  |     await page.getByRole("button", { name: "Nouveau produit" }).click();
  85  |     await remplirFormulaire(page, { nom, prix: 12.5, stock: 4, seuil: 3 });
  86  |     await page.getByRole("button", { name: "Enregistrer" }).click();
  87  | 
  88  |     await expect(page.getByText(`Produit « ${nom} » enregistré.`)).toBeVisible();
  89  |     const ligne = ligneProduit(page, nom);
> 90  |     await expect(ligne).toBeVisible();
      |                         ^ Error: expect(locator).toBeVisible() failed
  91  |     await expect(ligne).toContainText("Bricolage");
  92  |     await expect(ligne).toContainText("12.5");
  93  | 
  94  |     const { donnees } = await api(page, "admin/produits");
  95  |     const cree = donnees.produits.find((/** @type {ProduitApi} */ produit) => produit.nom === nom);
  96  |     expect(cree).toBeTruthy();
  97  |     crees.push(cree.id);
  98  |   });
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
```