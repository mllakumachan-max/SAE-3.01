/**
 * Métadonnées de la page : ce que les moteurs de recherche et les réseaux
 * sociaux lisent quand quelqu'un partage un lien.
 *
 * L'application est une SPA : le document servi par le serveur est toujours le
 * même. Sans ce module, toutes les pages se-webkit announces « SAE301 -
 * Action », et un lien vers un produit ne dit pas de quoi il s'agit.
 *
 * Le module ne fait qu'écrire dans le <head> : il ne décide rien du contenu,
 * il ne fait qu'y recopier ce que la page a décidé.
 */

const TITRE_SITE = "Click & Collect";

/**
 * Crée la balise <meta> si elle n'existe pas, ou met son contenu à jour.
 *
 * @param {string} attribut "name" ou "property".
 * @param {string} cle      La clé de la balise, par exemple "description".
 * @param {string} contenu  Le texte à écrire.
 */
function ecrireMeta(attribut, cle, contenu) {
  if (!contenu) return;

  let balise = document.head.querySelector(`meta[${attribut}="${cle}"]`);

  if (!balise) {
    balise = document.createElement("meta");
    balise.setAttribute(attribut, cle);
    document.head.appendChild(balise);
  }

  balise.setAttribute("content", contenu);
}

/**
 * Écrit (ou met à jour) le lien canonique : l'adresse de la page, sans
 * paramètres de navigation.
 */
function ecrireLienCanonique(url) {
  if (!url) return;

  let lien = document.head.querySelector('link[rel="canonical"]');

  if (!lien) {
    lien = document.createElement("link");
    lien.setAttribute("rel", "canonical");
    document.head.appendChild(lien);
  }

  lien.setAttribute("href", url);
}

/**
 * Adresse absolue d'une route du projet, par exemple
 * « https://…/~ribatet1/SAE-3.01/Base/produit/couette-sans-housse-easy ».
 *
 * @param {string} chemin Route du projet, commençant par « / ».
 * @returns {string}
 */
export function urlAbsolue(chemin = "/") {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const route = chemin.startsWith("/") ? chemin : `/${chemin}`;

  return `${window.location.origin}${base}${route}`;
}

/**
 * Adresse absolue d'une image. Les réseaux sociaux attendent une adresse
 * complète, pas un chemin relatif au site.
 */
function urlImageAbsolue(image) {
  if (!image) return "";
  if (/^https?:\/\//.test(image)) return image;

  return `${window.location.origin}${image}`;
}

/**
 * Applique les métadonnées d'une page.
 *
 * @param {{
 *   titre?: string,
 *   description?: string,
 *   image?: string,
 *   chemin?: string,
 *   type?: string
 * }} donnees
 */
export function appliquerSeo({ titre, description, image, chemin, type = "website" } = {}) {
  const titreComplet = titre ? `${titre} | ${TITRE_SITE}` : TITRE_SITE;
  const url = chemin ? urlAbsolue(chemin) : window.location.href;

  document.title = titreComplet;

  ecrireMeta("name", "description", description);

  ecrireMeta("property", "og:site_name", TITRE_SITE);
  ecrireMeta("property", "og:title", titreComplet);
  ecrireMeta("property", "og:description", description);
  ecrireMeta("property", "og:type", type);
  ecrireMeta("property", "og:url", url);
  ecrireMeta("property", "og:locale", "fr_FR");

  ecrireMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
  ecrireMeta("name", "twitter:title", titreComplet);
  ecrireMeta("name", "twitter:description", description);

  if (image) {
    const adresse = urlImageAbsolue(image);

    ecrireMeta("property", "og:image", adresse);
    ecrireMeta("name", "twitter:image", adresse);
  }

  ecrireLienCanonique(url);
}
