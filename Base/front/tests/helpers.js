// @ts-check
import { expect } from "@playwright/test";
import { API_URL, BASE_URL } from "./constantes.js";

/**
 * Outils partagés par les tests Playwright.
 *
 * Les tests traversent le navigateur comme le ferait un visiteur : ils
 * cliquent, ils lisent l'écran, ils regardent l'adresse. Les appels directs à
 * l'API servent de référence : on compare ce que voit la page avec ce que
 * renvoie le serveur, pour que le test vérifie la même chose des deux côtés.
 */

/**
 * Adresse absolue d'une route du site.
 *
 * Le chemin est relatif ("categorie/habitat") : la base du projet est
 * ajoutée, comme le fait le routeur du front. Un chemin commence par « / »
 * serait interprété comme la racine du serveur, et perdrait la base.
 *
 * @param {string} chemin Route du site, sans la base du projet.
 * @returns {string}
 */
export function url(chemin = "") {
  return new URL(chemin.replace(/^\//, ""), BASE_URL).toString();
}

/**
 * Va à une adresse du site et attend que le routeur du front ait affiché
 * une page.
 *
 * @param {import("@playwright/test").Page} page
 * @param {string} chemin Route du site, sans la base du projet.
 */
export async function aller(page, chemin = "") {
  await page.goto(url(chemin));
  await attendreApp(page);
}

/**
 * Attend que l'application ait affiché une page (le routeur a remplacé le
 * contenu de #app).
 *
 * @param {import("@playwright/test").Page} page
 */
export async function attendreApp(page) {
  // Le routeur attend la réponse de l'API avant d'afficher la page : on lui
  // laisse le temps, l'API étant servie par le serveur de l'IUT.
  await expect(page.locator("#app")).not.toBeEmpty({ timeout: 20000 });
}

/**
 * Les cartes produit de la grille du catalogue.
 *
 * @param {import("@playwright/test").Page} page
 */
export function cartes(page) {
  return page.locator("main article");
}

/**
 * La barre de navigation des catégories, dans l'en-tête du site.
 *
 * @param {import("@playwright/test").Page} page
 */
export function menuCategories(page) {
  return page.locator("header nav");
}

/**
 * Appelle l'API depuis la page, avec les cookies de session du visiteur.
 *
 * L'appel est fait dans la page : il part donc de la même origine que le
 * front, et le cookie de session est envoyé comme dans un vrai navigateur.
 *
 * @param {import("@playwright/test").Page} page
 * @param {string} uri Chemin de l'API, sans « api/ » ("produits?page=1").
 * @param {{method?: string, body?: unknown}} [options]
 * @returns {Promise<{statut: number, donnees: any}>} Statut HTTP et JSON.
 */
export async function api(page, uri, options = {}) {
  const cible = new URL(uri.replace(/^\//, ""), API_URL).toString();

  return page.evaluate(
    async ([cible, options]) => {
      const reponse = await fetch(cible, {
        method: options.method ?? "GET",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        credentials: "same-origin",
      });

      let donnees = null;
      try {
        donnees = await reponse.json();
      } catch (e) {
        donnees = null;
      }

      return { statut: reponse.status, donnees };
    },
    [cible, options]
  );
}

/**
 * Connecte un compte par l'API, depuis la page.
 *
 * Le cookie de session est alors disponible pour les appels suivants.
 *
 * @param {import("@playwright/test").Page} page
 * @param {string} login
 * @param {string} mdp
 */
export async function connecter(page, login, mdp) {
  return api(page, "login", { method: "POST", body: { login, mdp } });
}

/**
 * Déconnecte le visiteur courant.
 *
 * @param {import("@playwright/test").Page} page
 */
export async function deconnecter(page) {
  return api(page, "logout", { method: "POST" });
}

/**
 * Attend qu'une image soit réellement chargée (et pas seulement présente dans
 * le code source).
 *
 * @param {import("@playwright/test").Locator} image
 */
export async function attendreImage(image) {
  await image.scrollIntoViewIfNeeded();
  await expect
    .poll(async () => image.evaluate((element) => element.complete && element.naturalWidth > 0), {
      timeout: 10000,
    })
    .toBe(true);
}

/**
 * Le prix affiché par l'application : un nombre, une virgule décimale et
 * l'euro ("9,95 €").
 *
 * Le motif n'est pas ancré : le texte d'un élément contient les espaces et les
 * retours à la ligne du template, et le navigateur ne les normalise que pour
 * une comparaison mot à mot.
 */
export const PRIX = /\d+[.,]\d{2}\s*€/;
