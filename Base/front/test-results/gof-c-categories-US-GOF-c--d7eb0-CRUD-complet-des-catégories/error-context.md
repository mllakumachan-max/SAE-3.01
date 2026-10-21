# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gof-c-categories.spec.js >> US GOF-c — Gestion des catégories >> DoD — CRUD complet des catégories
- Location: tests/gof-c-categories.spec.js:85:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 404
```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - banner [ref=f1e4]:
    - figure [ref=f1e5]:
      - generic [ref=f1e6]:
        - link "Logo de l'application Administration" [ref=f1e7] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/admin
          - img "Logo de l'application" [ref=f1e8]
          - generic [ref=f1e9]: Administration
        - generic [ref=f1e10]:
          - link "Voir le site ↗" [ref=f1e11] [cursor=pointer]:
            - /url: /~ribatet1/SAE-3.01/Base/
          - button "Changer de thème" [ref=f1e12] [cursor=pointer]
          - button "Se déconnecter" [ref=f1e15] [cursor=pointer]
      - navigation [ref=f1e17]:
        - link "Tableau de bord" [ref=f1e18] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/admin
        - link "Produits" [ref=f1e19] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/admin/produits
        - link "Catégories" [ref=f1e20] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/admin/categories
        - link "Commandes" [ref=f1e21] [cursor=pointer]:
          - /url: /~ribatet1/SAE-3.01/Base/admin/commandes
  - main [ref=f1e22]:
    - generic [ref=f1e23]:
      - generic [ref=f1e24]:
        - heading "Gestion des catégories" [level=1] [ref=f1e25]
        - button "Nouvelle catégorie" [ref=f1e26] [cursor=pointer]
      - table [ref=f1e28]:
        - rowgroup [ref=f1e29]:
          - row [ref=f1e30]:
            - columnheader "Nom" [ref=f1e31]
            - columnheader "Description" [ref=f1e32]
            - columnheader "Produits" [ref=f1e33]
            - columnheader "Actions" [ref=f1e34]
        - rowgroup [ref=f1e36]:
          - row [ref=f1e37]:
            - cell "Multimédia" [ref=f1e38]
            - cell [ref=f1e39]
            - cell "25" [ref=f1e40]
            - cell [ref=f1e41]:
              - button "Modifier" [ref=f1e42] [cursor=pointer]
              - button "Supprimer" [ref=f1e43] [cursor=pointer]
          - row [ref=f1e44]:
            - cell "Habitat" [ref=f1e45]
            - cell [ref=f1e46]
            - cell "25" [ref=f1e47]
            - cell [ref=f1e48]:
              - button "Modifier" [ref=f1e49] [cursor=pointer]
              - button "Supprimer" [ref=f1e50] [cursor=pointer]
          - row [ref=f1e51]:
            - cell "Hobby" [ref=f1e52]
            - cell [ref=f1e53]
            - cell "25" [ref=f1e54]
            - cell [ref=f1e55]:
              - button "Modifier" [ref=f1e56] [cursor=pointer]
              - button "Supprimer" [ref=f1e57] [cursor=pointer]
          - row [ref=f1e58]:
            - cell "Bricolage" [ref=f1e59]
            - cell [ref=f1e60]
            - cell "25" [ref=f1e61]
            - cell [ref=f1e62]:
              - button "Modifier" [ref=f1e63] [cursor=pointer]
              - button "Supprimer" [ref=f1e64] [cursor=pointer]
          - row [ref=f1e65]:
            - cell "Plaids et couvertures" [ref=f1e66]
            - cell [ref=f1e67]
            - cell "0" [ref=f1e68]
            - cell [ref=f1e69]:
              - button "Modifier" [ref=f1e70] [cursor=pointer]
              - button "Supprimer" [ref=f1e71] [cursor=pointer]
          - row [ref=f1e72]:
            - cell "Décoration" [ref=f1e73]
            - cell [ref=f1e74]
            - cell "0" [ref=f1e75]
            - cell [ref=f1e76]:
              - button "Modifier" [ref=f1e77] [cursor=pointer]
              - button "Supprimer" [ref=f1e78] [cursor=pointer]
          - row [ref=f1e79]:
            - cell "Salle de bain" [ref=f1e80]
            - cell [ref=f1e81]
            - cell "0" [ref=f1e82]
            - cell [ref=f1e83]:
              - button "Modifier" [ref=f1e84] [cursor=pointer]
              - button "Supprimer" [ref=f1e85] [cursor=pointer]
          - row [ref=f1e86]:
            - cell "Oreillers" [ref=f1e87]
            - cell [ref=f1e88]
            - cell "0" [ref=f1e89]
            - cell [ref=f1e90]:
              - button "Modifier" [ref=f1e91] [cursor=pointer]
              - button "Supprimer" [ref=f1e92] [cursor=pointer]
          - row [ref=f1e93]:
            - cell "Literie" [ref=f1e94]
            - cell [ref=f1e95]
            - cell "0" [ref=f1e96]
            - cell [ref=f1e97]:
              - button "Modifier" [ref=f1e98] [cursor=pointer]
              - button "Supprimer" [ref=f1e99] [cursor=pointer]
          - row [ref=f1e100]:
            - cell "Peindre" [ref=f1e101]
            - cell [ref=f1e102]
            - cell "0" [ref=f1e103]
            - cell [ref=f1e104]:
              - button "Modifier" [ref=f1e105] [cursor=pointer]
              - button "Supprimer" [ref=f1e106] [cursor=pointer]
          - row [ref=f1e107]:
            - cell "Coloriage et dessin" [ref=f1e108]
            - cell [ref=f1e109]
            - cell "0" [ref=f1e110]
            - cell [ref=f1e111]:
              - button "Modifier" [ref=f1e112] [cursor=pointer]
              - button "Supprimer" [ref=f1e113] [cursor=pointer]
          - row [ref=f1e114]:
            - cell "Activités manuelles" [ref=f1e115]
            - cell [ref=f1e116]
            - cell "0" [ref=f1e117]
            - cell [ref=f1e118]:
              - button "Modifier" [ref=f1e119] [cursor=pointer]
              - button "Supprimer" [ref=f1e120] [cursor=pointer]
          - row [ref=f1e121]:
            - cell "Outils" [ref=f1e122]
            - cell [ref=f1e123]
            - cell "0" [ref=f1e124]
            - cell [ref=f1e125]:
              - button "Modifier" [ref=f1e126] [cursor=pointer]
              - button "Supprimer" [ref=f1e127] [cursor=pointer]
          - row [ref=f1e128]:
            - cell "Rangement" [ref=f1e129]
            - cell [ref=f1e130]
            - cell "0" [ref=f1e131]
            - cell [ref=f1e132]:
              - button "Modifier" [ref=f1e133] [cursor=pointer]
              - button "Supprimer" [ref=f1e134] [cursor=pointer]
          - row [ref=f1e135]:
            - cell "Audio et Son" [ref=f1e136]
            - cell [ref=f1e137]
            - cell "0" [ref=f1e138]
            - cell [ref=f1e139]:
              - button "Modifier" [ref=f1e140] [cursor=pointer]
              - button "Supprimer" [ref=f1e141] [cursor=pointer]
          - row [ref=f1e142]:
            - cell "Câbles et Connectique" [ref=f1e143]
            - cell [ref=f1e144]
            - cell "0" [ref=f1e145]
            - cell [ref=f1e146]:
              - button "Modifier" [ref=f1e147] [cursor=pointer]
              - button "Supprimer" [ref=f1e148] [cursor=pointer]
          - row [ref=f1e149]:
            - cell "Énergie et Chargeurs" [ref=f1e150]
            - cell [ref=f1e151]
            - cell "0" [ref=f1e152]
            - cell [ref=f1e153]:
              - button "Modifier" [ref=f1e154] [cursor=pointer]
              - button "Supprimer" [ref=f1e155] [cursor=pointer]
          - row [ref=f1e156]:
            - cell "Accessoires Informatique" [ref=f1e157]
            - cell [ref=f1e158]
            - cell "0" [ref=f1e159]
            - cell [ref=f1e160]:
              - button "Modifier" [ref=f1e161] [cursor=pointer]
              - button "Supprimer" [ref=f1e162] [cursor=pointer]
```

