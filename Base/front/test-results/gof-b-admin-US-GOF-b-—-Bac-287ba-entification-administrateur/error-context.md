# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: gof-b-admin.spec.js >> US GOF-b — Back-office >> DoD — Aucune page /admin n'est accessible sans authentification administrateur
- Location: tests/gof-b-admin.spec.js:173:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Connexion administrateur' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'Connexion administrateur' }) with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Connexion administrateur' })

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
    - button "Se déconnecter"
    - navigation:
      - link "Tableau de bord":
        - /url: /~ribatet1/SAE-3.01/Base/admin
      - link "Produits":
        - /url: /~ribatet1/SAE-3.01/Base/admin/produits
      - link "Catégories":
        - /url: /~ribatet1/SAE-3.01/Base/admin/categories
      - link "Commandes":
        - /url: /~ribatet1/SAE-3.01/Base/admin/commandes
- main:
  - status: Connecté en tant que admin.
  - heading "Tableau de bord de l'activité" [level=2]
  - paragraph: Indicateurs clés et suivi des ventes Click & Collect
  - text: 0,00 € Revenus (7 jours) 0 Commandes passées 101 Produits au catalogue 0 Stocks faibles ou épuisés
  - heading "Commandes par statut" [level=3]
  - heading "Niveaux de stock par produit" [level=3]
  - text: Unités restantes
  - heading "Top des ventes" [level=3]
  - list
