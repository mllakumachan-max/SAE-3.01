# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cmd-c-authentification.spec.js >> US CMD-c — Authentification >> CA — Je peux me connecter avec mes identifiants
- Location: tests/cmd-c-authentification.spec.js:82:3

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
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
        - figure "Amplificateur Wi-Fi Épuisé 19,95 € Étend la couverture réseau pour éliminer les zones mortes dans la maison. Options du produit Quantité Diminuer la quantité 1 Augmenter la quantité Épuisé" [ref=f1e56]:
          - figure [ref=f1e57]:
            - paragraph [ref=f1e60]: "{{numero-img}} / 1"
          - generic [ref=f1e61]:
            - generic [ref=f1e62]:
              - heading "Amplificateur Wi-Fi" [level=1] [ref=f1e63]
              - generic [ref=f1e64]: Épuisé
            - paragraph [ref=f1e67]: 19,95 €
            - paragraph [ref=f1e68]: Étend la couverture réseau pour éliminer les zones mortes dans la maison.
            - group "Options du produit"
            - generic [ref=f1e70]:
              - text: Quantité
              - generic [ref=f1e71]:
                - button "Diminuer la quantité" [disabled] [ref=f1e72]: −
                - spinbutton "Quantité" [ref=f1e73]: "0"
                - button "Augmenter la quantité" [disabled] [ref=f1e74]: +
            - button "Épuisé" [disabled] [ref=f1e75]