# Test source

```ts
  1   | // @ts-check
  2   | import { test, expect } from "@playwright/test";
  3   | import { aller, api, url } from "./helpers.js";
  4   | import { COMPTES } from "./constantes.js";
  5   | 
  6   | /**
  7   |  * GOF-c : Gestion des catégories
  8   |  * En tant qu'administrateur, je veux gérer les catégories afin d'organiser le catalogue
  9   |  *
  10  |  * Critères d'acceptation :
  11  |  * - Je peux créer de nouvelles catégories avec nom et description
  12  |  * - Je peux modifier les catégories existantes
  13  |  * - Je peux supprimer une catégorie en gérant les produits qui lui sont rattachés
  14  |  * - Je dois confirmer avant toute suppression
  15  |  * - La validation empêche les données incohérentes
  16  |  *
  17  |  * Definition of Done spécifique :
  18  |  * - CRUD complet des catégories
  19  |  * - Règle explicite pour les produits d'une catégorie supprimée (réaffectation ou blocage de la suppression)
  20  |  */
  21  | 
  22  | async function seConnecterAdmin(page) {
  23  |   await aller(page, "admin");
  24  |   await page.locator('input[name="login"]').fill(COMPTES.admin.login);
  25  |   await page.locator('input[name="mdp"]').fill(COMPTES.admin.mdp);
  26  |   await page.getByRole("button", { name: "Se connecter" }).click();
  27  |   await aller(page, "admin/categories");
  28  | }
  29  | 
  30  | test.describe("US GOF-c — Gestion des catégories", () => {
  31  |   test.beforeEach(async ({ page }) => {
  32  |     await seConnecterAdmin(page);
  33  |   });
  34  | 
  35  |   test("CA — Je peux créer une nouvelle catégorie", async ({ page }) => {
  36  |     const libelle = "Catégorie test " + Date.now();
  37  |     const { statut, donnees } = await api(page, "admin/categories", {
  38  |       method: "POST",
  39  |       body: { libelle, description: "desc" },
  40  |     });
  41  |     expect(statut).toBe(201);
  42  |     expect(donnees.categorie.libelle).toBe(libelle);
  43  |   });
  44  | 
  45  |   test("CA — Je peux modifier une catégorie existante", async ({ page }) => {
  46  |     const libelle = "Catégorie modif " + Date.now();
  47  |     const { donnees } = await api(page, "admin/categories", {
  48  |       method: "POST",
  49  |       body: { libelle, description: "desc" },
  50  |     });
  51  |     const id = donnees.categorie.id;
  52  |     const nouveau = libelle + " mod";
  53  |     const { statut, donnees: d2 } = await api(page, `admin/categories/${id}`, {
  54  |       method: "PUT",
  55  |       body: { libelle: nouveau, description: "desc2" },
  56  |     });
  57  |     expect(statut).toBe(200);
  58  |     expect(d2.categorie.libelle).toBe(nouveau);
  59  |   });
  60  | 
  61  |   test("CA — Suppression avec réaffectation des produits", async ({ page }) => {
  62  |     const libelle = "Catégorie à supprimer " + Date.now();
  63  |     const { donnees } = await api(page, "admin/categories", {
  64  |       method: "POST",
  65  |       body: { libelle, description: "desc" },
  66  |     });
  67  |     const id = donnees.categorie.id;
  68  |     const { donnees: cats } = await api(page, "admin/categories");
  69  |     const cible = cats.categories.find((c) => c.id !== id);
  70  |     const { statut } = await api(page, `admin/categories/${id}`, {
  71  |       method: "DELETE",
  72  |       body: { cible_id: cible.id },
  73  |     });
  74  |     expect(statut).toBe(200);
  75  |   });
  76  | 
  77  |   test("CA — La validation empêche les données incohérentes", async ({ page }) => {
  78  |     const { statut } = await api(page, "admin/categories", {
  79  |       method: "POST",
  80  |       body: { libelle: "", description: "desc" },
  81  |     });
  82  |     expect(statut).toBe(400);
  83  |   });
  84  | 
  85  |   test("DoD — CRUD complet des catégories", async ({ page }) => {
  86  |     const libelle = "Catégorie CRUD " + Date.now();
  87  |     const { statut: s1, donnees: d1 } = await api(page, "admin/categories", {
  88  |       method: "POST",
  89  |       body: { libelle, description: "desc" },
  90  |     });
> 91  |     expect(s1).toBe(201);
      |                ^ Error: expect(received).toBe(expected) // Object.is equality
  92  |     const id = d1.categorie.id;
  93  |     const { statut: s2 } = await api(page, `admin/categories/${id}`, {
  94  |       method: "PUT",
  95  |       body: { libelle: libelle + " edit", description: "desc" },
  96  |     });
  97  |     expect(s2).toBe(200);
  98  |     const { statut: s3 } = await api(page, `admin/categories/${id}`, {
  99  |       method: "DELETE",
  100 |       body: {},
  101 |     });
  102 |     expect(s3).toBe(200);
  103 |   });
  104 | 
  105 |   test("DoD — Règle explicite pour les produits d'une catégorie supprimée", async ({ page }) => {
  106 |     // suppression d'une catégorie avec produits exige une cible
  107 |     const { donnees: cats } = await api(page, "admin/categories");
  108 |     const avecProduits = cats.categories.find((c) => c.nb_produits > 0);
  109 |     expect(avecProduits).toBeTruthy();
  110 |     const { statut } = await api(page, `admin/categories/${avecProduits.id}`, {
  111 |       method: "DELETE",
  112 |       body: {},
  113 |     });
  114 |     expect(statut).toBe(400);
  115 |   });
  116 | });
  117 | 
```