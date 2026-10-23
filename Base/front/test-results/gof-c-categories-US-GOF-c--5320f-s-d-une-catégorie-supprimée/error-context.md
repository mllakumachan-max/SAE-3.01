# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gof-c-categories.spec.js >> US GOF-c — Gestion des catégories >> DoD — Règle explicite pour les produits d'une catégorie supprimée
- Location: tests/gof-c-categories.spec.js:175:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 400
Received: 409
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
        - heading "Gestion des catégories" [level=1] [ref=f1e18]
        - button "Nouvelle catégorie" [ref=f1e19] [cursor=pointer]
      - generic [ref=f1e20]:
        - generic [ref=f1e21]:
          - text: Trier par
          - combobox "Trier par" [ref=f1e22]:
            - option "Nom (A → Z)" [selected]
            - option "Nombre de produits (croissant)"
            - option "Nombre de produits (décroissant)"
        - generic [ref=f1e23]:
          - text: Catégories par page
          - combobox "Catégories par page" [ref=f1e24]:
            - option "12 catégories" [selected]
            - option "24 catégories"
            - option "48 catégories"
        - generic [ref=f1e25]: 20 catégories
      - table [ref=f1e27]:
        - rowgroup [ref=f1e28]:
          - row [ref=f1e29]:
            - columnheader "Nom" [ref=f1e30]
            - columnheader "Description" [ref=f1e31]
            - columnheader "Produits" [ref=f1e32]
            - columnheader "Actions" [ref=f1e33]
        - rowgroup [ref=f1e35]:
          - row [ref=f1e36]:
            - cell "Accessoires Informatique" [ref=f1e37]
            - cell [ref=f1e38]
            - cell "0" [ref=f1e39]
            - cell [ref=f1e40]:
              - button "Modifier" [ref=f1e41] [cursor=pointer]
              - button "Supprimer" [ref=f1e42] [cursor=pointer]
          - row [ref=f1e43]:
            - cell "Activités manuelles" [ref=f1e44]
            - cell [ref=f1e45]
            - cell "0" [ref=f1e46]
            - cell [ref=f1e47]:
              - button "Modifier" [ref=f1e48] [cursor=pointer]
              - button "Supprimer" [ref=f1e49] [cursor=pointer]
          - row [ref=f1e50]:
            - cell "Audio et Son" [ref=f1e51]
            - cell [ref=f1e52]
            - cell "0" [ref=f1e53]
            - cell [ref=f1e54]:
              - button "Modifier" [ref=f1e55] [cursor=pointer]
              - button "Supprimer" [ref=f1e56] [cursor=pointer]
          - row [ref=f1e57]:
            - cell "Bricolage" [ref=f1e58]
            - cell [ref=f1e59]
            - cell "29" [ref=f1e60]
            - cell [ref=f1e61]:
              - button "Modifier" [ref=f1e62] [cursor=pointer]
              - button "Supprimer" [ref=f1e63] [cursor=pointer]
          - row [ref=f1e64]:
            - cell "Câbles et Connectique" [ref=f1e65]
            - cell [ref=f1e66]
            - cell "0" [ref=f1e67]
            - cell [ref=f1e68]:
              - button "Modifier" [ref=f1e69] [cursor=pointer]
              - button "Supprimer" [ref=f1e70] [cursor=pointer]
          - row [ref=f1e71]:
            - cell "Catégorie modif 1792746214441 mod" [ref=f1e72]
            - cell "desc2" [ref=f1e73]
            - cell "0" [ref=f1e74]
            - cell [ref=f1e75]:
              - button "Modifier" [ref=f1e76] [cursor=pointer]
              - button "Supprimer" [ref=f1e77] [cursor=pointer]
          - row [ref=f1e78]:
            - cell "Catégorie test 1792746213732" [ref=f1e79]
            - cell "desc" [ref=f1e80]
            - cell "0" [ref=f1e81]
            - cell [ref=f1e82]:
              - button "Modifier" [ref=f1e83] [cursor=pointer]
              - button "Supprimer" [ref=f1e84] [cursor=pointer]
          - row [ref=f1e85]:
            - cell "Coloriage et dessin" [ref=f1e86]
            - cell [ref=f1e87]
            - cell "0" [ref=f1e88]
            - cell [ref=f1e89]:
              - button "Modifier" [ref=f1e90] [cursor=pointer]
              - button "Supprimer" [ref=f1e91] [cursor=pointer]
          - row [ref=f1e92]:
            - cell "Décoration" [ref=f1e93]
            - cell [ref=f1e94]
            - cell "0" [ref=f1e95]
            - cell [ref=f1e96]:
              - button "Modifier" [ref=f1e97] [cursor=pointer]
              - button "Supprimer" [ref=f1e98] [cursor=pointer]
          - row [ref=f1e99]:
            - cell "Énergie et Chargeurs" [ref=f1e100]
            - cell [ref=f1e101]
            - cell "0" [ref=f1e102]
            - cell [ref=f1e103]:
              - button "Modifier" [ref=f1e104] [cursor=pointer]
              - button "Supprimer" [ref=f1e105] [cursor=pointer]
          - row [ref=f1e106]:
            - cell "Habitat" [ref=f1e107]
            - cell [ref=f1e108]
            - cell "24" [ref=f1e109]
            - cell [ref=f1e110]:
              - button "Modifier" [ref=f1e111] [cursor=pointer]
              - button "Supprimer" [ref=f1e112] [cursor=pointer]
          - row [ref=f1e113]:
            - cell "Hobby" [ref=f1e114]
            - cell [ref=f1e115]
            - cell "25" [ref=f1e116]
            - cell [ref=f1e117]:
              - button "Modifier" [ref=f1e118] [cursor=pointer]
              - button "Supprimer" [ref=f1e119] [cursor=pointer]
      - navigation [ref=f1e120]:
        - button "Précédent" [disabled] [ref=f1e121]
        - generic [ref=f1e122]: Page 1 sur 2
        - button "Suivant" [ref=f1e123] [cursor=pointer]
