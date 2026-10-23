# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dec-c-produit.spec.js >> US DEC-c — Détail d'un produit >> CA — Je vois une galerie d'images du produit
- Location: tests/dec-c-produit.spec.js:55:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false

Call Log:
- Timeout 10000ms exceeded while waiting on the predicate
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
  40  | /**
  41  |  * Attend que l'application ait affiché une page (le routeur a remplacé le
  42  |  * contenu de #app).
  43  |  *
  44  |  * @param {import("@playwright/test").Page} page
  45  |  */
  46  | export async function attendreApp(page) {
  47  |   // Le routeur attend la réponse de l'API avant d'afficher la page : on lui
  48  |   // laisse le temps, l'API étant servie par le serveur de l'IUT.
  49  |   await expect(page.locator("#app")).not.toBeEmpty({ timeout: 20000 });
  50  | }
  51  | 
  52  | /**
  53  |  * Les cartes produit de la grille du catalogue.
  54  |  *
  55  |  * @param {import("@playwright/test").Page} page
  56  |  */
  57  | export function cartes(page) {
  58  |   return page.locator("main article");
  59  | }
  60  | 
  61  | /**
  62  |  * La barre de navigation des catégories, dans l'en-tête du site.
  63  |  *
  64  |  * @param {import("@playwright/test").Page} page
  65  |  */
  66  | export function menuCategories(page) {
  67  |   return page.locator("header nav");
  68  | }
  69  | 
  70  | /**
  71  |  * Appelle l'API depuis la page, avec les cookies de session du visiteur.
  72  |  *
  73  |  * L'appel est fait dans la page : il part donc de la même origine que le
  74  |  * front, et le cookie de session est envoyé comme dans un vrai navigateur.
  75  |  *
  76  |  * @param {import("@playwright/test").Page} page
  77  |  * @param {string} uri Chemin de l'API, sans « api/ » ("produits?page=1").
  78  |  * @param {{method?: string, body?: unknown}} [options]
  79  |  * @returns {Promise<{statut: number, donnees: any}>} Statut HTTP et JSON.
  80  |  */
  81  | export async function api(page, uri, options = {}) {
  82  |   const cible = new URL(uri.replace(/^\//, ""), API_URL).toString();
  83  | 
  84  |   return page.evaluate(
  85  |     async ([cible, options]) => {
  86  |       const reponse = await fetch(cible, {
  87  |         method: options.method ?? "GET",
  88  |         headers: { Accept: "application/json", "Content-Type": "application/json" },
  89  |         body: options.body === undefined ? undefined : JSON.stringify(options.body),
  90  |         credentials: "same-origin",
  91  |       });
  92  | 
  93  |       let donnees = null;
  94  |       try {
  95  |         donnees = await reponse.json();
  96  |       } catch (e) {
  97  |         donnees = null;
  98  |       }
  99  | 
  100 |       return { statut: reponse.status, donnees };
  101 |     },
  102 |     [cible, options]
  103 |   );
  104 | }
  105 | 
  106 | /**
  107 |  * Connecte un compte par l'API, depuis la page.
  108 |  *
  109 |  * Le cookie de session est alors disponible pour les appels suivants.
  110 |  *
  111 |  * @param {import("@playwright/test").Page} page
  112 |  * @param {string} login
  113 |  * @param {string} mdp
  114 |  */
  115 | export async function connecter(page, login, mdp) {
  116 |   return api(page, "login", { method: "POST", body: { login, mdp } });
  117 | }
  118 | 
  119 | /**
  120 |  * Déconnecte le visiteur courant.
  121 |  *
  122 |  * @param {import("@playwright/test").Page} page
  123 |  */
  124 | export async function deconnecter(page) {
  125 |   return api(page, "logout", { method: "POST" });
  126 | }
  127 | 
  128 | /**
  129 |  * Attend qu'une image soit réellement chargée (et pas seulement présente dans
  130 |  * le code source).
  131 |  *
  132 |  * @param {import("@playwright/test").Locator} image
  133 |  */
  134 | export async function attendreImage(image) {
  135 |   await image.scrollIntoViewIfNeeded();
  136 |   await expect
  137 |     .poll(async () => image.evaluate((element) => element.complete && element.naturalWidth > 0), {
  138 |       timeout: 10000,
  139 |     })
> 140 |     .toBe(true);
      |      ^ Error: expect(received).toBe(expected) // Object.is equality
  141 | }
  142 | 
  143 | /**
  144 |  * Le prix affiché par l'application : un nombre, une virgule décimale et
  145 |  * l'euro ("9,95 €").
  146 |  *
  147 |  * Le motif n'est pas ancré : le texte d'un élément contient les espaces et les
  148 |  * retours à la ligne du template, et le navigateur ne les normalise que pour
  149 |  * une comparaison mot à mot.
  150 |  */
  151 | export const PRIX = /\d+[.,]\d{2}\s*€/;
  152 | 
```