```

# Test source

```ts
  1   | // @ts-check
  2   | import { test, expect } from "@playwright/test";
  3   | import { aller, api, url } from "./helpers.js";
  4   | import { COMPTES } from "./constantes.js";
  5   | 
  6   | /**
  7   |  * US CMD-c — Authentification
  8   |  *
  9   |  * En tant que visiteur, je veux créer un compte et me connecter afin de pouvoir
  10  |  * finaliser mes achats.
  11  |  *
  12  |  * Critères d'acceptation
  13  |  *  - Je peux créer un compte avec email et mot de passe
  14  |  *  - Je peux me connecter avec mes identifiants
  15  |  *  - Je peux me déconnecter
  16  |  *  - Mon mot de passe est stocké de manière sécurisée
  17  |  *  - Je reçois des messages d'erreur clairs en cas de problème
  18  |  *  - Ma session est maintenue lors de la navigation
  19  |  *
  20  |  * Definition of Done
  21  |  *  - Hashage sécurisé des mots de passe (bcrypt ou équivalent)
  22  |  *  - Gestion sécurisée des sessions (identifiant de session régénéré à la connexion)
  23  |  *
  24  |  * Les formulaires de connexion et de création de compte sont affichés depuis le
  25  |  * panier, au moment de valider la commande. Un test de non-superposition des
  26  |  * formulaires est ajouté en fin de fichier : il ne figure pas au sujet, mais il
  27  |  * couvre le bug corrigé dans la page panier.
  28  |  */
  29  | 
  30  | const MESSAGE_SUCCES = "Votre commande a été validée.";
  31  | 
  32  | /** Identifiant unique pour chaque création de compte : la base refuse les doublons. */
  33  | function emailUnique() {
  34  |   return `test.${Date.now()}.${Math.random().toString(36).slice(2, 8)}@exemple.fr`;
  35  | }
  36  | 
  37  | /**
  38  |  * Ajoute le premier produit au panier, puis ouvre le panier.
  39  |  * @param {import("@playwright/test").Page} page
  40  |  */
  41  | async function preparerPanier(page) {
  42  |   const { donnees } = await api(page, "produits?page=1");
  43  |   const produit = donnees.produits[0];
  44  |   expect(produit).toBeTruthy();
  45  | 
  46  |   await aller(page, `produit/${produit.slug}`);
  47  |   await page.locator('button[data-action="ajouter-panier"]').click();
  48  |   await aller(page, "panier");
  49  | }
  50  | 
  51  | /**
  52  |  * La boîte de dialogue ouverte au-dessus du panier.
  53  |  * @param {import("@playwright/test").Page} page
  54  |  */
  55  | function dialogue(page) {
  56  |   return page.getByRole("dialog");
  57  | }
  58  | 
  59  | test.describe("US CMD-c — Authentification", () => {
> 60  |   test.beforeEach(async ({ page }) => {
      |        ^ Test timeout of 30000ms exceeded while running "beforeEach" hook.
  61  |     await aller(page);
  62  |     await page.evaluate(() => window.localStorage.clear());
  63  |     await preparerPanier(page);
  64  |     await page.getByRole("button", { name: /valider/i }).first().click();
  65  |   });
  66  | 
  67  |   test("CA — Je peux créer un compte avec email et mot de passe", async ({ page }) => {
  68  |     const email = emailUnique();
  69  |     const mdp = "motdepasse-test-1";
  70  | 
  71  |     await dialogue(page).getByRole("button", { name: "Créer un compte" }).click();
  72  |     await dialogue(page).getByLabel("Adresse email").fill(email);
  73  |     await dialogue(page).getByLabel("Mot de passe", { exact: true }).fill(mdp);
  74  |     await dialogue(page).getByLabel("Confirmer le mot de passe").fill(mdp);
  75  |     await dialogue(page).getByRole("button", { name: "Créer mon compte" }).click();
  76  | 
  77  |     // Le compte est créé, puis connecté : la commande est validée.
  78  |     await expect(page.getByText(MESSAGE_SUCCES)).toBeVisible();
  79  |     await expect(dialogue(page)).toHaveCount(0);
  80  |   });
  81  | 
  82  |   test("CA — Je peux me connecter avec mes identifiants", async ({ page }) => {
  83  |     // Référence : l'API accepte bien ces identifiants.
  84  |     const reference = await api(page, "login", {
  85  |       method: "POST",
  86  |       body: { login: COMPTES.client.login, mdp: COMPTES.client.mdp },
  87  |     });
  88  |     expect(reference.statut).toBe(200);
  89  |     expect(reference.donnees.connecte).toBe(true);
  90  | 
  91  |     await dialogue(page).getByLabel("Adresse email").fill(COMPTES.client.login);
  92  |     await dialogue(page).getByLabel("Mot de passe").fill(COMPTES.client.mdp);
  93  |     await dialogue(page).getByRole("button", { name: "Me connecter" }).click();
  94  | 
  95  |     await expect(page.getByText(MESSAGE_SUCCES)).toBeVisible();
  96  |     await expect(dialogue(page)).toHaveCount(0);
  97  |   });
  98  | 
  99  |   test("CA — Je peux me déconnecter", async ({ page }) => {
  100 |     await api(page, "login", {
  101 |       method: "POST",
  102 |       body: { login: COMPTES.client.login, mdp: COMPTES.client.mdp },
  103 |     });
  104 | 
  105 |     const { statut, donnees } = await api(page, "logout", { method: "POST" });
  106 |     expect(statut).toBe(200);
  107 |     expect(donnees.connecte).toBe(false);
  108 |   });
  109 | 
  110 |   test("CA — Mon mot de passe est stocké de manière sécurisée", async ({ page }) => {
  111 |     // Le serveur ne renvoie jamais le mot de passe en clair, ni à la création
  112 |     // ni à la connexion : la réponse ne doit contenir aucune trace de lui.
  113 |     const mdp = "motdepasse-secret-42";
  114 |     const { donnees } = await api(page, "register", {
  115 |       method: "POST",
  116 |       body: { login: emailUnique(), mdp, mdp_confirmation: mdp },
  117 |     });
  118 | 
  119 |     expect(JSON.stringify(donnees)).not.toContain(mdp);
  120 |   });
  121 | 
  122 |   test("CA — Je reçois des messages d'erreur clairs en cas de problème", async ({ page }) => {
  123 |     // Référence : mauvais mot de passe refusé avec un statut 401.
  124 |     const reference = await api(page, "login", {
  125 |       method: "POST",
  126 |       body: { login: COMPTES.client.login, mdp: "mauvais-mot-de-passe" },
  127 |     });
  128 |     expect(reference.statut).toBe(401);
  129 |     expect(reference.donnees.erreur).toBeTruthy();
  130 | 
  131 |     await dialogue(page).getByLabel("Adresse email").fill(COMPTES.client.login);
  132 |     await dialogue(page).getByLabel("Mot de passe").fill("mauvais-mot-de-passe");
  133 |     await dialogue(page).getByRole("button", { name: "Me connecter" }).click();
  134 | 
  135 |     await expect(page.getByText(reference.donnees.erreur)).toBeVisible();
  136 |   });
  137 | 
  138 |   test("CA — Ma session est maintenue lors de la navigation", async ({ page }) => {
  139 |     await api(page, "login", {
  140 |       method: "POST",
  141 |       body: { login: COMPTES.client.login, mdp: COMPTES.client.mdp },
  142 |     });
  143 | 
  144 |     const cookiesAvant = await page.context().cookies();
  145 |     await aller(page, "panier");
  146 |     await aller(page);
  147 |     const cookiesApres = await page.context().cookies();
  148 | 
  149 |     expect(cookiesAvant.length).toBeGreaterThan(0);
  150 |     expect(cookiesApres.map((c) => c.name)).toEqual(cookiesAvant.map((c) => c.name));
  151 |   });
  152 | 
  153 |   test("DoD — Le hashage des mots de passe permet une connexion après une déconnexion", async ({ page }) => {
  154 |     // Un mot de passe haché doit encore être vérifié correctement : on crée un
  155 |     // compte, on se déconnecte, puis on se reconnecte avec le même mot de passe.
  156 |     const login = emailUnique();
  157 |     const mdp = "motdepasse-hash-123";
  158 | 
  159 |     const creation = await api(page, "register", {
  160 |       method: "POST",
```