```

# Test source

```ts
  102 | 
  103 |   test("CA — Le tableau de bord affiche des indicateurs simples", async ({ page }) => {
  104 |     await aller(page, "admin");
  105 |     await seConnecter(page, COMPTES.admin.login, COMPTES.admin.mdp);
  106 | 
  107 |     // L'indicateur « produits » correspond au nombre de produits du
  108 |     // catalogue.
  109 |     const { donnees: catalogue } = await api(page, "produits?page=1");
  110 |     await expect(page.getByText("Produits au catalogue", { exact: true })).toBeVisible();
  111 |     expect(await indicateur(page, "Produits au catalogue")).toBe(catalogue.total);
  112 | 
  113 |     // L'indicateur « commandes » est affiché. Il vaut 0 tant que la
  114 |     // commande n'est pas reprise dans les statistiques.
  115 |     await expect(page.getByText("Commandes passées", { exact: true })).toBeVisible();
  116 |     const commandes = await indicateur(page, "Commandes passées");
  117 |     expect(Number.isFinite(commandes)).toBe(true);
  118 |     expect(commandes).toBeGreaterThanOrEqual(0);
  119 |   });
  120 | 
  121 |   test("CA — La navigation entre les sections d'administration est claire", async ({ page }) => {
  122 |     await aller(page, "admin");
  123 |     await seConnecter(page, COMPTES.admin.login, COMPTES.admin.mdp);
  124 | 
  125 |     const menu = page.locator("header nav");
  126 | 
  127 |     for (const section of [
  128 |       { nom: "Tableau de bord", lien: "/admin" },
  129 |       { nom: "Produits", lien: "/admin/produits" },
  130 |       { nom: "Catégories", lien: "/admin/categories" },
  131 |       { nom: "Commandes", lien: "/admin/commandes" },
  132 |     ]) {
  133 |       const lien = menu.getByRole("link", { name: section.nom });
  134 |       await expect(lien).toBeVisible();
  135 |       // Le lien pointe vers la route de la section, sous le chemin du projet.
  136 |       await expect(lien).toHaveAttribute("href", new URL(url(section.lien)).pathname);
  137 |     }
  138 |   });
  139 | 
  140 |   test("CA — Le design est cohérent avec le front-office mais distinct", async ({ page }) => {
  141 |     await aller(page, "admin");
  142 | 
  143 |     // Même identité graphique que la boutique : le même logo.
  144 |     const logoAdmin = page.locator("header img").first();
  145 |     await expect(logoAdmin).toBeVisible();
  146 | 
  147 |     await aller(page);
  148 |     const logoBoutique = page.locator("header img").first();
  149 |     await expect(logoBoutique).toBeVisible();
  150 | 
  151 |     expect(await logoAdmin.getAttribute("src")).toBe(await logoBoutique.getAttribute("src"));
  152 | 
  153 |     // Mais un back-office distinct : pas de panier, pas de barre de
  154 |     // catégories, et un lien pour revenir à la boutique.
  155 |     await aller(page, "admin");
  156 |     await expect(page.getByRole("link", { name: /Voir le site/ })).toBeVisible();
  157 |     await expect(page.getByRole("link", { name: "Panier" })).toHaveCount(0);
  158 |   });
  159 | 
  160 |   test("DoD — Un compte administrateur de test existe en base de données", async ({ page }) => {
  161 |     // Le compte est déclaré par le script d'initialisation de la base.
  162 |     const schema = readFileSync(new URL("../../sql/sae301.sql", import.meta.url), "utf-8");
  163 |     expect(schema).toMatch(/CREATE TABLE UTILISATEUR/);
  164 |     expect(schema).toMatch(/INSERT INTO UTILISATEUR/);
  165 |     expect(schema).toMatch(/'admin'/);
  166 | 
  167 |     // Et il est accepté par l'API, avec le rôle administrateur.
  168 |     const reponse = await connecter(page, COMPTES.admin.login, COMPTES.admin.mdp);
  169 |     expect(reponse.statut).toBe(200);
  170 |     expect(reponse.donnees.role).toBe("admin");
  171 |   });
  172 | 
  173 |   test("DoD — Aucune page /admin n'est accessible sans authentification administrateur", async ({
  174 |     page,
  175 |   }) => {
  176 |     // Sans session : l'API refuse, et la page n'affiche aucune donnée.
  177 |     await aller(page, "admin");
  178 |     await expect(page.getByRole("heading", { name: "Connexion administrateur" })).toBeVisible();
  179 |     await expect(page.getByText("Produits au catalogue", { exact: true })).toHaveCount(0);
  180 | 
  181 |     const sansSession = await api(page, "admin/stats");
  182 |     expect(sansSession.statut).toBe(403);
  183 | 
  184 |     // Avec une session de client : l'API refuse toujours.
  185 |     await connecter(page, COMPTES.client.login, COMPTES.client.mdp);
  186 |     const avecClient = await api(page, "admin/stats");
  187 |     expect(avecClient.statut).toBe(403);
  188 |     await deconnecter(page);
  189 | 
  190 |     // Avec une session d'administrateur : l'accès est accordé.
  191 |     await seConnecter(page, COMPTES.admin.login, COMPTES.admin.mdp);
  192 |     await expect(page.getByText("Produits au catalogue", { exact: true })).toBeVisible();
  193 |     await expect(page.getByRole("link", { name: "Tableau de bord" })).toBeVisible();
  194 |     await expect(page.locator('[data-action="deconnexion"]')).toBeVisible();
  195 |     await expect(page.getByRole("heading", { name: "Connexion administrateur" })).toHaveCount(0);
  196 |     await expect(page.locator('input[name="login"]')).toHaveCount(0);
  197 |     expect((await api(page, "admin/stats")).statut).toBe(200);
  198 | 
  199 |     // Après la déconnexion, l'accès est de nouveau coupé.
  200 |     await page.locator('[data-action="deconnexion"]').click();
  201 |     await expect(page).toHaveURL(url("admin"));
> 202 |     await expect(page.getByRole("heading", { name: "Connexion administrateur" })).toBeVisible();
      |                                                                                   ^ Error: expect(locator).toBeVisible() failed
  203 |     await expect(page.locator('input[name="login"]')).toBeVisible();
  204 |     await expect(page.getByRole("link", { name: "Tableau de bord" })).toHaveCount(0);
  205 |     await expect(page.locator('[data-action="deconnexion"]')).toBeHidden();
  206 |     expect((await api(page, "admin/stats")).statut).toBe(403);
  207 |   });
  208 | });
  209 | 
```