```

# Test source

```ts
  84  |     const libelle = "Catégorie modif " + Date.now();
  85  |     const { donnees } = await api(page, "admin/categories", {
  86  |       method: "POST",
  87  |       body: { libelle, description: "desc" },
  88  |     });
  89  |     const id = donnees.categorie.id;
  90  |     const nouveau = libelle + " mod";
  91  |     const { statut, donnees: d2 } = await api(page, `admin/categories/${id}`, {
  92  |       method: "PUT",
  93  |       body: { libelle: nouveau, description: "desc2" },
  94  |     });
  95  |     expect(statut).toBe(200);
  96  |     expect(d2.categorie.libelle).toBe(nouveau);
  97  |   });
  98  | 
  99  |   test("UI — Le formulaire de catégorie s'affiche seul pendant la modification", async ({ page }) => {
  100 |     const ligne = page.locator("tbody tr").first();
  101 |     await expect(ligne).toBeVisible();
  102 |     await ligne.getByRole("button", { name: "Modifier" }).click();
  103 | 
  104 |     await expect(page.getByRole("heading", { name: "Modifier la catégorie" })).toBeVisible();
  105 |     await expect(page.locator("tbody")).toHaveCount(0);
  106 |     await expect(page.locator('select[name="tri"]')).toHaveCount(0);
  107 |     await expect(page.locator('select[name="parPage"]')).toHaveCount(0);
  108 |     await expect(page.getByRole("button", { name: "Nouvelle catégorie" })).toBeHidden();
  109 | 
  110 |     await page.getByRole("button", { name: "Annuler" }).click();
  111 |     await expect(page.locator("tbody tr").first()).toBeVisible();
  112 |     await expect(page.locator('select[name="tri"]')).toBeVisible();
  113 |   });
  114 | 
  115 |   test("CA — Suppression avec réaffectation des produits", async ({ page }) => {
  116 |     const libelle = "Catégorie à supprimer " + Date.now();
  117 |     const { donnees } = await api(page, "admin/categories", {
  118 |       method: "POST",
  119 |       body: { libelle, description: "desc" },
  120 |     });
  121 |     const id = donnees.categorie.id;
  122 |     const { donnees: cats } = await api(page, "admin/categories");
  123 |     const cible = cats.categories.find((c) => c.id !== id);
  124 |     const { statut } = await api(page, `admin/categories/${id}`, {
  125 |       method: "DELETE",
  126 |       body: { cible_id: cible.id },
  127 |     });
  128 |     expect(statut).toBe(200);
  129 |   });
  130 | 
  131 |   test("UI — La confirmation de suppression apparaît en fenêtre superposée", async ({ page }) => {
  132 |     const ligne = page.locator("tbody tr").first();
  133 |     await expect(ligne).toBeVisible();
  134 |     await ligne.getByRole("button", { name: "Supprimer" }).click();
  135 | 
  136 |     const overlay = page.locator('[data-zone="overlay"]');
  137 |     const dialogue = page.getByRole("dialog");
  138 |     await expect(dialogue).toBeVisible();
  139 |     await expect(overlay).toHaveCSS("position", "fixed");
  140 |     await expect(overlay).toHaveCSS("z-index", "50");
  141 |     await expect(overlay).toHaveCSS("background-color", "oklab(0 0 0 / 0.4)");
  142 | 
  143 |     await dialogue.getByRole("button", { name: "Annuler" }).click();
  144 |     await expect(page.getByRole("dialog")).toHaveCount(0);
  145 |   });
  146 | 
  147 |   test("CA — La validation empêche les données incohérentes", async ({ page }) => {
  148 |     const { statut } = await api(page, "admin/categories", {
  149 |       method: "POST",
  150 |       body: { libelle: "", description: "desc" },
  151 |     });
  152 |     expect(statut).toBe(400);
  153 |   });
  154 | 
  155 |   test("DoD — CRUD complet des catégories", async ({ page }) => {
  156 |     const libelle = "Catégorie CRUD " + Date.now();
  157 |     const { statut: s1, donnees: d1 } = await api(page, "admin/categories", {
  158 |       method: "POST",
  159 |       body: { libelle, description: "desc" },
  160 |     });
  161 |     expect(s1).toBe(201);
  162 |     const id = d1.categorie.id;
  163 |     const { statut: s2 } = await api(page, `admin/categories/${id}`, {
  164 |       method: "PUT",
  165 |       body: { libelle: libelle + " edit", description: "desc" },
  166 |     });
  167 |     expect(s2).toBe(200);
  168 |     const { statut: s3 } = await api(page, `admin/categories/${id}`, {
  169 |       method: "DELETE",
  170 |       body: {},
  171 |     });
  172 |     expect(s3).toBe(200);
  173 |   });
  174 | 
  175 |   test("DoD — Règle explicite pour les produits d'une catégorie supprimée", async ({ page }) => {
  176 |     // suppression d'une catégorie avec produits exige une cible
  177 |     const { donnees: cats } = await api(page, "admin/categories");
  178 |     const avecProduits = cats.categories.find((c) => c.nb_produits > 0);
  179 |     expect(avecProduits).toBeTruthy();
  180 |     const { statut } = await api(page, `admin/categories/${avecProduits.id}`, {
  181 |       method: "DELETE",
  182 |       body: {},
  183 |     });
> 184 |     expect(statut).toBe(400);
      |                    ^ Error: expect(received).toBe(expected) // Object.is equality
  185 |   });
  186 | });
  187 | 
```