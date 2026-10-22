# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dec-b-catalogue.spec.js >> US DEC-b — Catalogue de produits >> CA — Chaque produit affiche nom, prix et image principale
- Location: tests\dec-b-catalogue.spec.js:58:3

# Error details

```
Error: expect(locator).not.toBeEmpty() failed

Locator:  locator('#app')
Expected: not empty
Received: empty

Call log:
  - Expect "not toBeEmpty" locator('#app') with timeout 20000ms
  - waiting for locator('#app')
    14 × locator resolved to <div id="app"></div>
       - unexpected value "empty"
  - Target page, context or browser has been closed

```

# Test source

```ts
  1   | // @ts-check
  2   | import { expect } from "@playwright/test";
  3   | import { API_URL, BASE_URL } from "./constantes.js";
  4   | 
  5   | /**
  6   |  * Outils partagés par les tests Playwright.
  7   |  *
  8   |  * Les tests traversent le navigateur comme le ferait un visiteur : ils
  9   |  * cliquent, ils lisent l'écran, ils regardent l'adresse. Les appels directs à
  10  |  * l'API servent de référence : on compare ce que voit la page avec ce que
  11  |  * renvoie le serveur, pour que le test vérifie la même chose des deux côtés.
  12  |  */
  13  | 
  14  | /**
  15  |  * Adresse absolue d'une route du site.
  16  |  *
  17  |  * Le chemin est relatif ("categorie/habitat") : la base du projet est
  18  |  * ajoutée, comme le fait le routeur du front. Un chemin commence par « / »
  19  |  * serait interprété comme la racine du serveur, et perdrait la base.
  20  |  *
  21  |  * @param {string} chemin Route du site, sans la base du projet.
  22  |  * @returns {string}
  23  |  */
  24  | export function url(chemin = "") {
  25  |   return new URL(chemin.replace(/^\//, ""), BASE_URL).toString();
  26  | }
  27  | 
  28  | /**
  29  |  * Va à une adresse du site et attend que le routeur du front ait affiché
  30  |  * une page.
  31  |  *
  32  |  * @param {import("@playwright/test").Page} page
  33  |  * @param {string} chemin Route du site, sans la base du projet.
  34  |  */
  35  | export async function aller(page, chemin = "") {
  36  |   await page.goto(url(chemin));
  37  |   await attendreApp(page);
  38  | }
  39  | 
  40  | /**
  41  |  * Attend que l'application ait affiché une page (le routeur a remplacé le
  42  |  * contenu de #app).
  43  |  *
  44  |  * @param {import("@playwright/test").Page} page
  45  |  */
  46  | export async function attendreApp(page) {
  47  |   // Le routeur attend la réponse de l'API avant d'afficher la page : on lui
  48  |   // laisse le temps, l'API étant servie par le serveur de l'IUT.
> 49  |   await expect(page.locator("#app")).not.toBeEmpty({ timeout: 20000 });
      |                                          ^ Error: expect(locator).not.toBeEmpty() failed
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
  140 |     .toBe(true);
  141 | }
  142 | 
  143 | /**
  144 |  * Le prix affiché par l'application : un nombre, une virgule décimale et
  145 |  * l'euro ("9,95 €").
  146 |  *
  147 |  * Le motif n'est pas ancré : le texte d'un élément contient les espaces et les
  148 |  * retours à la ligne du template, et le navigateur ne les normalise que pour
  149 |  * une comparaison mot à mot.
```